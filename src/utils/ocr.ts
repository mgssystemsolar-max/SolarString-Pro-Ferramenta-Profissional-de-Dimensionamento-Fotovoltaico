import { createWorker } from 'tesseract.js';
import { InverterSpecs } from './solar';

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
