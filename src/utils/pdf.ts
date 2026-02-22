import jsPDF from 'jspdf';
import { SizingResult, ModuleSpecs, InverterSpecs, SiteConditions } from './solar';

export function generatePDF(
  result: SizingResult,
  module: ModuleSpecs,
  inverter: InverterSpecs,
  site: SiteConditions,
  moduleName: string = "Custom Module"
) {
  const doc = new jsPDF();
  const lineHeight = 10;
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 128, 0); // Green color
  doc.text("SolarString Pro - Relatório Técnico", 10, y);
  y += lineHeight * 2;

  // Module Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Especificações do Módulo:", 10, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.text(`Modelo: ${moduleName}`, 15, y);
  y += lineHeight;
  doc.text(`Potência: ${module.power} W`, 15, y);
  y += lineHeight;
  doc.text(`Voc: ${module.voc} V`, 15, y);
  y += lineHeight;
  doc.text(`Vmp: ${module.vmp} V`, 15, y);
  y += lineHeight * 1.5;

  // Inverter Info
  doc.setFont("helvetica", "bold");
  doc.text("Especificações do Inversor:", 10, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.text(`Tensão Máxima Entrada: ${inverter.maxInputVoltage} V`, 15, y);
  y += lineHeight;
  doc.text(`Faixa MPPT: ${inverter.minMpptVoltage} V - ${inverter.maxMpptVoltage} V`, 15, y);
  y += lineHeight;
  doc.text(`Corrente Máxima: ${inverter.maxInputCurrent} A`, 15, y);
  y += lineHeight * 1.5;

  // Results
  doc.setFont("helvetica", "bold");
  doc.text("Resultados do Dimensionamento:", 10, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.text(`Mínimo de Módulos por String: ${result.minModules}`, 15, y);
  y += lineHeight;
  doc.text(`Máximo de Módulos por String: ${result.maxModules}`, 15, y);
  y += lineHeight;
  doc.text(`Voc Máx (@ ${site.minTemp}°C): ${result.vocMax.toFixed(1)} V`, 15, y);
  y += lineHeight;
  doc.text(`Vmp Mín (@ ${site.maxTemp}°C): ${result.vmpMin.toFixed(1)} V`, 15, y);
  y += lineHeight * 1.5;

  // Status
  if (result.isCompatible) {
    doc.setTextColor(0, 128, 0);
    doc.setFont("helvetica", "bold");
    doc.text("STATUS: COMPATÍVEL", 10, y);
  } else {
    doc.setTextColor(255, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("STATUS: INCOMPATÍVEL", 10, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    result.warnings.forEach((w) => {
      doc.text(`- ${w}`, 15, y);
      y += lineHeight;
    });
  }

  doc.save("dimensionamento-solar.pdf");
}
