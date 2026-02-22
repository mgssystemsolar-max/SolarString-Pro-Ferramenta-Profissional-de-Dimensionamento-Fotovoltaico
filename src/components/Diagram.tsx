import React from 'react';

interface DiagramProps {
  minModules: number;
  maxModules: number;
  inverterMaxVoltage: number;
  inverterMpptMin: number;
  inverterMpptMax: number;
}

export function Diagram({ minModules, maxModules, inverterMaxVoltage, inverterMpptMin, inverterMpptMax }: DiagramProps) {
  // Simple visual representation of strings
  // We'll draw a simplified string of modules connected to an inverter icon
  
  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Topologia Sugerida</h3>
        <div className="flex items-center gap-4">
          {/* Modules String */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex -space-x-2">
              {[...Array(Math.min(5, minModules > 0 ? minModules : 1))].map((_, i) => (
                <div key={i} className="w-12 h-16 bg-blue-600 border-2 border-slate-800 rounded-sm shadow-lg relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-[1px] opacity-30">
                     {[...Array(6)].map((_, j) => <div key={j} className="bg-slate-900" />)}
                  </div>
                </div>
              ))}
              {minModules > 5 && (
                <div className="w-12 h-16 flex items-center justify-center text-slate-500 font-mono text-xs">
                  ...
                </div>
              )}
            </div>
            <div className="text-xs text-blue-400 font-mono mt-2">
              {minModules} - {maxModules} Módulos
            </div>
          </div>

          {/* Connection Lines */}
          <div className="w-16 h-[2px] bg-amber-500 relative">
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </div>

          {/* Inverter */}
          <div className="w-24 h-32 bg-slate-800 border-2 border-slate-700 rounded-lg flex flex-col items-center justify-between p-2 shadow-xl relative">
            <div className="w-full h-8 bg-slate-900 rounded flex items-center justify-center text-[10px] font-mono text-green-400">
              {inverterMpptMin}V - {inverterMpptMax}V
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
               <div className="w-12 h-12 border-2 border-slate-600 rounded-full flex items-center justify-center">
                 <span className="text-xl font-bold text-slate-500">~</span>
               </div>
            </div>
            <div className="w-full text-center text-[10px] text-slate-500">
              Max {inverterMaxVoltage}V
            </div>
            
            {/* Status LED */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
