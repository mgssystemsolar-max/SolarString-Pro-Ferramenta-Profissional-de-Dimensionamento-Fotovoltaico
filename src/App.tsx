import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Zap, Thermometer, AlertTriangle, CheckCircle, Info, Settings } from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { calculateStringSizing, ModuleSpecs, InverterSpecs, SiteConditions, SizingResult } from './utils/solar';

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

  useEffect(() => {
    const res = calculateStringSizing(module, inverter, site);
    setResult(res);
  }, [module, inverter, site]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-lg text-white">
              <Sun size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Solar<span className="text-amber-600">Sizer</span>
            </h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Dimensionamento de String PV
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* INPUT SECTION */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Module Specs */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Zap className="text-amber-500" size={18} />
                <h2 className="font-semibold text-slate-900">Especificações do Módulo</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label="Potência (Pmax)" 
                  value={module.power} 
                  onChange={(v) => setModule({...module, power: v})} 
                  unit="W" 
                />
                <InputGroup 
                  label="Voc (STC)" 
                  value={module.voc} 
                  onChange={(v) => setModule({...module, voc: v})} 
                  unit="V" 
                />
                <InputGroup 
                  label="Vmp (STC)" 
                  value={module.vmp} 
                  onChange={(v) => setModule({...module, vmp: v})} 
                  unit="V" 
                />
                <InputGroup 
                  label="Isc (STC)" 
                  value={module.isc} 
                  onChange={(v) => setModule({...module, isc: v})} 
                  unit="A" 
                />
                <InputGroup 
                  label="Imp (STC)" 
                  value={module.imp} 
                  onChange={(v) => setModule({...module, imp: v})} 
                  unit="A" 
                />
                <div className="sm:col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-2">
                  <InputGroup 
                    label="Coef. Temp. Voc" 
                    value={module.tempCoeffVoc} 
                    onChange={(v) => setModule({...module, tempCoeffVoc: v})} 
                    unit="%/°C" 
                    step={0.01}
                  />
                  <InputGroup 
                    label="Coef. Temp. Vmp" 
                    value={module.tempCoeffVmp} 
                    onChange={(v) => setModule({...module, tempCoeffVmp: v})} 
                    unit="%/°C" 
                    step={0.01}
                  />
                </div>
              </div>
            </motion.section>

            {/* Inverter Specs */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Settings className="text-indigo-500" size={18} />
                <h2 className="font-semibold text-slate-900">Especificações do Inversor</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label="Tensão Máxima Entrada" 
                  value={inverter.maxInputVoltage} 
                  onChange={(v) => setInverter({...inverter, maxInputVoltage: v})} 
                  unit="V" 
                />
                <InputGroup 
                  label="Corrente Máxima Entrada" 
                  value={inverter.maxInputCurrent} 
                  onChange={(v) => setInverter({...inverter, maxInputCurrent: v})} 
                  unit="A" 
                />
                <InputGroup 
                  label="MPPT Mínimo" 
                  value={inverter.minMpptVoltage} 
                  onChange={(v) => setInverter({...inverter, minMpptVoltage: v})} 
                  unit="V" 
                />
                <InputGroup 
                  label="MPPT Máximo" 
                  value={inverter.maxMpptVoltage} 
                  onChange={(v) => setInverter({...inverter, maxMpptVoltage: v})} 
                  unit="V" 
                />
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
                />
                <InputGroup 
                  label="Temperatura Máxima" 
                  value={site.maxTemp} 
                  onChange={(v) => setSite({...site, maxTemp: v})} 
                  unit="°C" 
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
                  <h2 className="font-semibold text-lg">Resultado do Dimensionamento</h2>
                  {result?.isCompatible ? (
                    <CheckCircle className="text-emerald-400" />
                  ) : (
                    <AlertTriangle className="text-amber-400" />
                  )}
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Min/Max Modules */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <div className="text-sm text-slate-500 mb-1">Mínimo de Módulos</div>
                      <div className="text-3xl font-bold text-slate-900">{result?.minModules}</div>
                      <div className="text-xs text-slate-400 mt-1">por string</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <div className="text-sm text-slate-500 mb-1">Máximo de Módulos</div>
                      <div className="text-3xl font-bold text-slate-900">{result?.maxModules}</div>
                      <div className="text-xs text-slate-400 mt-1">por string</div>
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

                  {/* Success Message */}
                  {result?.isCompatible && (!result.warnings || result.warnings.length === 0) && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-emerald-600 mt-0.5" size={18} />
                        <div>
                          <h3 className="text-sm font-semibold text-emerald-800">Configuração Válida</h3>
                          <p className="text-sm text-emerald-700 mt-1">
                            O inversor e os módulos são compatíveis dentro da faixa de temperatura especificada.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
