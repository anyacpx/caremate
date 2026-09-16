import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { PersonalBaselineCard } from './PersonalBaselineCard';
import { EarlyWarningAnalysisCard } from './EarlyWarningAnalysisCard';
import { VitalTrendCharts } from './VitalTrendCharts';
import { EventTimelineCard } from './EventTimelineCard';
import { getPatientInitials } from '../utils/nameInitials';
import {
  Heart,
  Droplets,
  Activity,
  Thermometer,
  Wind,
  Footprints,
  Clock,
  Battery,
  Wifi,
  Phone,
  PhoneCall,
  User,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HeartHandshake,
} from 'lucide-react';

export const PatientDetailView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    setActiveTab,
    startEmergencyScenario,
    emergencyScenario,
    notifyCaregiverAction,
    escalateToHospitalAction,
    setCaregiverViewOpen,
    caregiverNotifiedIds,
  } = useMonitoring();

  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  if (!patient) return null;

  const isCritical = patient.status === 'critical';
  const isWarning = patient.status === 'warning' || patient.status === 'attention';
  const isCaregiverNotified = caregiverNotifiedIds.includes(patient.id);

  const currentIndex = patients.findIndex(p => p.id === patient.id);
  const prevPatient = currentIndex > 0 ? patients[currentIndex - 1] : null;
  const nextPatient = currentIndex < patients.length - 1 ? patients[currentIndex + 1] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Patient Header & Triage Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('command-center')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition"
              title="Return to Command Center"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Clean Patient Selector */}
            <select
              value={patient.id}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age} yrs) — Risk: {p.riskScore}
                </option>
              ))}
            </select>
          </div>

          {/* Simplified Core Action Buttons: Notify Caregiver & Caregiver View */}
          <div className="flex items-center space-x-2">
            {/* Primary Action: Notify Caregiver */}
            <button
              onClick={() => notifyCaregiverAction(patient.id)}
              disabled={isCaregiverNotified}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition ${
                isCaregiverNotified
                  ? 'bg-emerald-600 text-white cursor-default opacity-90'
                  : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              }`}
              title={isCaregiverNotified ? 'Caregiver has already been dispatched' : 'Send urgent SMS and push notification to patient caregiver'}
            >
              {isCaregiverNotified ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>✓ Caregiver Notified</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Notify Caregiver</span>
                </>
              )}
            </button>

            {/* Secondary Action: Caregiver View */}
            <button
              onClick={() => {
                setSelectedPatientId(patient.id);
                setCaregiverViewOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
              title="Open Caregiver mobile view for patient family"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
              <span>Caregiver View</span>
            </button>
          </div>
        </div>

        {/* Patient Profile Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div
                id="patient-initials-avatar"
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-black tracking-wider ${
                  isCritical ? 'bg-rose-600 text-white shadow-sm' : 'bg-blue-600 text-white'
                }`}
                title={`Initials for ${patient.name}`}
              >
                {getPatientInitials(patient.name)}
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                  <span className="text-sm font-semibold text-slate-500 font-mono">
                    {patient.age} years old ({patient.gender})
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isCritical
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {patient.status === 'critical' ? '🔴 CRITICAL RISK' : patient.status === 'warning' ? '🟠 HIGH RISK' : patient.status === 'attention' ? '🟡 ATTENTION' : '🟢 STABLE'}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span><strong>Residence:</strong> {patient.residence} ({patient.livingSituation})</span>
                  <span><strong>Caregiver:</strong> {patient.contactPerson.name} ({patient.contactPerson.relation}) · {patient.contactPerson.phone}</span>
                  <span><strong>Physician:</strong> {patient.primaryPhysician}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Wearable Device Status Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs shrink-0 flex items-center space-x-4">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Assigned Wearable</div>
              <div className="font-bold text-slate-800">{patient.device.model}</div>
              <div className="text-[11px] text-emerald-700 flex items-center space-x-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Connected · Telemetry Active</span>
              </div>
            </div>

            <div className="border-l border-slate-200 pl-3 space-y-1 text-slate-600 font-mono text-[11px]">
              <div className="flex items-center space-x-1">
                <Battery className="w-3.5 h-3.5 text-slate-500" />
                <span>Battery: {patient.device.batteryLevel}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Sync: {patient.device.lastSyncSecondsAgo}s ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 8: Current Vitals Grid (with measurement origin indicators) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Current Physiological Vitals</h3>
            <p className="text-xs text-slate-500">
              Multi-sensor telemetry stream from continuous wrist wearable and peripheral medical sensors
            </p>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              <span>Wearable Sensor</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
              <span>Peripheral Medical Cuff</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Heart Rate */}
          <div className={`bg-white rounded-xl p-3.5 border ${
            patient.vitals.heartRate > patient.baseline.heartRateMax
              ? 'border-rose-300 bg-rose-50/40 shadow-xs'
              : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Heart className={`w-3.5 h-3.5 ${patient.vitals.heartRate > patient.baseline.heartRateMax ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} />
                <span>Heart Rate</span>
              </span>
              <span className="text-[10px] px-1 rounded bg-blue-100 text-blue-800">Watch</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              <span className={patient.vitals.heartRate > patient.baseline.heartRateMax ? 'text-rose-700' : ''}>
                {patient.vitals.heartRate}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-normal">BPM</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Baseline: {patient.baseline.heartRateMin}–{patient.baseline.heartRateMax} BPM
            </div>
          </div>

          {/* SpO2 */}
          <div className={`bg-white rounded-xl p-3.5 border ${
            patient.vitals.spo2 < patient.baseline.spo2Min
              ? 'border-rose-300 bg-rose-50/40 shadow-xs'
              : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Droplets className={`w-3.5 h-3.5 ${patient.vitals.spo2 < patient.baseline.spo2Min ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>SpO₂</span>
              </span>
              <span className="text-[10px] px-1 rounded bg-blue-100 text-blue-800">Watch</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              <span className={patient.vitals.spo2 < patient.baseline.spo2Min ? 'text-rose-700' : ''}>
                {patient.vitals.spo2}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Baseline: {patient.baseline.spo2Min}–{patient.baseline.spo2Max}%
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Blood Pressure</span>
              <span className="text-[10px] px-1 rounded bg-purple-100 text-purple-800">Cuff</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia}
              <span className="text-xs text-slate-400 ml-1 font-normal">mmHg</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Baseline: {patient.baseline.bloodPressureSysMin}–{patient.baseline.bloodPressureSysMax} sys
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                <span>Respiratory</span>
              </span>
              <span className="text-[10px] px-1 rounded bg-blue-100 text-blue-800">Watch</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {patient.vitals.respiratoryRate}
              <span className="text-xs text-slate-400 ml-1 font-normal">/ min</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Baseline: 14–18 / min
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                <span>Temperature</span>
              </span>
              <span className="text-[10px] px-1 rounded bg-blue-100 text-blue-800">Watch</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {patient.vitals.temperature}°C
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Skin surface sensor
            </div>
          </div>

          {/* Daily Steps */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Footprints className="w-3.5 h-3.5 text-slate-400" />
                <span>Steps Today</span>
              </span>
              <span className="text-[10px] px-1 rounded bg-blue-100 text-blue-800">Watch</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {patient.vitals.stepsToday}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Goal: {patient.baseline.dailyStepsExpected}
            </div>
          </div>

          {/* Activity / Last Movement */}
          <div className={`bg-white rounded-xl p-3.5 border col-span-2 md:col-span-1 ${
            patient.vitals.activityLevel === 'Very Low' || patient.vitals.activityLevel === 'None'
              ? 'border-rose-300 bg-rose-50/40'
              : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span>Activity</span>
              </span>
              <span className="text-[10px] px-1 rounded bg-blue-100 text-blue-800">Watch</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              <span className={patient.vitals.activityLevel === 'Very Low' || patient.vitals.activityLevel === 'None' ? 'text-rose-700 font-extrabold' : ''}>
                {patient.vitals.activityLevel}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Motionless: {patient.vitals.lastMovementMinutesAgo}m ago
            </div>
          </div>
        </div>
      </div>

      {/* Section 10: Early Warning Analysis Card */}
      <EarlyWarningAnalysisCard patient={patient} />

      {/* Section 17: Personal Baseline Profile */}
      <PersonalBaselineCard patient={patient} />

      {/* Section 9: 6-12 Hour Trend Charts */}
      <VitalTrendCharts patient={patient} />

      {/* Section 11: Event Timeline & Intervention Lifecycle */}
      <EventTimelineCard patient={patient} />
    </div>
  );
};
