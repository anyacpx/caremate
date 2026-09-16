import React, { useState } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  Settings,
  Sliders,
  Play,
  RotateCcw,
  Pause,
  Layers,
  ShieldAlert,
  Server,
  Zap,
  CheckCircle,
  Clock,
  Gauge,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    emergencyScenario,
    startEmergencyScenario,
    stopEmergencyScenario,
    pauseEmergencyScenario,
    resumeEmergencyScenario,
    setEmergencySpeed,
    patients,
    setSelectedPatientId,
    setActiveTab,
  } = useMonitoring();

  const [selectedScenarioType, setSelectedScenarioType] = useState<string>('deterioration');
  const [targetPatientId, setTargetPatientId] = useState<string>('p-01');

  const handleSimulate = () => {
    setSelectedPatientId(targetPatientId);
    startEmergencyScenario(targetPatientId);
    setActiveTab('patient-detail');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span>System Settings & Demonstration Controls</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
              Simulation Harness
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Interactive scenarios and telemetry playback for hospital executives and regulatory presentations
          </p>
        </div>
      </div>

      {/* Section 25: Demo Controls Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sliders className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Executive Demo Controls</h3>
            <p className="text-xs text-slate-500">
              Drive scripted deterioration events, adjust simulation speed, and test escalation workflows
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Scenario Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Clinical Scenario:
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="scenario"
                  checked={selectedScenarioType === 'deterioration'}
                  onChange={() => setSelectedScenarioType('deterioration')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Physiological Deterioration & No Response (Primary Demo)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    SpO₂ drops from 98% to 90%, HR climbs to 110, wrist motion ceases, check-in timeout occurs.
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="scenario"
                  checked={selectedScenarioType === 'elevated'}
                  onChange={() => setSelectedScenarioType('elevated')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Elevated Resting Tachycardia Pattern
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sustained pulse elevation (&gt;100 BPM) without corresponding physical activity.
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="scenario"
                  checked={selectedScenarioType === 'fall'}
                  onChange={() => setSelectedScenarioType('fall')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Suspected Fall & Prolonged Immobility
                  </span>
                  <span className="text-[11px] text-slate-500">
                    High accelerometer peak followed by zero wrist velocity for &gt;5 minutes.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Target Patient & Speed Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Target Monitored Senior:
              </label>
              <select
                value={targetPatientId}
                onChange={e => setTargetPatientId(e.target.value)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age}y) — Current Risk: {p.riskScore}
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Multiplier */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <span>3. Simulation Speed:</span>
                <span className="text-blue-600 font-mono">{emergencyScenario.speedMultiplier}x Real-time</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEmergencySpeed(1)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    emergencyScenario.speedMultiplier === 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  1x (Standard 45s)
                </button>
                <button
                  onClick={() => setEmergencySpeed(2)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    emergencyScenario.speedMultiplier === 2
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  2x (Fast 25s)
                </button>
                <button
                  onClick={() => setEmergencySpeed(4)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    emergencyScenario.speedMultiplier === 4
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  4x (Turbo 12s)
                </button>
              </div>
            </div>

            {/* Playback Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handleSimulate}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate Event Now</span>
              </button>

              <button
                onClick={pauseEmergencyScenario}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>

              <button
                onClick={resumeEmergencyScenario}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </button>

              <button
                onClick={stopEmergencyScenario}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Scenario</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 28: Architecture Layer Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Server className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">System Technical Architecture</h3>
            <p className="text-xs text-slate-500">
              Layered architecture model designed for seamless HL7/FHIR hospital EHR integration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Layer 1</span>
            <strong className="text-slate-800 block mt-1">Wearable Device</strong>
            <span className="text-[11px] text-slate-500">Samsung / Apple / Garmin</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Layer 2</span>
            <strong className="text-slate-800 block mt-1">Data Ingestion</strong>
            <span className="text-[11px] text-slate-500">Encrypted BLE / Cloud Sync</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Layer 3</span>
            <strong className="text-slate-800 block mt-1">Patient Data</strong>
            <span className="text-[11px] text-slate-500">Circadian Baseline Profile</span>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <span className="text-[10px] text-blue-600 font-bold uppercase block">Layer 4</span>
            <strong className="text-blue-900 block mt-1">Pattern Analysis</strong>
            <span className="text-[11px] text-blue-700">Prototype Risk Scoring</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-center">
            <span className="text-[10px] text-rose-600 font-bold uppercase block">Layer 5</span>
            <strong className="text-rose-900 block mt-1">Alert & Escalation</strong>
            <span className="text-[11px] text-rose-700">Check-In & Dispatch</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
            <span className="text-[10px] text-emerald-600 font-bold uppercase block">Layer 6</span>
            <strong className="text-emerald-900 block mt-1">Hospital Dashboard</strong>
            <span className="text-[11px] text-emerald-700">Triage & Intervention</span>
          </div>
        </div>
      </div>

      {/* Section 29: Safety & Medical Framing Guidelines */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Product Positioning & Medical Safety Compliance</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          ElderWatch is designed as an assistive safety net. It does not replace medical diagnostics or clinical judgment. The terminology across the platform strictly uses approved language:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[11px] text-rose-400 font-bold block mb-1">PROHIBITED CLAIMS:</span>
            <ul className="text-slate-400 space-y-0.5 list-disc pl-4 text-[11px]">
              <li>"This system diagnoses disease"</li>
              <li>"This system predicts heart attacks"</li>
              <li>"This system saves lives"</li>
              <li>"This system replaces healthcare professionals"</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[11px] text-emerald-400 font-bold block mb-1">APPROVED TERMINOLOGY:</span>
            <ul className="text-slate-300 space-y-0.5 list-disc pl-4 text-[11px]">
              <li>"Potential physiological deterioration detected"</li>
              <li>"Unusual physiological pattern flagged"</li>
              <li>"Prototype risk score"</li>
              <li>"Human verification & intervention recommended"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
