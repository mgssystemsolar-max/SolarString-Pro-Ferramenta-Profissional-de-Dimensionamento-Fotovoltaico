import React from 'react';

interface DiagramProps {
  minModules: number;
  maxModules: number;
  inverterMaxVoltage: number;
  inverterMpptMin: number;
  inverterMpptMax: number;
}

export function Diagram({ minModules, maxModules, inverterMaxVoltage, inverterMpptMin, inverterMpptMax }: DiagramProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider mb-2">Diagrama Elétrico Simplificado</h3>
      
      <svg width="100%" height="200" viewBox="0 0 600 200" className="w-full max-w-lg">
        {/* Definitions for markers */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
          </marker>
        </defs>

        {/* PV String Symbol */}
        <g transform="translate(50, 50)">
          {/* Module 1 */}
          <rect x="0" y="0" width="40" height="60" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <path d="M0,20 L40,20 M0,40 L40,40" stroke="#0284c7" strokeWidth="1" opacity="0.5" />
          <text x="20" y="75" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">PV String</text>
          
          {/* Connection dots to imply multiple modules */}
          <circle cx="20" cy="-10" r="2" fill="#94a3b8" />
          <circle cx="20" cy="-20" r="2" fill="#94a3b8" />
          <circle cx="20" cy="-30" r="2" fill="#94a3b8" />
        </g>

        {/* DC Wiring Positive */}
        <path d="M90,60 L150,60" stroke="#ef4444" strokeWidth="2" fill="none" />
        <text x="120" y="55" textAnchor="middle" className="text-[10px] fill-red-500 font-mono">+</text>

        {/* DC Wiring Negative */}
        <path d="M90,100 L150,100" stroke="#0f172a" strokeWidth="2" fill="none" />
        <text x="120" y="115" textAnchor="middle" className="text-[10px] fill-slate-900 font-mono">-</text>

        {/* DC Protection Box */}
        <g transform="translate(150, 40)">
          <rect x="0" y="0" width="60" height="80" rx="4" fill="white" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
          <text x="30" y="-10" textAnchor="middle" className="text-[10px] fill-slate-500">Proteção DC</text>
          
          {/* Fuse Symbol on Positive */}
          <path d="M0,20 L15,20 Q20,10 25,20 Q30,30 35,20 Q40,10 45,20 L60,20" stroke="#ef4444" strokeWidth="2" fill="none" />
          
          {/* Switch/Breaker Symbol on Negative */}
          <path d="M0,60 L20,60 L35,45 M35,60 L60,60" stroke="#0f172a" strokeWidth="2" fill="none" />
          <circle cx="20" cy="60" r="2" fill="#0f172a" />
          <circle cx="35" cy="60" r="2" fill="#0f172a" />
        </g>

        {/* Wiring to Inverter */}
        <path d="M210,60 L270,60" stroke="#ef4444" strokeWidth="2" fill="none" />
        <path d="M210,100 L270,100" stroke="#0f172a" strokeWidth="2" fill="none" />

        {/* Inverter Symbol */}
        <g transform="translate(270, 30)">
          <rect x="0" y="0" width="100" height="100" rx="8" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
          <text x="50" y="-10" textAnchor="middle" className="text-[10px] fill-slate-700 font-bold">Inversor</text>
          
          {/* DC Input Side */}
          <text x="10" y="55" textAnchor="start" className="text-[8px] fill-slate-400">DC IN</text>
          
          {/* AC Output Side */}
          <text x="90" y="55" textAnchor="end" className="text-[8px] fill-slate-400">AC OUT</text>
          
          {/* Conversion Symbol */}
          <path d="M30,30 L70,70 M30,70 L70,30" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="35" y="35" width="30" height="30" rx="4" fill="white" stroke="#64748b" strokeWidth="2" />
          <path d="M42,50 Q46,42 50,50 Q54,58 58,50" stroke="#64748b" strokeWidth="2" fill="none" />
          <line x1="40" y1="45" x2="60" y2="45" stroke="#64748b" strokeWidth="1" />
        </g>

        {/* AC Wiring */}
        <path d="M370,60 L430,60" stroke="#0f172a" strokeWidth="2" fill="none" />
        <path d="M370,80 L430,80" stroke="#0f172a" strokeWidth="2" fill="none" />
        <path d="M370,100 L430,100" stroke="#0f172a" strokeWidth="2" fill="none" />
        <text x="400" y="50" textAnchor="middle" className="text-[10px] fill-slate-500">AC</text>

        {/* AC Protection / Grid */}
        <g transform="translate(430, 40)">
           <rect x="0" y="0" width="40" height="80" rx="4" fill="white" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
           <text x="20" y="-10" textAnchor="middle" className="text-[10px] fill-slate-500">Q.G.B.T</text>
           
           {/* Breaker Symbol */}
           <path d="M10,20 L30,20 M10,40 L30,40 M10,60 L30,60" stroke="#0f172a" strokeWidth="2" />
           <path d="M20,20 L20,60" stroke="#0f172a" strokeWidth="2" />
        </g>

        {/* Grid Connection */}
        <path d="M470,80 L530,80" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow)" />
        <g transform="translate(540, 60)">
           <circle cx="20" cy="20" r="15" fill="none" stroke="#0f172a" strokeWidth="2" />
           <path d="M10,20 L30,20 M20,10 L20,30" stroke="#0f172a" strokeWidth="2" />
           <text x="20" y="50" textAnchor="middle" className="text-[10px] fill-slate-700 font-bold">Rede</text>
        </g>

        {/* Data Labels */}
        <text x="50" y="130" className="text-[10px] fill-slate-600 font-mono">
          String: {minModules}-{maxModules} Mods
        </text>
        <text x="270" y="130" textAnchor="middle" className="text-[10px] fill-slate-600 font-mono">
          MPPT: {inverterMpptMin}-{inverterMpptMax}V
        </text>
      </svg>
    </div>
  );
}
