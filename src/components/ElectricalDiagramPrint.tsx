import React from 'react';
import { ModuleSpecs, InverterSpecs, SizingResult } from '../utils/solar';

interface ElectricalDiagramPrintProps {
  module: ModuleSpecs;
  inverter: InverterSpecs;
  result: SizingResult;
  concessionaria: string;
  clientName: string;
  projectName: string;
  onClose: () => void;
}

export function ElectricalDiagramPrint({
  module,
  inverter,
  result,
  concessionaria,
  clientName,
  projectName,
  onClose
}: ElectricalDiagramPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto print:overflow-visible print:bg-white">
      {/* Non-printable controls */}
      <div className="fixed top-4 right-4 flex gap-2 print:hidden z-50">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 font-medium flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Imprimir Diagrama
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg shadow hover:bg-slate-300 font-medium"
        >
          Fechar
        </button>
      </div>

      {/* Printable Area */}
      <div className="max-w-[1100px] mx-auto p-8 print:p-0 print:m-0 bg-white min-h-screen">
        
        {/* Header / Title Block */}
        <div className="border-4 border-slate-900 p-4 mb-8 flex flex-col">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wider">Diagrama Unifilar Fotovoltaico</h1>
              <h2 className="text-lg text-slate-600 font-medium mt-1">Concessionária: {concessionaria || 'Enel Ceará'}</h2>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl">PROJETO ELÉTRICO</div>
              <div className="text-sm text-slate-600 mt-1">Data: {currentDate}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold">Cliente:</span> {clientName || 'Não informado'}
            </div>
            <div>
              <span className="font-bold">Projeto:</span> {projectName || 'Sistema Fotovoltaico'}
            </div>
            <div>
              <span className="font-bold">Módulo:</span> {module.model || 'Genérico'} ({module.power}W)
            </div>
            <div>
              <span className="font-bold">Inversor:</span> {inverter.model || 'Genérico'}
            </div>
            <div>
              <span className="font-bold">Arranjo (String):</span> {result.minModules} a {result.maxModules} módulos por MPPT
            </div>
            <div>
              <span className="font-bold">Qtd. MPPTs:</span> {inverter.numMppts || 1}
            </div>
          </div>
        </div>

        {/* Diagram SVG */}
        <div className="w-full border-2 border-slate-900 p-8 flex justify-center items-center bg-white" style={{ minHeight: '600px' }}>
          <svg width="100%" height="100%" viewBox="0 0 1100 600" preserveAspectRatio="xMidYMid meet" className="font-sans">
            {/* Grid Background for CAD feel */}
            <defs>
              <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
              </pattern>
              <pattern id="cad-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#cad-grid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cad-grid-major)" />

            {/* Grounding Bar (BEP) */}
            <g transform="translate(50, 450)">
              <line x1="0" y1="0" x2="950" y2="0" stroke="#16a34a" strokeWidth="3" strokeDasharray="10 5"/>
              <text x="475" y="20" textAnchor="middle" className="text-sm font-bold fill-green-800">BARRAMENTO DE EQUIPOTENCIALIZAÇÃO (BEP) / ATERRAMENTO</text>
              
              {/* Grounding Rods */}
              <line x1="900" y1="0" x2="900" y2="40" stroke="#16a34a" strokeWidth="3"/>
              <line x1="880" y1="40" x2="920" y2="40" stroke="#16a34a" strokeWidth="3"/>
              <line x1="890" y1="50" x2="910" y2="50" stroke="#16a34a" strokeWidth="3"/>
              <line x1="895" y1="60" x2="905" y2="60" stroke="#16a34a" strokeWidth="3"/>
            </g>

            {/* 1. PV Array */}
            <g transform="translate(50, 150)">
              {/* Panels */}
              <rect x="0" y="0" width="40" height="80" fill="#f0f9ff" stroke="#0369a1" strokeWidth="2" rx="2"/>
              <line x1="0" y1="26" x2="40" y2="26" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              <line x1="0" y1="53" x2="40" y2="53" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              <line x1="20" y1="0" x2="20" y2="80" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              
              <rect x="50" y="0" width="40" height="80" fill="#f0f9ff" stroke="#0369a1" strokeWidth="2" rx="2"/>
              <line x1="50" y1="26" x2="90" y2="26" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              <line x1="50" y1="53" x2="90" y2="53" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              <line x1="70" y1="0" x2="70" y2="80" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              
              <circle cx="110" cy="40" r="2" fill="#0369a1"/>
              <circle cx="125" cy="40" r="2" fill="#0369a1"/>
              <circle cx="140" cy="40" r="2" fill="#0369a1"/>
              
              <rect x="160" y="0" width="40" height="80" fill="#f0f9ff" stroke="#0369a1" strokeWidth="2" rx="2"/>
              <line x1="160" y1="26" x2="200" y2="26" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              <line x1="160" y1="53" x2="200" y2="53" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              <line x1="180" y1="0" x2="180" y2="80" stroke="#0369a1" strokeWidth="1" opacity="0.5"/>
              
              {/* Series connection */}
              <path d="M40,15 L50,15 M90,15 L100,15 M150,15 L160,15" stroke="#dc2626" strokeWidth="2"/>
              <path d="M40,65 L50,65 M90,65 L100,65 M150,65 L160,65" stroke="#0f172a" strokeWidth="2"/>
              
              {/* Grounding PV */}
              <path d="M20,80 L20,100 L180,100 L180,80" stroke="#16a34a" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
              <line x1="100" y1="100" x2="100" y2="300" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 4"/>
              <circle cx="100" cy="300" r="4" fill="#16a34a"/>
              
              <text x="100" y="-25" textAnchor="middle" className="text-sm font-bold fill-slate-900">ARRANJO FOTOVOLTAICO</text>
              <text x="100" y="-10" textAnchor="middle" className="text-xs font-bold fill-slate-700">{result.minModules} a {result.maxModules} Módulos em Série</text>
              <text x="100" y="125" textAnchor="middle" className="text-xs fill-slate-600">{module.power}W / Voc: {module.voc}V / Isc: {module.isc}A</text>
            </g>

            {/* Wiring PV to String Box */}
            <path d="M250,165 L320,165" stroke="#dc2626" strokeWidth="3"/>
            <text x="285" y="155" textAnchor="middle" className="text-sm font-bold fill-red-700">+</text>
            <path d="M250,215 L320,215" stroke="#0f172a" strokeWidth="3"/>
            <text x="285" y="205" textAnchor="middle" className="text-sm font-bold fill-slate-900">-</text>
            <text x="285" y="235" textAnchor="middle" className="text-[10px] font-bold fill-slate-600">Cabo Solar 4mm²/6mm²</text>

            {/* 2. String Box DC */}
            <g transform="translate(320, 100)">
              <rect x="0" y="0" width="140" height="160" fill="#ffffff" stroke="#475569" strokeWidth="2" strokeDasharray="8 4" rx="4"/>
              <text x="70" y="-10" textAnchor="middle" className="text-sm font-bold fill-slate-900">STRING BOX CC</text>
              
              {/* Positive Line */}
              <path d="M0,65 L140,65" stroke="#dc2626" strokeWidth="3"/>
              {/* Negative Line */}
              <path d="M0,115 L140,115" stroke="#0f172a" strokeWidth="3"/>
              
              {/* DPS DC */}
              <rect x="30" y="75" width="20" height="30" fill="#f8fafc" stroke="#0f172a" strokeWidth="2"/>
              <line x1="30" y1="105" x2="50" y2="75" stroke="#0f172a" strokeWidth="2"/>
              <path d="M40,65 L40,75 M40,105 L40,115" stroke="#0f172a" strokeWidth="2"/>
              <text x="40" y="135" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">DPS CC</text>
              <text x="40" y="148" textAnchor="middle" className="text-[9px] fill-slate-600">1000V</text>
              
              {/* Chave Seccionadora DC */}
              <circle cx="95" cy="65" r="3" fill="#0f172a"/>
              <circle cx="115" cy="65" r="3" fill="#0f172a"/>
              <line x1="95" y1="65" x2="110" y2="50" stroke="#0f172a" strokeWidth="2.5"/>
              
              <circle cx="95" cy="115" r="3" fill="#0f172a"/>
              <circle cx="115" cy="115" r="3" fill="#0f172a"/>
              <line x1="95" y1="115" x2="110" y2="100" stroke="#0f172a" strokeWidth="2.5"/>
              
              <line x1="102" y1="58" x2="102" y2="108" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 4"/>
              <text x="105" y="135" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">Chave CC</text>

              {/* Grounding String Box */}
              <path d="M40,115 L40,160" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 4"/>
              <circle cx="40" cy="160" r="3" fill="#16a34a"/>
              <line x1="40" y1="160" x2="40" y2="350" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 4"/>
              <circle cx="40" cy="350" r="4" fill="#16a34a"/>
            </g>

            {/* Wiring String Box to Inverter */}
            <path d="M460,165 L520,165" stroke="#dc2626" strokeWidth="3"/>
            <path d="M460,215 L520,215" stroke="#0f172a" strokeWidth="3"/>

            {/* 3. Inverter */}
            <g transform="translate(520, 80)">
              <rect x="0" y="0" width="160" height="200" rx="8" fill="#ffffff" stroke="#1e293b" strokeWidth="3" className="shadow-md"/>
              <text x="80" y="-10" textAnchor="middle" className="text-sm font-bold fill-slate-900">INVERSOR INTERATIVO</text>
              <text x="80" y="220" textAnchor="middle" className="text-xs font-bold fill-slate-700">{inverter.model || 'Inversor'}</text>
              
              {/* DC/AC Symbol */}
              <line x1="0" y1="200" x2="160" y2="0" stroke="#cbd5e1" strokeWidth="2"/>
              <text x="35" y="50" textAnchor="middle" className="text-xl font-bold fill-slate-400">CC</text>
              <text x="125" y="160" textAnchor="middle" className="text-xl font-bold fill-slate-400">CA</text>
              
              <path d="M20,65 L50,65 M20,75 L50,75" stroke="#64748b" strokeWidth="2"/>
              <path d="M110,175 Q125,160 140,175 T170,175" stroke="#64748b" strokeWidth="2" fill="none"/>
              
              {/* MPPT Info */}
              <rect x="15" y="100" width="70" height="60" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2"/>
              <text x="50" y="120" textAnchor="middle" className="text-[11px] font-bold fill-slate-800">MPPT</text>
              <text x="50" y="135" textAnchor="middle" className="text-[10px] fill-slate-700">{result.vmpMin.toFixed(1)}V - {result.vocMax.toFixed(1)}V</text>
              <text x="50" y="150" textAnchor="middle" className="text-[10px] fill-slate-700">Máx: {inverter.maxInputVoltage}V</text>
              
              {/* Grounding Inverter */}
              <circle cx="80" cy="200" r="3" fill="#16a34a"/>
              <line x1="80" y1="200" x2="80" y2="370" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 4"/>
              <circle cx="80" cy="370" r="4" fill="#16a34a"/>
            </g>

            {/* Wiring Inverter to QGBT */}
            <path d="M680,160 L750,160" stroke="#0f172a" strokeWidth="4"/>
            <line x1="705" y1="145" x2="725" y2="175" stroke="#0f172a" strokeWidth="2"/>
            <line x1="715" y1="145" x2="735" y2="175" stroke="#0f172a" strokeWidth="2"/>
            <line x1="725" y1="145" x2="745" y2="175" stroke="#0f172a" strokeWidth="2"/>
            <text x="715" y="135" textAnchor="middle" className="text-xs font-bold fill-slate-800">Cabo CA</text>
            <text x="715" y="195" textAnchor="middle" className="text-[10px] font-bold fill-slate-600">F+N+T ou 2F+T</text>

            {/* 4. QGBT (Quadro AC) */}
            <g transform="translate(750, 80)">
              <rect x="0" y="0" width="130" height="200" fill="#ffffff" stroke="#475569" strokeWidth="2" strokeDasharray="8 4" rx="4"/>
              <text x="65" y="-10" textAnchor="middle" className="text-sm font-bold fill-slate-900">QUADRO CA (QGBT)</text>
              
              <path d="M0,80 L130,80" stroke="#0f172a" strokeWidth="4"/>
              
              {/* Disjuntor AC */}
              <rect x="25" y="65" width="30" height="30" fill="#f8fafc" stroke="#0f172a" strokeWidth="2"/>
              <path d="M30,80 L50,80 M40,70 L40,90" stroke="#0f172a" strokeWidth="2"/>
              <text x="40" y="115" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">Disjuntor CA</text>
              <text x="40" y="128" textAnchor="middle" className="text-[9px] fill-slate-600">Termomagnético</text>
              
              {/* DPS AC */}
              <rect x="85" y="80" width="20" height="30" fill="#f8fafc" stroke="#0f172a" strokeWidth="2"/>
              <line x1="85" y1="110" x2="105" y2="80" stroke="#0f172a" strokeWidth="2"/>
              <path d="M95,80 L95,80" stroke="#0f172a" strokeWidth="2"/>
              <text x="95" y="130" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">DPS CA</text>
              <text x="95" y="143" textAnchor="middle" className="text-[9px] fill-slate-600">Classe II</text>

              {/* Grounding QGBT */}
              <path d="M95,110 L95,160" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 4"/>
              <circle cx="95" cy="160" r="3" fill="#16a34a"/>
              <line x1="95" y1="160" x2="95" y2="370" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 4"/>
              <circle cx="95" cy="370" r="4" fill="#16a34a"/>
            </g>

            {/* Wiring QGBT to Meter */}
            <path d="M880,160 L950,160" stroke="#0f172a" strokeWidth="4"/>
            <line x1="905" y1="145" x2="925" y2="175" stroke="#0f172a" strokeWidth="2"/>
            <line x1="915" y1="145" x2="935" y2="175" stroke="#0f172a" strokeWidth="2"/>

            {/* 5. Grid / Meter */}
            <g transform="translate(950, 110)">
              <rect x="0" y="0" width="60" height="80" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2"/>
              <circle cx="30" cy="40" r="20" fill="#f8fafc" stroke="#0f172a" strokeWidth="2"/>
              <text x="30" y="45" textAnchor="middle" className="text-sm font-bold fill-slate-900">kWh</text>
              <text x="30" y="100" textAnchor="middle" className="text-xs font-bold fill-slate-800">Medidor</text>
              <text x="30" y="115" textAnchor="middle" className="text-[10px] fill-slate-600">Bidirecional</text>
              
              <path d="M60,40 L90,40" stroke="#0f172a" strokeWidth="4"/>
              
              {/* Utility Pole / Grid Symbol */}
              <line x1="90" y1="-30" x2="90" y2="120" stroke="#0f172a" strokeWidth="4"/>
              <line x1="70" y1="-10" x2="110" y2="-10" stroke="#0f172a" strokeWidth="3"/>
              <line x1="75" y1="10" x2="105" y2="10" stroke="#0f172a" strokeWidth="3"/>
              <text x="90" y="-45" textAnchor="middle" className="text-sm font-bold fill-slate-900">REDE ELÉTRICA</text>
              <text x="90" y="-60" textAnchor="middle" className="text-lg font-bold fill-indigo-700">{concessionaria || 'Concessionária'}</text>
            </g>

            {/* Notes */}
            <g transform="translate(50, 520)">
              <text x="0" y="0" className="text-xs font-bold fill-slate-800">NOTAS TÉCNICAS:</text>
              <text x="0" y="18" className="text-[11px] fill-slate-700">1. Este diagrama é um modelo unifilar/multifilar para referência de projeto elétrico fotovoltaico.</text>
              <text x="0" y="36" className="text-[11px] fill-slate-700">2. O aterramento deve seguir a norma NBR 5410 e as exigências da concessionária {concessionaria || 'local'}.</text>
              <text x="0" y="54" className="text-[11px] fill-slate-700">3. Os cabos CC devem ser específicos para uso solar (resistentes a UV, isolação 1kV ou 1.5kV).</text>
              <text x="0" y="72" className="text-[11px] fill-slate-700">4. O dimensionamento exato dos disjuntores e cabos CA depende da potência nominal do inversor e distância até o QGBT.</text>
            </g>
          </svg>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 print:block">
          Gerado por SolarString Pro - Ferramenta de Dimensionamento Fotovoltaico
        </div>
      </div>
    </div>
  );
}
