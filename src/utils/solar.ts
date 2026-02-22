
export interface ModuleSpecs {
  power: number; // Watts
  voc: number; // Volts
  vmp: number; // Volts
  isc: number; // Amps
  imp: number; // Amps
  tempCoeffVoc: number; // %/°C (usually negative, e.g., -0.29)
  tempCoeffVmp: number; // %/°C (usually negative, e.g., -0.35)
}

export interface InverterSpecs {
  maxInputVoltage: number; // Volts
  minMpptVoltage: number; // Volts
  maxMpptVoltage: number; // Volts
  maxInputCurrent: number; // Amps
}

export interface SiteConditions {
  minTemp: number; // °C
  maxTemp: number; // °C
}

export interface SizingResult {
  maxModules: number;
  minModules: number;
  vocMax: number; // Voc at min temp
  vmpMin: number; // Vmp at max temp
  isCompatible: boolean;
  warnings: string[];
  errorFields: string[];
  warningFields: string[];
}

export function calculateStringSizing(
  module: ModuleSpecs,
  inverter: InverterSpecs,
  site: SiteConditions
): SizingResult {
  const warnings: string[] = [];
  const errorFields: string[] = [];
  const warningFields: string[] = [];

  // 1. Calculate Temperature Corrected Voltages
  // Formula: V_new = V_stc * (1 + (T_new - 25) * (Coeff / 100))
  
  // Voc rises as temp drops. We need Voc at Min Temp to ensure we don't blow the inverter.
  const vocMax = module.voc * (1 + (site.minTemp - 25) * (module.tempCoeffVoc / 100));
  
  // Vmp drops as temp rises. We need Vmp at Max Temp to ensure we stay above Min MPPT.
  const vmpMin = module.vmp * (1 + (site.maxTemp - 25) * (module.tempCoeffVmp / 100));

  // 2. Calculate Limits
  const maxModules = Math.floor(inverter.maxInputVoltage / vocMax);
  const minModules = Math.ceil(inverter.minMpptVoltage / vmpMin);

  // 3. Validation
  if (vocMax > inverter.maxInputVoltage) {
    warnings.push("A tensão de circuito aberto (Voc) de um único módulo excede a entrada máxima do inversor em baixa temperatura!");
    errorFields.push("module.voc", "site.minTemp", "inverter.maxInputVoltage");
  }

  if (minModules > maxModules) {
    warnings.push("Incompatível: O número mínimo de módulos excede o máximo permitido.");
    errorFields.push("inverter.minMpptVoltage", "inverter.maxInputVoltage", "module.voc", "module.vmp");
  }

  if (module.imp > inverter.maxInputCurrent) {
    warnings.push(`Atenção: A corrente do módulo (${module.imp}A) excede a corrente máxima do inversor (${inverter.maxInputCurrent}A). O inversor irá limitar a potência (clipping).`);
    warningFields.push("module.imp", "inverter.maxInputCurrent");
  }

  return {
    maxModules: Math.max(0, maxModules),
    minModules: Math.max(0, minModules),
    vocMax,
    vmpMin,
    isCompatible: warnings.length === 0 || (warnings.length === 1 && warnings[0].includes("clipping")), // Clipping is often acceptable design
    warnings,
    errorFields,
    warningFields
  };
}
