import React, { useState } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  Heart,
  Droplets,
  Clock,
  Phone,
  PhoneCall,
  UserCheck,
  Home,
  CheckCircle,
  AlertCircle,
  Flame,
  ShieldCheck,
  ChevronRight,
  Battery,
  MapPin,
  MessageSquare,
  Send,
} from 'lucide-react';

export const CaregiverView: React.FC = () => {
  const { patients, alerts, caregiverAcknowledge, sendCaregiverSms, emergencyScenario } = useMonitoring();
  const [selectedCaregiverPatientId, setSelectedCaregiverPatientId] = useState('p-01');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showTextComposer, setShowTextComposer] = useState(false);
  const [customText, setCustomText] = useState('');

  const patient = patients.find(p => p.id === selectedCaregiverPatientId) || patients[0];
  const isCritical = patient.status === 'critical';
  const isWarning = patient.status === 'warning';
  const isEmergency =
    isCritical ||
    isWarning ||
    (emergencyScenario.isActive && emergencyScenario.patientId === patient.id) ||
    alerts.some(a => a.patientId === patient.id && a.severity === 'critical' && !a.acknowledged);

  const handleAction = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span>ElderWatch Family & Caregiver Mode</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200">
              Mobile Companion Experience
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Simplified, reassuring family interface designed for adult children and assigned home caregivers
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Select Loved One:</span>
          <select
            value={selectedCaregiverPatientId}
            onChange={e => setSelectedCaregiverPatientId(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-purple-500"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.contactPerson.relation})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionFeedback && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Caregiver Mobile Simulation Container */}
      <div className="max-w-md mx-auto bg-slate-900 rounded-[36px] p-4 shadow-2xl border-4 border-slate-800">
        {/* Smartphone Notch / Speaker */}
        <div className="w-32 h-4 bg-slate-950 mx-auto rounded-full mb-3 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="bg-slate-50 rounded-[28px] p-5 space-y-4 text-slate-900 overflow-hidden min-h-[580px] flex flex-col justify-between">
          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  ElderWatch Care
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {patient.name} <span className="text-xs font-normal text-slate-500">({patient.contactPerson.relation})</span>
                </h3>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <Battery className="w-4 h-4 text-slate-500" />
                <span className="font-mono text-xs font-semibold">{patient.device.batteryLevel}%</span>
              </div>
            </div>

            {/* Status Callout Card */}
            <div
              className={`p-4 rounded-2xl border text-center space-y-1.5 transition-all ${
                isCritical
                  ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                  : isWarning
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-center space-x-1.5">
                {isCritical ? (
                  <Flame className="w-5 h-5 text-rose-600 animate-bounce" />
                ) : isWarning ? (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
                <span className="text-sm font-black uppercase tracking-wide">
                  {isCritical ? 'Immediate Attention Needed' : isWarning ? 'Elevated Warning' : 'Mom Is Safe & Stable'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {isCritical
                  ? 'ElderWatch detected vital deviations and Mom did not tap her watch check-in.'
                  : isWarning
                  ? 'Resting pulse is elevated above typical baseline.'
                  : 'Telemetry is matching normal daily rhythm and movement.'}
              </p>
            </div>

            {/* Current Physiological Indicators */}
            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>Heart Rate</span>
                </span>
                <div className="text-lg font-black font-mono text-slate-900 mt-1">
                  {patient.vitals.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
                </div>
                <span className={`text-[10px] font-semibold ${patient.vitals.heartRate > patient.baseline.heartRateMax ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {patient.vitals.heartRate > patient.baseline.heartRateMax ? 'Higher than normal' : 'Normal resting'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span>Blood Oxygen</span>
                </span>
                <div className="text-lg font-black font-mono text-slate-900 mt-1">
                  {patient.vitals.spo2}%
                </div>
                <span className={`text-[10px] font-semibold ${patient.vitals.spo2 < patient.baseline.spo2Min ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {patient.vitals.spo2 < patient.baseline.spo2Min ? 'Lower than normal' : 'Normal oxygenation'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Last Movement</span>
                </span>
                <div className="text-lg font-black font-mono text-slate-900 mt-1">
                  {patient.vitals.lastMovementMinutesAgo}m <span className="text-xs font-normal text-slate-400">ago</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {patient.vitals.lastMovementMinutesAgo > 15 ? 'Motionless' : 'Recent activity'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Location</span>
                </span>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {patient.residence.split(',')[0]}
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">At Home</span>
              </div>
            </div>
          </div>

          {/* Caregiver Action Controls (Differentiated by Patient State) */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            {isEmergency ? (
              /* Emergency Patient Controls: Respond en route + Call + Dial 119/995 */
              <div className="space-y-2">
                <button
                  onClick={() => {
                    caregiverAcknowledge(patient.id);
                    handleAction(`Notified Hospital & System: "Caregiver is responding and en route to ${patient.name}!"`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>I Am On My Way (Acknowledge Alert)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAction(`Direct phone call placed to ${patient.name}...`)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Senior</span>
                  </button>

                  <button
                    onClick={() => handleAction(`Connecting to 119/995 EMS Dispatch with live GPS telemetry for ${patient.name}...`)}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    <span>Dial 119 / 995</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Stable Patient Controls: Calling + Texting, with 119/995 safety backup */
              <div className="space-y-2">
                {showTextComposer ? (
                  <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-xs space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Send Text to {patient.name.split(',')[0]}</span>
                      </span>
                      <button
                        onClick={() => setShowTextComposer(false)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {[
                        "Hi Mom, just checking in on you! ❤️",
                        "Remember to drink water & take your meds 💊",
                        "Everything looks good today! Love you.",
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setCustomText(preset)}
                          className="text-[10px] py-1 px-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-left transition cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <input
                        type="text"
                        value={customText}
                        onChange={e => setCustomText(e.target.value)}
                        placeholder="Type message to smartwatch..."
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && (customText.trim() || 'Hi Mom, just checking in! ❤️')) {
                            const msg = customText.trim() || 'Hi Mom, just checking in! ❤️';
                            sendCaregiverSms(patient.id, msg);
                            handleAction(`✓ Text delivered to ${patient.name}: "${msg}"`);
                            setCustomText('');
                            setShowTextComposer(false);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const msg = customText.trim() || 'Hi Mom, just checking in! ❤️';
                          sendCaregiverSms(patient.id, msg);
                          handleAction(`✓ Text delivered to ${patient.name}: "${msg}"`);
                          setCustomText('');
                          setShowTextComposer(false);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAction(`Direct phone call placed to ${patient.name}...`)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Senior</span>
                    </button>

                    <button
                      onClick={() => setShowTextComposer(true)}
                      className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Text Senior</span>
                    </button>
                  </div>
                )}

                {/* Safety backup: 119 / 995 */}
                <button
                  onClick={() => handleAction(`Connecting to 119/995 EMS Dispatch with live GPS telemetry for ${patient.name}...`)}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  title="Emergency 119/995 backup in case of mishap"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Dial 119 / 995</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="max-w-md mx-auto text-center text-xs text-slate-500 mt-2 italic">
        "ElderWatch is watching over your family member so you can have peace of mind when you cannot be there in person."
      </div>
    </div>
  );
};
