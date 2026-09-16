import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  Tv,
  HeartHandshake,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    emergencyScenario,
    startEmergencyScenario,
    stopEmergencyScenario,
    presentationMode,
    setPresentationMode,
    caregiverViewOpen,
    setCaregiverViewOpen,
    setActiveTab,
    setSelectedPatientId,
    totalCritical,
    totalAttention,
  } = useMonitoring();

  const handleRunEmergency = () => {
    setSelectedPatientId('p-01');
    setActiveTab('patient-detail');
    startEmergencyScenario('p-01');
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Clinical Disclaimer Bar */}
      <div className="bg-amber-950/70 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold tracking-wide uppercase text-amber-300">
            DEMO PROTOTYPE — NOT FOR CLINICAL DECISION-MAKING
          </span>
          <span className="hidden sm:inline text-amber-300/80">
            | Health data shown in this prototype is simulated and is intended only to demonstrate the monitoring and alert workflow.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Prototype v2.4 · Hospital Monitoring Center
        </span>
      </div>

      {/* Main App Bar */}
      <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-inner shadow-blue-400/30">
            <Activity className="w-6 h-6 animate-pulse text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
                Elder<span className="text-blue-400">Watch</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Command Center
              </span>
              {(totalCritical > 0 || totalAttention > 0) && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5"></span>
                  {totalCritical} Critical Attention
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time elderly health and safety early-warning monitoring
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center space-x-2.5">
          {/* Emergency Scenario Trigger */}
          {emergencyScenario.isActive ? (
            <button
              onClick={stopEmergencyScenario}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-red-800 hover:bg-red-700 text-white rounded-lg border border-red-500/50 shadow-xs transition cursor-pointer"
              title="Reset simulation back to normal baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
              <span>Reset Scenario</span>
            </button>
          ) : (
            <button
              onClick={handleRunEmergency}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm shadow-red-900/40 border border-red-400/30 transition cursor-pointer"
              title="Demonstrate acute senior vital deterioration and intervention alert"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>▶ Run Emergency Scenario</span>
            </button>
          )}

          {/* Presentation Mode Toggle */}
          <button
            onClick={() => setPresentationMode(!presentationMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
              presentationMode
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Toggle high-contrast executive command center view"
          >
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            <span>{presentationMode ? 'Exit Presentation' : 'Presentation'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
