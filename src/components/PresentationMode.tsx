import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  ShieldCheck,
  Heart,
  Watch,
  Activity,
  AlertTriangle,
  Hospital,
  Users,
  Play,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Layers,
} from 'lucide-react';

export const PresentationMode: React.FC = () => {
  const {
    patients,
    startEmergencyScenario,
    stopEmergencyScenario,
    emergencyScenario,
    setPresentationMode,
    setActiveTab,
    setSelectedPatientId,
  } = useMonitoring();

  const primaryPatient = patients.find(p => p.id === 'p-01') || patients[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans space-y-12">
      {/* Top Navigation / Return Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-md">
            EW
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>ElderWatch Executive Briefing</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                Hospital & Government Edition
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Healthcare Technology Platform for Early Deterioration Detection
            </p>
          </div>
        </div>

        <button
          onClick={() => setPresentationMode(false)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-700 transition cursor-pointer"
        >
          Exit Presentation Mode
        </button>
      </div>

      {/* Hero Mission Headline */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-blue-400 font-bold bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
          The Problem: Frail Seniors Deteriorate Silently While Alone
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Protecting Vulnerable Seniors Through{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
            Early Detection
          </span>{' '}
          & Human Intervention
        </h2>
        <p className="text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          ElderWatch is <strong className="text-white font-semibold">not</strong> a fitness tracker. It is an early-warning safety net that transforms commercially available smartwatches into continuous physiological sentinels for hospital monitoring centers and caregivers.
        </p>
      </div>

      {/* The Core 5-Stage Life-Saving Workflow */}
      <div className="max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
          The ElderWatch Closed-Loop Safety Workflow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 mx-auto flex items-center justify-center text-slate-200">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">1. Vulnerable Senior</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Lives independently at home or in assisted community.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-900/60 mx-auto flex items-center justify-center text-blue-300">
              <Watch className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">2. Smartwatch</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Continuous wrist PPG, accelerometer, SpO₂, and skin telemetry.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-600/60 text-center space-y-2 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-blue-300">3. Pattern Detection</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Detects divergence from personal baseline before acute crisis.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-900/60 mx-auto flex items-center justify-center text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">4. Check-In & Alert</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Gentle haptic check-in. If unanswered, escalates automatically.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 mx-auto flex items-center justify-center text-white">
              <Hospital className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-emerald-300">5. Human Intervention</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Caregiver and hospital response dispatched to save life.
            </p>
          </div>
        </div>
      </div>

      {/* Live Interactive Deterioration Demonstration Widget */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Interactive Deterioration Simulation</span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                Live Interactive Demonstration
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrate in real-time how ElderWatch flags concurrent anomalies and triggers escalations
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {!emergencyScenario.isActive ? (
              <button
                onClick={() => startEmergencyScenario('p-01')}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Trigger Live Simulation</span>
              </button>
            ) : (
              <button
                onClick={stopEmergencyScenario}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Simulation</span>
              </button>
            )}

            <button
              onClick={() => {
                setSelectedPatientId('p-01');
                setPresentationMode(false);
                setActiveTab('patient-detail');
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Open Patient Medical Chart
            </button>
          </div>
        </div>

        {/* Live Scenario Progress Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Patient Under Review</span>
            <div className="text-base font-bold text-white mt-1">{primaryPatient.name}</div>
            <span className="text-xs text-slate-400 font-mono">{primaryPatient.age} years old · Living Alone</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Telemetry Status</span>
            <div className="text-base font-bold font-mono text-white mt-1">
              HR {primaryPatient.vitals.heartRate} · SpO₂ {primaryPatient.vitals.spo2}%
            </div>
            <span className={`text-xs font-semibold ${primaryPatient.status === 'critical' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {primaryPatient.status === 'critical' ? 'Divergence detected' : 'In baseline'}
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Simulation Phase</span>
            <div className="text-base font-bold text-blue-400 mt-1">
              Stage {emergencyScenario.currentStage}: {emergencyScenario.stageLabel}
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Speed: {emergencyScenario.speedMultiplier}x
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Triage Priority</span>
            <div className="text-base font-bold font-mono text-rose-400 mt-1">
              Risk: {primaryPatient.riskScore} / 100
            </div>
            <span className="text-xs text-rose-300">
              {primaryPatient.status === 'critical' ? '🔴 Priority Triage 1' : 'Routine Monitoring'}
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Value Propositions for Hospital/Government Leadership */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Hospital className="w-4 h-4 text-blue-400" />
            <span>For Hospital Networks</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reduce 30-day post-discharge readmissions by continuously observing discharged cardiovascular and respiratory patients at home.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>For Government & Social Welfare</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protect the rapidly growing population of solitary elders without invasive cameras, preserving autonomy, privacy, and human dignity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Heart className="w-4 h-4 text-purple-400" />
            <span>For Families & Caregivers</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provide working family members continuous peace of mind with intelligent multi-channel alerts and verified check-in protocols.
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-900 pt-6">
        DEMO PROTOTYPE — NOT FOR CLINICAL DECISION-MAKING. Health data shown in this prototype is simulated and is intended only to demonstrate the monitoring and alert workflow.
      </div>
    </div>
  );
};
