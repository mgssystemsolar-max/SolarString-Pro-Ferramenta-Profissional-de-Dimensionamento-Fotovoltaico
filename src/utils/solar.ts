
export interface ModuleSpecs {
  model?: string; // Model Name
  power: number; // Watts
  voc: number; // Volts
  vmp: number; // Volts
  isc: number; // Amps
  imp: number; // Amps
  tempCoeffVoc: number; // %/°C (usually negative, e.g., -0.29)
  tempCoeffVmp: number; // %/°C (usually negative, e.g., -0.35)
}

export interface InverterSpecs {
  model?: string; // Model Name
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

  // --- 0. Input Sanity Checks ---

  // Module Checks
  if (module.power <= 0) {
    warnings.push("A potência do módulo deve ser maior que 0.");
    errorFields.push("module.power");
  }
  if (module.voc <= 0) {
    warnings.push("A tensão de circuito aberto (Voc) deve ser maior que 0.");
    errorFields.push("module.voc");
  }
  if (module.vmp <= 0) {
    warnings.push("A tensão de máxima potência (Vmp) deve ser maior que 0.");
    errorFields.push("module.vmp");
  }
  if (module.vmp >= module.voc && module.voc > 0) {
    warnings.push("A tensão Vmp deve ser menor que Voc.");
    errorFields.push("module.vmp", "module.voc");
  }
  if (module.isc <= 0) {
    warnings.push("A corrente de curto-circuito (Isc) deve ser maior que 0.");
    errorFields.push("module.isc");
  }
  if (module.imp <= 0) {
    warnings.push("A corrente de máxima potência (Imp) deve ser maior que 0.");
    errorFields.push("module.imp");
  }
  if (module.imp >= module.isc && module.isc > 0) {
    warnings.push("A corrente Imp deve ser menor que Isc.");
    errorFields.push("module.imp", "module.isc");
  }
  if (module.tempCoeffVoc > 0) {
    warnings.push("O coeficiente de temperatura do Voc geralmente é negativo.");
    warningFields.push("module.tempCoeffVoc");
  }
  if (module.tempCoeffVmp > 0) {
    warnings.push("O coeficiente de temperatura do Vmp (Pmax) geralmente é negativo.");
    warningFields.push("module.tempCoeffVmp");
  }

  // Inverter Checks
  if (inverter.maxInputVoltage <= 0) {
    warnings.push("A tensão máxima de entrada do inversor deve ser maior que 0.");
    errorFields.push("inverter.maxInputVoltage");
  }
  if (inverter.minMpptVoltage < 0) {
    warnings.push("A tensão mínima do MPPT não pode ser negativa.");
    errorFields.push("inverter.minMpptVoltage");
  }
  if (inverter.maxMpptVoltage <= inverter.minMpptVoltage) {
    warnings.push("A tensão máxima do MPPT deve ser maior que a mínima.");
    errorFields.push("inverter.maxMpptVoltage", "inverter.minMpptVoltage");
  }
  if (inverter.maxMpptVoltage > inverter.maxInputVoltage) {
    warnings.push("A tensão máxima do MPPT não deve exceder a tensão máxima de entrada.");
    warningFields.push("inverter.maxMpptVoltage", "inverter.maxInputVoltage");
  }
  if (inverter.maxInputCurrent <= 0) {
    warnings.push("A corrente máxima de entrada do inversor deve ser maior que 0.");
    errorFields.push("inverter.maxInputCurrent");
  }

  // Site Checks
  if (site.minTemp > site.maxTemp) {
    warnings.push("A temperatura mínima não pode ser maior que a máxima.");
    errorFields.push("site.minTemp", "site.maxTemp");
  }

  // If we have critical errors, stop calculation or return early with errors
  if (errorFields.length > 0) {
    return {
      maxModules: 0,
      minModules: 0,
      vocMax: 0,
      vmpMin: 0,
      isCompatible: false,
      warnings,
      errorFields,
      warningFields
    };
  }

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
