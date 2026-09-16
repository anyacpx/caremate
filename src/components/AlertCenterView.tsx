import React, { useState, useMemo } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { Alert } from '../types';
import { getPatientInitials } from '../utils/nameInitials';
import {
  Flame,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronRight,
  Hospital,
  PhoneCall,
  Search,
  Check,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    setSelectedPatientId,
    setActiveTab,
    notifyCaregiverAction,
    escalateToHospitalAction,
    setCaregiverViewOpen,
    caregiverNotifiedIds,
  } = useMonitoring();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'critical' && alert.severity === 'critical') ||
        (selectedCategory === 'high' && alert.severity === 'high') ||
        (selectedCategory === 'warning' && alert.severity === 'warning') ||
        (selectedCategory === 'resolved' && alert.severity === 'resolved');

      const matchesSearch =
        alert.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [alerts, selectedCategory, searchQuery]);

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const resolvedCount = alerts.filter(a => a.severity === 'resolved').length;

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600 text-white flex items-center space-x-1 shadow-xs animate-pulse">
            <Flame className="w-3.5 h-3.5" />
            <span>🔴 CRITICAL ESCALATION</span>
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600 text-white flex items-center space-x-1 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>🟠 HIGH PRIORITY</span>
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-900 border border-yellow-300 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-700" />
            <span>🟡 ATTENTION / WARNING</span>
          </span>
        );
      case 'resolved':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>🟢 RESOLVED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span>Alert & Escalation Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
              {criticalCount} Critical
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Triage queue prioritizing seniors requiring immediate human assistance and clinical review
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient alerts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            selectedCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setSelectedCategory('critical')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
            selectedCategory === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          <span>Critical</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-900 text-[10px]">{criticalCount}</span>
        </button>
        <button
          onClick={() => setSelectedCategory('high')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
            selectedCategory === 'high' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          <span>High</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px]">{highCount}</span>
        </button>
        <button
          onClick={() => setSelectedCategory('warning')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
            selectedCategory === 'warning' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
          }`}
        >
          <span>Warning / Attention</span>
          <span className="px-1.5 py-0.2 rounded-full bg-yellow-200 text-yellow-900 text-[10px]">{warningCount}</span>
        </button>
        <button
          onClick={() => setSelectedCategory('resolved')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
            selectedCategory === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <span>Resolved</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 text-[10px]">{resolvedCount}</span>
        </button>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const isCrit = alert.severity === 'critical';
          const isHigh = alert.severity === 'high';

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-5 shadow-xs transition-all ${
                isCrit
                  ? 'bg-white border-rose-400 ring-2 ring-rose-200/50'
                  : isHigh
                  ? 'bg-white border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Alert Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isCrit ? 'bg-rose-600 text-white' : isHigh ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {getPatientInitials(alert.patientName)}
                  </div>
                  {getSeverityBadge(alert.severity)}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <span>{alert.patientName}</span>
                      <span className="text-xs text-slate-500 font-mono">({alert.patientAge} years old)</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.timestamp} ({alert.timeAgo})</span>
                </div>
              </div>

              {/* Alert Title & Summary */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.summary}</p>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-800">
                  {alert.metricsSummary}
                </div>
              </div>

              {/* Section 16: Alert Prioritization Explanation */}
              <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 mb-4 text-xs space-y-2">
                <div className="flex items-center justify-between text-blue-950 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Why this alert is prioritized ({alert.severity.toUpperCase()}):</span>
                  </span>
                  <span className="text-[11px] font-mono text-blue-700">Prototype Decision Support</span>
                </div>

                <ul className="space-y-1 text-slate-700 pl-4 list-disc text-xs">
                  {alert.contributingSignals.map((sig, sIdx) => (
                    <li key={sIdx}>{sig}</li>
                  ))}
                </ul>

                <p className="text-[11px] text-blue-800/80 italic pt-1">
                  Compound multi-vector telemetry triggered automated escalation protocol. This is a prototype decision-support demonstration, not a clinical diagnosis.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center space-x-2">
                  {alert.acknowledged ? (
                    <span className="text-emerald-700 font-medium flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Acknowledged by {alert.acknowledgedBy || 'Clinical Staff'}</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold animate-pulse">
                      Pending staff clinical review
                    </span>
                  )}
                </div>

                {/* Simplified Alert Action Buttons */}
                <div className="flex items-center space-x-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition"
                      title="Mark alert as acknowledged by clinician"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {/* Primary Action: Notify Caregiver */}
                  <button
                    onClick={() => notifyCaregiverAction(alert.patientId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs transition ${
                      caregiverNotifiedIds.includes(alert.patientId)
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    title="Send immediate priority notification to caregiver"
                  >
                    {caregiverNotifiedIds.includes(alert.patientId) ? (
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

                  {/* Secondary Action: View Patient */}
                  <button
                    onClick={() => {
                      setSelectedPatientId(alert.patientId);
                      setActiveTab('patient-detail');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition"
                  >
                    <span>View Patient</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            No alerts found matching the active filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
