import { createWorker } from 'tesseract.js';
import { InverterSpecs, ModuleSpecs } from './solar';

export async function extractInverterData(imageFile: File): Promise<Partial<InverterSpecs>> {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageFile);
    
    // Regex patterns from user request, slightly adapted
    const vmaxMatch = text.match(/(1000|1100|1200|1500)/);
    const mpptMatch = text.match(/(\d{3})\s*-\s*(\d{3})/);
    const currentMatch = text.match(/(\d{1,2})A/);

    const specs: Partial<InverterSpecs> = {};

    if (vmaxMatch) {
      specs.maxInputVoltage = parseInt(vmaxMatch[0]);
    }

    if (mpptMatch) {
      specs.minMpptVoltage = parseInt(mpptMatch[1]);
      specs.maxMpptVoltage = parseInt(mpptMatch[2]);
    }

    if (currentMatch) {
      specs.maxInputCurrent = parseInt(currentMatch[1]);
    }

    return specs;
  } finally {
    await worker.terminate();
  }
}

export async function extractModuleData(imageFile: File): Promise<Partial<ModuleSpecs>> {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageFile);
    
    // Improved Regex patterns for Module Datasheets
    // Power: Look for 3 digits followed by W, e.g., 550W, 550 W
    const powerMatch = text.match(/(\d{3})\s*W/i);
    
    // Voc: Look for Voc or Open Circuit Voltage followed by number
    const vocMatch = text.match(/Voc.*?(\d{2,3}[.,]\d{1,2})/i) || text.match(/Open.*?Voltage.*?(\d{2,3}[.,]\d{1,2})/i);
    
    // Vmp: Look for Vmp or Voltage at Pmax followed by number
    const vmpMatch = text.match(/Vmp.*?(\d{2,3}[.,]\d{1,2})/i) || text.match(/Voltage.*?Pmax.*?(\d{2,3}[.,]\d{1,2})/i);
    
    // Isc: Look for Isc or Short Circuit Current followed by number
    const iscMatch = text.match(/Isc.*?(\d{1,2}[.,]\d{1,2})/i) || text.match(/Short.*?Current.*?(\d{1,2}[.,]\d{1,2})/i);
    
    // Imp: Look for Imp or Current at Pmax followed by number
    const impMatch = text.match(/Imp.*?(\d{1,2}[.,]\d{1,2})/i) || text.match(/Current.*?Pmax.*?(\d{1,2}[.,]\d{1,2})/i);
    
    // Temp Coeffs: Look for negative number followed by %/C
    // This is harder to distinguish, so we might need to look for specific keywords like "Temperature Coefficient of Voc"
    const tempVocMatch = text.match(/Temperature.*?Voc.*?(-0[.,]\d{2,4})/i);
    const tempVmpMatch = text.match(/Temperature.*?Pmax.*?(-0[.,]\d{2,4})/i); // Often Pmax coeff is used if Vmp not found, but let's try to be specific if possible or default

    const specs: Partial<ModuleSpecs> = {};

    const parseValue = (match: RegExpMatchArray | null) => {
      if (!match) return undefined;
      return parseFloat(match[1].replace(',', '.'));
    };

    if (powerMatch) specs.power = parseValue(powerMatch);
    if (vocMatch) specs.voc = parseValue(vocMatch);
    if (vmpMatch) specs.vmp = parseValue(vmpMatch);
    if (iscMatch) specs.isc = parseValue(iscMatch);
    if (impMatch) specs.imp = parseValue(impMatch);
    if (tempVocMatch) specs.tempCoeffVoc = parseValue(tempVocMatch);
    // Note: Temp Coeff Vmp is rarely explicitly listed as "Vmp", often "Pmax" or "Voc" are the main ones. 
    // Sometimes it is listed. Let's assume Pmax coeff is close enough or use a default if not found.
    // Actually, let's look for "Temperature Coefficient of Vmp" specifically or just leave undefined to let user fill/default.
    
    return specs;
  } finally {
    await worker.terminate();
  }
}
