import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { PatientMonitoringTable } from './PatientMonitoringTable';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Watch,
  ArrowRight,
  HeartPulse,
  BellRing,
  CheckCircle2,
  PhoneCall,
  Activity,
  ChevronRight,
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    totalMonitored,
    totalStable,
    totalAttention,
    totalCritical,
    totalDevicesConnected,
    patients,
    setSelectedPatientId,
    setActiveTab,
    startEmergencyScenario,
    emergencyScenario,
  } = useMonitoring();

  // Find top critical patient
  const criticalPatients = patients.filter(p => p.status === 'critical');
  const primaryCritical = criticalPatients[0] || patients[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Title & Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span>ElderWatch Command Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
              Live Telemetry
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Real-time elderly health and safety monitoring & early-warning triage
          </p>
        </div>

        {/* Quick action button for simulation demo */}
        {!emergencyScenario.isActive && (
          <button
            onClick={() => {
              setSelectedPatientId('p-01');
              setActiveTab('patient-detail');
              startEmergencyScenario('p-01');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>▶ Simulate Emergency Deterioration</span>
          </button>
        )}
      </div>

      {/* Primary KPI Status Cards (Section 5) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Monitored */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monitored
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalMonitored}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Seniors enrolled in system</p>
        </div>

        {/* Stable */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-xs bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Stable</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono tracking-tight">
            {totalStable}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">Vitals matching baseline</p>
        </div>

        {/* Attention Required */}
        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Attention</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800 font-mono tracking-tight">
            {totalAttention}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">Minor baseline divergence</p>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-xl p-4 border border-rose-300 shadow-xs bg-gradient-to-br from-rose-50/50 to-white relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical</span>
            <Flame className="w-4 h-4 text-rose-600 animate-bounce" />
          </div>
          <div className="text-2xl font-black text-rose-800 font-mono tracking-tight">
            {totalCritical}
          </div>
          <p className="text-[11px] text-rose-700/90 font-medium mt-1">Immediate intervention</p>
          <div className="absolute top-0 right-0 w-2 h-full bg-rose-600"></div>
        </div>

        {/* Connected Wearables */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Devices
            </span>
            <Watch className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalDevicesConnected}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">98.0% telemetry uptime</p>
        </div>
      </div>

      {/* "Who May Need Help Right Now?" Priority Alert Box (Section 2 & 30) */}
      {primaryCritical && (
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-xl p-4 md:p-5 shadow-sm border border-rose-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                PRIMARY CLINICAL FOCUS: WHO NEEDS HELP RIGHT NOW?
              </span>
              <span className="text-xs text-rose-200 font-mono">Prototype Priority Alert</span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>{primaryCritical.name} ({primaryCritical.age} yrs)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white font-mono">
                Risk Score: {primaryCritical.riskScore}/100
              </span>
            </h3>
            <p className="text-xs text-rose-100/90 leading-relaxed">
              Concurrent warning signals: SpO₂ {primaryCritical.vitals.spo2}% (low), Heart Rate {primaryCritical.vitals.heartRate} BPM (tachycardia), motionless for {primaryCritical.vitals.lastMovementMinutesAgo} min. Wearable check-in timeout registered.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => {
                setSelectedPatientId(primaryCritical.id);
                setActiveTab('patient-detail');
              }}
              className="px-4 py-2 bg-white text-rose-900 hover:bg-rose-50 rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Review Patient Triage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hospital Value Proposition & Workflow Strip (Section 1 & 22) */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="max-w-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center space-x-1.5">
              <span>The ElderWatch Workflow</span>
              <span className="text-[10px] text-blue-600 font-normal">
                (Continuous Early-Warning & Human Intervention)
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Elderly patients experience acute deterioration when alone. ElderWatch continuously models personal physiological baselines and escalates early warnings to caregivers and hospitals before emergencies become fatal.
            </p>
          </div>

          {/* Stepped Workflow Pipeline */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs">
            <div className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-700 font-semibold shadow-2xs">
              Elderly Senior
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-700 font-semibold shadow-2xs">
              Smartwear
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="px-2.5 py-1.5 rounded-lg bg-blue-100 border border-blue-300 text-blue-900 font-bold shadow-2xs">
              Early Detection
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-700 font-semibold shadow-2xs">
              Alert & Verify
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold shadow-2xs">
              Human Intervention
            </div>
          </div>
        </div>
      </div>

      {/* Main Patient Monitoring Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monitored Cohort Telemetry</h3>
            <p className="text-xs text-slate-500">
              Live sensor stream from wearable devices, synced in continuous real-time
            </p>
          </div>
        </div>

        <PatientMonitoringTable />
      </div>
    </div>
  );
};
