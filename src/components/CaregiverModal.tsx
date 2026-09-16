import React, { useState } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  X,
  Heart,
  Droplets,
  Phone,
  PhoneCall,
  UserCheck,
  Home,
  CheckCircle,
  AlertCircle,
  Flame,
  ShieldCheck,
  Battery,
  MapPin,
  ExternalLink,
  MessageSquare,
  Send,
} from 'lucide-react';
import { getPatientInitials } from '../utils/nameInitials';

export const CaregiverModal: React.FC = () => {
  const {
    caregiverViewOpen,
    setCaregiverViewOpen,
    selectedPatientId,
    setSelectedPatientId,
    setActiveTab,
    patients,
    alerts,
    caregiverAcknowledge,
    sendCaregiverSms,
    emergencyScenario,
  } = useMonitoring();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [showTextComposer, setShowTextComposer] = useState(false);
  const [customText, setCustomText] = useState('');

  if (!caregiverViewOpen) return null;

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const isCritical = currentPatient.status === 'critical';
  const isWarning = currentPatient.status === 'warning';
  const isEmergency =
    isCritical ||
    isWarning ||
    (emergencyScenario.isActive && emergencyScenario.patientId === currentPatient.id) ||
    alerts.some(a => a.patientId === currentPatient.id && a.severity === 'critical' && !a.acknowledged);

  const handleAction = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenFullPage = () => {
    setCaregiverViewOpen(false);
    setActiveTab('caregiver');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl border-2 border-slate-700 shadow-2xl p-4 sm:p-6 text-white space-y-4">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
              CG
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Caregiver Mobile Companion</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                  Family View
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Live smartphone interface for adult children & designated family
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenFullPage}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1 font-semibold px-2 py-1 rounded bg-purple-950/50 border border-purple-800/60 cursor-pointer"
              title="Open full dedicated page"
            >
              <span>Full Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCaregiverViewOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient Selector */}
        <div className="flex items-center justify-between text-xs bg-slate-800/60 p-2 rounded-xl border border-slate-700">
          <span className="text-slate-400">Monitoring Loved One:</span>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="bg-slate-900 text-white font-semibold text-xs py-1 px-2.5 rounded-lg border border-slate-700 focus:ring-1 focus:ring-purple-500"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.contactPerson.relation})
              </option>
            ))}
          </select>
        </div>

        {/* Action Feedback Banner */}
        {feedback && (
          <div className="p-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Smartphone Screen Mockup */}
        <div className="bg-slate-100 rounded-2xl p-4 text-slate-900 space-y-3.5 max-h-[500px] overflow-y-auto">
          {/* Senior Profile Summary */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                  isCritical ? 'bg-rose-600' : isWarning ? 'bg-amber-600' : 'bg-emerald-600'
                }`}
              >
                {getPatientInitials(currentPatient.name)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{currentPatient.name}</h4>
                <p className="text-[11px] text-slate-500">
                  {currentPatient.contactPerson.name} ({currentPatient.contactPerson.relation})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-xs text-slate-600">
              <Battery className="w-4 h-4 text-slate-500" />
              <span className="font-mono text-xs">{currentPatient.device.batteryLevel}%</span>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`p-3 rounded-xl border text-center space-y-1 ${
              isCritical
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-1.5 font-bold text-xs">
              {isCritical ? (
                <Flame className="w-4 h-4 text-rose-600 animate-bounce" />
              ) : isWarning ? (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              )}
              <span>
                {isCritical
                  ? 'Urgent Attention Needed'
                  : isWarning
                  ? 'Mild Irregularity Observed'
                  : 'Resting Comfortably & Stable'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {isCritical
                ? 'ElderWatch detected vital deviation and inactivity. Triage alert active.'
                : isWarning
                ? 'Heart rate slightly elevated from personal baseline.'
                : 'All vitals within normal personal baseline corridors.'}
            </p>
          </div>

          {/* Vitals Summary Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Heart Rate</span>
              </div>
              <div className="font-mono font-bold text-base text-slate-900">
                {currentPatient.vitals.heartRate}{' '}
                <span className="text-[10px] font-normal text-slate-500">BPM</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Oxygen (SpO₂)</span>
              </div>
              <div className="font-mono font-bold text-base text-slate-900">
                {currentPatient.vitals.spo2}%
              </div>
            </div>
          </div>

          {/* Location / Residence */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-slate-900 block">{currentPatient.residence}</span>
              <span className="text-[10px] text-slate-500">
                {currentPatient.livingSituation} · GPS signal active
              </span>
            </div>
          </div>

          {/* Caregiver Action Controls (Differentiated by Patient State) */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            {isEmergency ? (
              /* Emergency / Critical State Controls */
              <div className="space-y-2">
                <button
                  onClick={() => {
                    caregiverAcknowledge(currentPatient.id);
                    handleAction(`Notified hospital & clinical staff: "Caregiver is responding and en route to ${currentPatient.name}".`);
                  }}
                  className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>I Am On My Way (Acknowledge Alert)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      handleAction(`Direct phone call placed to ${currentPatient.name}...`)
                    }
                    className="py-2 px-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Senior</span>
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        `Emergency services (119 / 995) contacted with residence address: ${currentPatient.residence}.`
                      )
                    }
                    className="py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                    <span>Dial 119 / 995</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Stable State Controls: Calling + Texting, Dial 119/995 preserved as safety net */
              <div className="space-y-2">
                {showTextComposer ? (
                  <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-xs space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Send Text to {currentPatient.name.split(',')[0]}</span>
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
                            sendCaregiverSms(currentPatient.id, msg);
                            handleAction(`✓ Text delivered to ${currentPatient.name}: "${msg}"`);
                            setCustomText('');
                            setShowTextComposer(false);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const msg = customText.trim() || 'Hi Mom, just checking in! ❤️';
                          sendCaregiverSms(currentPatient.id, msg);
                          handleAction(`✓ Text delivered to ${currentPatient.name}: "${msg}"`);
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
                      onClick={() =>
                        handleAction(`Direct phone call placed to ${currentPatient.name}...`)
                      }
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Senior</span>
                    </button>

                    <button
                      onClick={() => setShowTextComposer(true)}
                      className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Text Senior</span>
                    </button>
                  </div>
                )}

                {/* Emergency backup remains accessible */}
                <button
                  onClick={() =>
                    handleAction(
                      `Emergency services (119 / 995) contacted with residence address: ${currentPatient.residence}.`
                    )
                  }
                  className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition"
                  title="Emergency 119/995 backup in case of mishap"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span>Dial 119 / 995</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
