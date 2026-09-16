import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { PhoneCall, CheckCircle, X, ExternalLink } from 'lucide-react';

export const CaregiverToast: React.FC = () => {
  const { caregiverToast, dismissCaregiverToast, setCaregiverViewOpen } = useMonitoring();

  if (!caregiverToast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl text-white space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Caregiver Alert Dispatched
              </h4>
              <p className="text-sm font-bold text-white">
                {caregiverToast.patientName} → {caregiverToast.caregiverName}
              </p>
            </div>
          </div>

          <button
            onClick={dismissCaregiverToast}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700 text-xs text-slate-300 space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Relationship:</span>
            <span className="font-semibold text-white">{caregiverToast.relation}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Recipient Phone:</span>
            <span className="font-mono text-emerald-300 font-bold">{caregiverToast.caregiverPhone}</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700">
            Emergency SMS & push alert dispatched. Senior's live GPS and vital telemetry attached.
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => {
              dismissCaregiverToast();
              setCaregiverViewOpen(true);
            }}
            className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
          >
            <span>Preview Caregiver View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={dismissCaregiverToast}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
