import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  Watch,
  Flame,
  AlertTriangle,
  PhoneCall,
  Hospital,
  ShieldCheck,
  CheckCircle,
  X,
  Heart,
  Droplets,
  Radio,
  ExternalLink,
} from 'lucide-react';

export const EmergencyEscalationModal: React.FC = () => {
  const {
    emergencyScenario,
    respondToCheckIn,
    dismissEscalationModal,
    stopEmergencyScenario,
    setCaregiverViewOpen,
    patients,
  } = useMonitoring();

  const isCheckInActive = emergencyScenario.autoCheckInActive;
  const isEscalated = emergencyScenario.showEscalationModal;

  if (!isCheckInActive && !isEscalated) return null;

  const targetPatient = patients.find(p => p.id === emergencyScenario.patientId) || patients[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      {/* 1. Stage 4: Wearable Check-In Interaction Prompt */}
      {isCheckInActive && (
        <div className="bg-slate-900 border-4 border-amber-500 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-5 animate-bounce-short">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 mx-auto flex items-center justify-center">
            <Watch className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Samsung Galaxy Watch6 · Haptic Vibration
            </span>
            <h3 className="text-xl font-black text-white">
              Are You Feeling Okay?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sudden heart rate elevation and SpO₂ decrease detected for <strong className="text-white">{targetPatient.name}</strong>.
            </p>
          </div>

          {/* Countdown Indicator */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 space-y-1">
            <div className="text-xs text-slate-400 font-medium">
              Awaiting senior response before auto-escalation:
            </div>
            <div className="text-2xl font-mono font-black text-amber-400">
              00:0{emergencyScenario.checkInCountdown}
            </div>
            <div className="text-[10px] text-slate-500">
              If unanswered, central command and caregiver will be alerted.
            </div>
          </div>

          {/* Interactive Simulation Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => respondToCheckIn('ok')}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              ✓ I'm OK
            </button>
            <button
              onClick={() => respondToCheckIn('needs_help')}
              className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              ⚠ I Need Help
            </button>
          </div>

          <p className="text-[10px] text-slate-500 italic">
            Tap "I Need Help" or wait for countdown timeout to simulate emergency escalation.
          </p>
        </div>
      )}

      {/* 2. Stage 5: Critical Escalation Protocol Activated Modal */}
      {isEscalated && !isCheckInActive && (
        <div className="bg-slate-900 border-4 border-rose-600 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-rose-600 p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center font-black">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-rose-200 block">
                  PRIORITY EMERGENCY PROTOCOL
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Emergency Escalation Dispatched
                </h3>
              </div>
            </div>
            <button
              onClick={dismissEscalationModal}
              className="p-1 rounded-lg hover:bg-rose-700 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Patient & Trigger Summary */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{targetPatient.name}</h4>
                  <p className="text-xs text-slate-400">
                    Age {targetPatient.age} · {targetPatient.residence} ({targetPatient.livingSituation})
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Risk: {targetPatient.riskScore} / 100
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-xs font-mono">
                <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                  <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                  <span className="text-rose-400 font-bold text-sm">
                    {targetPatient.vitals.heartRate} BPM
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                  <span className="text-slate-400 block text-[10px]">SpO₂</span>
                  <span className="text-rose-400 font-bold text-sm">
                    {targetPatient.vitals.spo2}%
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                  <span className="text-slate-400 block text-[10px]">Movement</span>
                  <span className="text-rose-400 font-bold text-sm">Ceased</span>
                </div>
              </div>
            </div>

            {/* Live Automated Dispatch Protocol Log */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Automated System Responses (Concurrent Broadcast):
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">1. Wearable Haptic Check-in Sent</span>
                    <span className="text-slate-400 text-[11px]">Prompt timed out after 60 seconds with no senior interaction.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-start space-x-3">
                  <PhoneCall className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      2. Primary Caregiver Alerted: {targetPatient.contactPerson.name}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      High-priority push alert & automated voice call placed to {targetPatient.contactPerson.phone}.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-start space-x-3">
                  <Hospital className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">3. Hospital Command Center & EMS Notified</span>
                    <span className="text-slate-400 text-[11px]">
                      {targetPatient.primaryPhysician} on-call station alerted with live vitals trend.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={dismissEscalationModal}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition"
              >
                <span>Acknowledge Alert</span>
              </button>

              <button
                onClick={() => {
                  dismissEscalationModal();
                  setCaregiverViewOpen(true);
                }}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-600 cursor-pointer transition"
              >
                <span>Open Caregiver View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
