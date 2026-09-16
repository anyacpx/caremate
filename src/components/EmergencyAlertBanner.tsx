import React, { useState } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  Flame,
  AlertTriangle,
  RotateCcw,
  FastForward,
  Volume2,
  VolumeX,
  ExternalLink,
  Watch,
  Heart,
  Droplets,
  Activity,
} from 'lucide-react';
import { isAudioMuted, setAudioMuted } from '../utils/audioAlert';

export const EmergencyAlertBanner: React.FC = () => {
  const {
    emergencyScenario,
    stopEmergencyScenario,
    setEmergencySpeed,
    fastForwardToCritical,
    activeTab,
    setActiveTab,
    setSelectedPatientId,
    patients,
  } = useMonitoring();

  const [muted, setMuted] = useState(isAudioMuted());

  if (!emergencyScenario.isActive) return null;

  const targetPatient = patients.find(p => p.id === emergencyScenario.patientId) || patients[0];
  const isWatchVibrating = emergencyScenario.stage === 4;
  const isCritical = emergencyScenario.stage >= 3;

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
  };

  const handleGoToPatient = () => {
    setSelectedPatientId(targetPatient.id);
    setActiveTab('patient-detail');
  };

  return (
    <div
      id="emergency-scenario-hud"
      className={`sticky top-[73px] z-25 transition-all shadow-xl border-y ${
        isCritical
          ? 'bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-red-500 text-white animate-pulse'
          : 'bg-gradient-to-r from-amber-950 via-orange-950 to-amber-950 border-amber-500 text-amber-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Alarming Stage & Patient Indicator */}
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 ${
              isCritical
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-bounce'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {isWatchVibrating ? (
              <Watch className="w-5 h-5 animate-spin" />
            ) : isCritical ? (
              <Flame className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 border border-white/20">
                🚨 EMERGENCY SCENARIO RUNNING
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {targetPatient.name} (Age {targetPatient.age})
              </span>
            </div>
            <p className="text-xs font-medium text-white/95 mt-0.5 flex items-center space-x-2">
              <span className="font-bold underline decoration-red-400">
                {emergencyScenario.stageLabel}
              </span>
              {isWatchVibrating && (
                <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white text-[11px] font-bold animate-pulse">
                  Wearable Prompt Countdown: {emergencyScenario.checkInCountdown}s
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Center: Live Deteriorating Telemetry Ticker */}
        <div className="hidden lg:flex items-center space-x-4 px-3 py-1 rounded-lg bg-black/30 border border-white/10 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="text-slate-300">HR:</span>
            <span className={`font-bold ${targetPatient.vitals.heartRate > 90 ? 'text-rose-400' : 'text-emerald-300'}`}>
              {targetPatient.vitals.heartRate} BPM
            </span>
          </div>

          <div className="w-px h-3 bg-white/20"></div>

          <div className="flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">SpO₂:</span>
            <span className={`font-bold ${targetPatient.vitals.spo2 < 95 ? 'text-rose-400' : 'text-emerald-300'}`}>
              {targetPatient.vitals.spo2}%
            </span>
          </div>

          <div className="w-px h-3 bg-white/20"></div>

          <div className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">Activity:</span>
            <span className={`font-bold ${targetPatient.vitals.activityLevel === 'None' || targetPatient.vitals.activityLevel === 'Very Low' ? 'text-rose-400' : 'text-slate-200'}`}>
              {targetPatient.vitals.activityLevel}
            </span>
          </div>
        </div>

        {/* Right: Simplified Controls */}
        <div className="flex items-center space-x-2">
          {activeTab !== 'patient-detail' && (
            <button
              onClick={handleGoToPatient}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-rose-950 hover:bg-rose-100 flex items-center space-x-1 shadow-xs cursor-pointer transition"
              title="Open Patient Detail view to inspect live vitals chart"
            >
              <span>View Triage</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {emergencyScenario.stage < 4 && (
            <button
              onClick={fastForwardToCritical}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-800/80 hover:bg-red-700 text-white border border-red-500/50 flex items-center space-x-1 cursor-pointer transition"
              title="Jump immediately to acute stage & wearable prompt"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Jump to Critical</span>
            </button>
          )}

          {/* Audio Mute / Unmute */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-200 border border-white/20 cursor-pointer transition"
            title={muted ? 'Unmute alert audio' : 'Mute alert audio'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Stop / Reset Button */}
          <button
            onClick={stopEmergencyScenario}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 hover:bg-black text-slate-200 border border-slate-700 flex items-center space-x-1 cursor-pointer transition"
            title="Reset scenario and restore normal patient vitals"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
