import React from 'react';
import { Patient } from '../types';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  Activity,
  Layers,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface EarlyWarningAnalysisCardProps {
  patient: Patient;
}

export const EarlyWarningAnalysisCard: React.FC<EarlyWarningAnalysisCardProps> = ({ patient }) => {
  const isCritical = patient.status === 'critical';
  const isWarning = patient.status === 'warning' || patient.status === 'attention';

  return (
    <div className={`rounded-xl border p-5 shadow-xs ${
      isCritical
        ? 'bg-rose-50/40 border-rose-300'
        : isWarning
        ? 'bg-amber-50/30 border-amber-300'
        : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isCritical ? 'bg-rose-600 text-white' : isWarning ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Early Warning Analysis & Multi-Signal Synthesis</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-medium">
                Algorithmic Synthesis
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates concurrent telemetry vectors to identify pattern deterioration before catastrophic failure
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isCritical ? (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-rose-600 text-white shadow-xs animate-pulse">
              <Flame className="w-3.5 h-3.5 mr-1" />
              🔴 Potential Deterioration Detected
            </span>
          ) : isWarning ? (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-amber-600 text-white shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              🟡 Physiological Anomaly Flagged
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              🟢 Baseline Stability Confirmed
            </span>
          )}
        </div>
      </div>

      {/* Main Contributing Signals list */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span>Identified Contributing Telemetry Signals:</span>
            <span className="text-[11px] font-normal text-slate-500 lowercase">
              {patient.earlyWarningSignals.length} active signal(s)
            </span>
          </h4>

          {patient.earlyWarningSignals.length > 0 ? (
            <div className="space-y-2">
              {patient.earlyWarningSignals.map(sig => (
                <div
                  key={sig.id}
                  className="p-3 rounded-lg bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sig.severity === 'critical'
                            ? 'bg-rose-600'
                            : sig.severity === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-yellow-500'
                        }`}
                      ></span>
                      <span className="text-xs font-bold text-slate-900">{sig.description}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 ml-4">
                      Deviation metric: <span className="font-mono text-slate-700">{sig.baselineComparison}</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{sig.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 text-center">
              No concerning signal patterns identified in telemetry buffer. All primary sensors tracking within individual tolerances.
            </div>
          )}
        </div>

        {/* Compound Multi-Signal Logic Breakdown (Section 7) */}
        <div className="p-3.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Signal Compound Logic Demonstration</span>
            </span>
            <span className="text-[11px] text-blue-300 font-mono">
              Pattern Confidence: <strong className="text-white">High (94.2%)</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Single Factor:</span>
              <span className="text-slate-200">HR elevated alone</span>
              <span className="block mt-1 text-yellow-400 font-semibold font-mono">→ Low Concern</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Single Factor:</span>
              <span className="text-slate-200">SpO₂ lower alone</span>
              <span className="block mt-1 text-amber-400 font-semibold font-mono">→ Moderate Concern</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Compound:</span>
              <span className="text-slate-200">HR ↑ + SpO₂ ↓ + Inactivity</span>
              <span className="block mt-1 text-rose-400 font-bold font-mono">→ High Concern</span>
            </div>
            <div className="p-2 rounded bg-rose-950/80 border border-rose-600/50">
              <span className="text-rose-300 block text-[10px] uppercase font-semibold">Critical Escalation:</span>
              <span className="text-rose-100">All above + No check-in</span>
              <span className="block mt-1 text-rose-300 font-black font-mono">→ CRITICAL INTERVENE</span>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer (Section 10 & 29) */}
        <div className="flex items-start space-x-2 text-xs text-slate-500 bg-white/80 p-3 rounded-lg border border-slate-200">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-700">Demonstration Notice:</strong> This is a prototype pattern-detection demonstration and does not constitute a medical diagnosis or clinical decision-support tool. Pattern confidence represents statistical divergence from individual baseline telemetry, designed to prompt human verification.
          </p>
        </div>
      </div>
    </div>
  );
};
