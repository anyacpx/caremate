import React from 'react';
import { Patient, TimelineEvent } from '../types';
import { useMonitoring } from '../context/MonitoringContext';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Flame,
  ArrowDown,
  ShieldCheck,
  Send,
  UserCheck,
  Hospital,
  Check,
} from 'lucide-react';

interface EventTimelineCardProps {
  patient: Patient;
}

export const EventTimelineCard: React.FC<EventTimelineCardProps> = ({ patient }) => {
  const { caregiverAcknowledge, alerts, resolveAlert } = useMonitoring();
  const [enRouteAcknowledgedLocally, setEnRouteAcknowledgedLocally] = React.useState(false);

  const getStatusBadge = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">🔴 Critical</span>;
      case 'high_risk':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">🔴 High Risk</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">🟠 Warning</span>;
      case 'attention':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">🟡 Attention</span>;
      case 'change':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200">🟡 Change Detected</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">🟢 Resolved</span>;
      case 'normal':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">🟢 Normal</span>;
    }
  };

  const currentAlert = alerts.find(a => a.patientId === patient.id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <span>Incident Telemetry Timeline</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Temporal Chain
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step chronology illustrating detection, automated check-in, and human notification
          </p>
        </div>

        {patient.checkInStatus === 'no_response' && (
          <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold text-xs border border-rose-300 animate-pulse">
            Active Escalation Protocol
          </span>
        )}
      </div>

      {/* Vertical Stepped Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {patient.timeline.map((event, idx) => {
          const isLast = idx === patient.timeline.length - 1;
          const isCrit = event.status === 'critical' || event.status === 'high_risk';

          return (
            <div key={event.id} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                  isCrit
                    ? 'bg-rose-600 border-rose-200 text-white animate-pulse'
                    : event.status === 'resolved'
                    ? 'bg-emerald-600 border-emerald-200 text-white'
                    : 'bg-white border-blue-500 text-blue-600'
                }`}
              >
                {idx + 1}
              </div>

              {/* Event card content */}
              <div className={`p-3.5 rounded-lg border ${
                isCrit
                  ? 'bg-rose-50/70 border-rose-200 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200/80'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {event.time}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{event.title}</span>
                  </div>
                  {getStatusBadge(event.status)}
                </div>

                {event.detail && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-1">
                    {event.detail}
                  </p>
                )}
              </div>

              {/* Arrow downwards between steps */}
              {!isLast && (
                <div className="flex justify-center -mb-3 my-1">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Section 24: Intervention Status Record if alert exists */}
      {currentAlert && (
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5">
                <Hospital className="w-4 h-4 text-blue-400" />
                <span>Intervention Lifecycle Record</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Status: {currentAlert.interventionStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {currentAlert.interventionSteps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-center space-x-2 text-slate-300">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step.completed ? '✓' : '•'}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px] w-16">{step.time}</span>
                  <span className={step.completed ? 'text-slate-100' : 'text-slate-400'}>{step.text}</span>
                </div>
              ))}
            </div>

            {/* Response actions */}
            <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-800">
              {currentAlert.interventionStatus !== 'resolved' ? (
                <>
                  {(() => {
                    const isAlreadyEnRoute =
                      enRouteAcknowledgedLocally ||
                      currentAlert.interventionStatus === 'responding' ||
                      currentAlert.interventionSteps.some(
                        s =>
                          s.text.toLowerCase().includes('en route') ||
                          s.text.toLowerCase().includes('responding') ||
                          s.text.toLowerCase().includes('on route')
                      );

                    return isAlreadyEnRoute ? (
                      <button
                        disabled
                        className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-emerald-500/40 text-xs font-semibold rounded-md flex items-center space-x-1.5 cursor-not-allowed opacity-90 select-none"
                        title="Caregiver en route has already been acknowledged. Further clicks disabled to prevent duplicate entries."
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✓ Caregiver En Route Acknowledged</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEnRouteAcknowledgedLocally(true);
                          caregiverAcknowledge(patient.id);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition cursor-pointer flex items-center space-x-1.5 shadow-xs"
                        title="Confirm caregiver has been dispatched and is en route"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Acknowledge Caregiver En Route</span>
                      </button>
                    );
                  })()}
                  <button
                    onClick={() => resolveAlert(currentAlert.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Event Resolved</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>EVENT RESOLVED — Closed loop: Detection → Alert → Human Response → Stabilization</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
