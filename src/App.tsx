import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sun, Zap, Thermometer, AlertTriangle, CheckCircle, Info, Settings, Upload, FileText, History, Download, Trash2, Camera, Search, Database } from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { Diagram } from './components/Diagram';
import { calculateStringSizing, ModuleSpecs, InverterSpecs, SiteConditions, SizingResult } from './utils/solar';
import { MODULE_PRESETS, ModulePreset } from './utils/presets';
import { extractInverterData, extractModuleData } from './utils/ocr';
import { generatePDF } from './utils/pdf';

interface HistoryItem {
  id: string;
  date: string;
  moduleName: string;
  result: SizingResult;
}

export default function App() {
  const [module, setModule] = useState<ModuleSpecs>({
    power: 550,
    voc: 49.6,
    vmp: 41.7,
    isc: 14.0,
    imp: 13.2,
    tempCoeffVoc: -0.27,
    tempCoeffVmp: -0.35,
  });

  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [inverter, setInverter] = useState<InverterSpecs>({
    maxInputVoltage: 1000,
    minMpptVoltage: 200,
    maxMpptVoltage: 850,
    maxInputCurrent: 15,
  });

  const [site, setSite] = useState<SiteConditions>({
    minTemp: -10,
    maxTemp: 40,
  });

  const [result, setResult] = useState<SizingResult | null>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isModuleOcrLoading, setIsModuleOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [moduleOcrError, setModuleOcrError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('solarHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history when result changes (debounced or manual save? Let's do manual save or auto-add to list logic)
  // Actually, let's add a "Save Calculation" button or just auto-save valid results?
  // User request implies a history list. Let's add a manual "Save" button to keep it clean.

  useEffect(() => {
    const res = calculateStringSizing(module, inverter, site);
    setResult(res);
  }, [module, inverter, site]);

  const filteredPresets = useMemo(() => {
    if (!searchTerm) return MODULE_PRESETS;
    return MODULE_PRESETS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handlePresetSelect = (preset: ModulePreset) => {
    setSelectedPreset(preset.name);
    setModule({
      power: preset.power,
      voc: preset.voc,
      vmp: preset.vmp,
      isc: preset.isc,
      imp: preset.imp,
      tempCoeffVoc: preset.tempCoeffVoc,
      tempCoeffVmp: preset.tempCoeffVmp,
    });
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsOcrLoading(true);
      setOcrError(null);
      try {
        const data = await extractInverterData(e.target.files[0]);
        setInverter(prev => ({
          ...prev,
          ...data
        }));
      } catch (err) {
        setOcrError("Falha ao ler imagem. Tente novamente com uma imagem mais clara.");
        console.error(err);
      } finally {
        setIsOcrLoading(false);
      }
    }
  };

  const handleModuleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsModuleOcrLoading(true);
      setModuleOcrError(null);
      try {
        const data = await extractModuleData(e.target.files[0]);
        setModule(prev => ({
          ...prev,
          ...data
        }));
        setSelectedPreset("Módulo OCR (Lido)");
      } catch (err) {
        setModuleOcrError("Falha ao ler imagem. Tente novamente com uma imagem mais clara.");
        console.error(err);
      } finally {
        setIsModuleOcrLoading(false);
      }
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      moduleName: selectedPreset || "Módulo Personalizado",
      result: result
    };
    const newHistory = [newItem, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem('solarHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('solarHistory');
  };

  const handleExportPDF = () => {
    if (result) {
      generatePDF(result, module, inverter, site, selectedPreset || "Módulo Personalizado");
    }
  };

  const getFieldStatus = (field: string): 'default' | 'error' | 'warning' => {
    if (!result?.highlightFields.includes(field)) return 'default';
    // If it's clipping (current), it's a warning. If it's voltage/compatibility, it's an error.
    // We can infer this from the warnings list or just hardcode logic.
    // For simplicity: if field is current related and result is compatible (but with warnings), it's warning.
    // If result is incompatible, it's error.
    
    if (field.includes('Current') || field.includes('imp')) {
        return result.isCompatible ? 'warning' : 'error';
    }
    return 'error';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-lg text-white shadow-amber-200 shadow-md">
              <Sun size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                SolarString<span className="text-amber-600">Pro</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Tool</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={handleExportPDF}
               className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
               disabled={!result}
             >
               <FileText size={18} /> Relatório PDF
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* INPUT SECTION */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Inverter Specs & OCR */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="text-indigo-500" size={18} />
                  <h2 className="font-semibold text-slate-900">Inversor</h2>
                </div>
                <label className="cursor-pointer flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors border border-indigo-100">
                  <Camera size={14} />
                  {isOcrLoading ? "Processando..." : "Ler Datasheet (OCR)"}
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} disabled={isOcrLoading} />
                </label>
              </div>
              
              {ocrError && (
                <div className="px-6 py-2 bg-red-50 text-red-600 text-xs border-b border-red-100 flex items-center gap-2">
                  <AlertTriangle size={12} /> {ocrError}
                </div>
              )}

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label="Tensão Máxima Entrada" 
                  value={inverter.maxInputVoltage} 
                  onChange={(v) => setInverter({...inverter, maxInputVoltage: v})} 
                  unit="V" 
                  status={getFieldStatus('inverter.maxInputVoltage')}
                />
                <InputGroup 
                  label="Corrente Máxima Entrada" 
                  value={inverter.maxInputCurrent} 
                  onChange={(v) => setInverter({...inverter, maxInputCurrent: v})} 
                  unit="A" 
                  status={getFieldStatus('inverter.maxInputCurrent')}
                />
                <InputGroup 
                  label="MPPT Mínimo" 
                  value={inverter.minMpptVoltage} 
                  onChange={(v) => setInverter({...inverter, minMpptVoltage: v})} 
                  unit="V" 
                  status={getFieldStatus('inverter.minMpptVoltage')}
                />
                <InputGroup 
                  label="MPPT Máximo" 
                  value={inverter.maxMpptVoltage} 
                  onChange={(v) => setInverter({...inverter, maxMpptVoltage: v})} 
                  unit="V" 
                  status={getFieldStatus('inverter.maxMpptVoltage')}
                />
              </div>
            </motion.section>

            {/* Module Specs with Database Search */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible relative z-20"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="text-amber-500" size={18} />
                  <h2 className="font-semibold text-slate-900">Módulo Fotovoltaico</h2>
                </div>
                
                <div className="flex items-center gap-2">
                   <label className="cursor-pointer flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors border border-amber-100 whitespace-nowrap">
                      <Camera size={14} />
                      {isModuleOcrLoading ? "Lendo..." : "Ler Datasheet"}
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleModuleFileUpload} disabled={isModuleOcrLoading} />
                   </label>

                   <div className="relative">
                     <button 
                       onClick={() => setIsSearchOpen(!isSearchOpen)}
                       className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full transition-colors border border-slate-200 whitespace-nowrap"
                     >
                       <Database size={14} />
                       {selectedPreset ? "Alterar" : "Buscar"}
                     </button>

                     {isSearchOpen && (
                       <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                         <div className="p-2 border-b border-slate-100 bg-slate-50">
                           <div className="relative">
                             <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                             <input 
                               type="text" 
                               placeholder="Buscar modelo, fabricante..." 
                               className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               autoFocus
                             />
                           </div>
                         </div>
                         <div className="max-h-60 overflow-y-auto">
                           {filteredPresets.length === 0 ? (
                             <div className="p-4 text-center text-xs text-slate-500">Nenhum módulo encontrado</div>
                           ) : (
                             filteredPresets.map(p => (
                               <button
                                 key={p.name}
                                 onClick={() => handlePresetSelect(p)}
                                 className="w-full text-left px-4 py-2.5 hover:bg-amber-50 transition-colors border-b border-slate-50 last:border-0"
                               >
                                 <div className="font-medium text-sm text-slate-900">{p.name}</div>
                                 <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                                   <span>{p.power}W</span>
                                   <span>Voc: {p.voc}V</span>
                                   <span>Imp: {p.imp}A</span>
                                 </div>
                               </button>
                             ))
                           )}
                         </div>
                       </div>
                     )}
                  </div>
                </div>
              </div>

              {moduleOcrError && (
                <div className="px-6 py-2 bg-red-50 text-red-600 text-xs border-b border-red-100 flex items-center gap-2">
                  <AlertTriangle size={12} /> {moduleOcrError}
                </div>
              )}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label="Potência (Pmax)" 
                  value={module.power} 
                  onChange={(v) => setModule({...module, power: v})} 
                  unit="W" 
                  status={getFieldStatus('module.power')}
                />
                <InputGroup 
                  label="Voc (STC)" 
                  value={module.voc} 
                  onChange={(v) => setModule({...module, voc: v})} 
                  unit="V" 
                  status={getFieldStatus('module.voc')}
                />
                <InputGroup 
                  label="Vmp (STC)" 
                  value={module.vmp} 
                  onChange={(v) => setModule({...module, vmp: v})} 
                  unit="V" 
                  status={getFieldStatus('module.vmp')}
                />
                <InputGroup 
                  label="Isc (STC)" 
                  value={module.isc} 
                  onChange={(v) => setModule({...module, isc: v})} 
                  unit="A" 
                  status={getFieldStatus('module.isc')}
                />
                <InputGroup 
                  label="Imp (STC)" 
                  value={module.imp} 
                  onChange={(v) => setModule({...module, imp: v})} 
                  unit="A" 
                  status={getFieldStatus('module.imp')}
                />
                <div className="sm:col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-2">
                  <InputGroup 
                    label="Coef. Temp. Voc" 
                    value={module.tempCoeffVoc} 
                    onChange={(v) => setModule({...module, tempCoeffVoc: v})} 
                    unit="%/°C" 
                    step={0.01}
                    status={getFieldStatus('module.tempCoeffVoc')}
                  />
                  <InputGroup 
                    label="Coef. Temp. Vmp" 
                    value={module.tempCoeffVmp} 
                    onChange={(v) => setModule({...module, tempCoeffVmp: v})} 
                    unit="%/°C" 
                    step={0.01}
                    status={getFieldStatus('module.tempCoeffVmp')}
                  />
                </div>
              </div>
            </motion.section>

            {/* Site Conditions */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Thermometer className="text-rose-500" size={18} />
                <h2 className="font-semibold text-slate-900">Condições Locais</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label="Temperatura Mínima" 
                  value={site.minTemp} 
                  onChange={(v) => setSite({...site, minTemp: v})} 
                  unit="°C" 
                  status={getFieldStatus('site.minTemp')}
                />
                <InputGroup 
                  label="Temperatura Máxima" 
                  value={site.maxTemp} 
                  onChange={(v) => setSite({...site, maxTemp: v})} 
                  unit="°C" 
                  status={getFieldStatus('site.maxTemp')}
                />
              </div>
            </motion.section>
          </div>

          {/* RESULTS SECTION */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 space-y-6"
            >
              {/* Main Result Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-lg">Resultado</h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={saveToHistory}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                      title="Salvar no Histórico"
                    >
                      <Download size={18} />
                    </button>
                    {result?.isCompatible ? (
                      <CheckCircle className="text-emerald-400" />
                    ) : (
                      <AlertTriangle className="text-amber-400" />
                    )}
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Diagram */}
                  {result && (
                    <Diagram 
                      minModules={result.minModules} 
                      maxModules={result.maxModules} 
                      inverterMaxVoltage={inverter.maxInputVoltage}
                      inverterMpptMin={inverter.minMpptVoltage}
                      inverterMpptMax={inverter.maxMpptVoltage}
                    />
                  )}

                  {/* Min/Max Modules */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <div className="text-sm text-slate-500 mb-1">Mínimo</div>
                      <div className="text-3xl font-bold text-slate-900">{result?.minModules}</div>
                      <div className="text-xs text-slate-400 mt-1">módulos</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <div className="text-sm text-slate-500 mb-1">Máximo</div>
                      <div className="text-3xl font-bold text-slate-900">{result?.maxModules}</div>
                      <div className="text-xs text-slate-400 mt-1">módulos</div>
                    </div>
                  </div>

                  {/* Voltage Details */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                      <Info size={14} className="text-slate-400" /> Detalhes de Tensão
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-600">Voc Máx (@ {site.minTemp}°C)</span>
                        <span className="font-mono font-medium text-slate-900">
                          {result?.vocMax.toFixed(1)} V
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-600">Vmp Mín (@ {site.maxTemp}°C)</span>
                        <span className="font-mono font-medium text-slate-900">
                          {result?.vmpMin.toFixed(1)} V
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {result?.warnings && result.warnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                        <AlertTriangle size={16} /> Atenção
                      </h3>
                      <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                        {result.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* History Section */}
              {history.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="text-slate-500" size={18} />
                      <h2 className="font-semibold text-slate-900">Histórico</h2>
                    </div>
                    <button onClick={clearHistory} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm text-slate-900">{item.moduleName}</span>
                          <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <div className="text-xs text-slate-600 flex gap-3">
                          <span>Min: <b>{item.result.minModules}</b></span>
                          <span>Max: <b>{item.result.maxModules}</b></span>
                          <span className={item.result.isCompatible ? "text-emerald-600" : "text-amber-600"}>
                            {item.result.isCompatible ? "Compatível" : "Atenção"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
