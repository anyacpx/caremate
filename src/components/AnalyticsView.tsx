import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  LineChart,
  Users,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  HeartHandshake,
  Activity,
  Layers,
  Info,
  TrendingUp,
  Award,
  CheckCircle,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { totalMonitored, totalStable, totalAttention, totalCritical } = useMonitoring();

  // Simulated demonstration data
  const alertsToday = 37;
  const interventionsInitiated = 9;
  const avgResponseTime = '4m 18s';

  // Risk distribution data
  const riskDistribution = [
    { label: 'Low Risk (0–29)', count: 212, pct: 85.5, color: 'bg-emerald-500' },
    { label: 'Moderate (30–49)', count: 19, pct: 7.6, color: 'bg-yellow-500' },
    { label: 'Elevated (50–69)', count: 9, pct: 3.6, color: 'bg-amber-500' },
    { label: 'High (70–84)', count: 3, pct: 1.2, color: 'bg-orange-600' },
    { label: 'Critical (85–100)', count: 5, pct: 2.1, color: 'bg-rose-600' },
  ];

  // Common alert types data
  const commonAlertTypes = [
    { type: 'Acute SpO₂ Desaturation', count: 14, pct: 38 },
    { type: 'Resting Tachycardia (>100 BPM)', count: 11, pct: 30 },
    { type: 'Prolonged Kinetic Inactivity (>30m)', count: 6, pct: 16 },
    { type: 'Multi-Signal Concurrent Variance', count: 4, pct: 11 },
    { type: 'Wearable Disconnection (>15m)', count: 2, pct: 5 },
  ];

  // Hourly alert volume (00:00 to 11:00)
  const hourlyAlerts = [
    { hour: '02:00', count: 1 },
    { hour: '04:00', count: 2 },
    { hour: '06:00', count: 4 },
    { hour: '07:00', count: 6 },
    { hour: '08:00', count: 8 },
    { hour: '09:00', count: 7 },
    { hour: '10:00', count: 6 },
    { hour: '11:00', count: 3 },
  ];

  const maxHourly = Math.max(...hourlyAlerts.map(h => h.count));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span>Hospital Population Health & Triage Analytics</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
              Central Hospital Dashboard
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Aggregated demonstration telemetry, response metrics, and risk distribution across cohort
          </p>
        </div>
      </div>

      {/* Population Overview KPI Row (Section 20) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Patients Monitored</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{totalMonitored}</div>
          <span className="text-[11px] text-slate-500">Active cohort</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Stable Seniors</span>
          <div className="text-2xl font-black font-mono text-emerald-800 mt-1">{totalStable}</div>
          <span className="text-[11px] text-emerald-600">93.1% in baseline</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-700">At Risk (Attention)</span>
          <div className="text-2xl font-black font-mono text-amber-800 mt-1">{totalAttention}</div>
          <span className="text-[11px] text-amber-600">Under observation</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-rose-300 bg-rose-50/30 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-rose-700">Critical Alerts</span>
          <div className="text-2xl font-black font-mono text-rose-800 mt-1">{totalCritical}</div>
          <span className="text-[11px] text-rose-600 font-bold">Priority triage</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Alerts Today</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{alertsToday}</div>
          <span className="text-[11px] text-slate-500">Telemetry triggers</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Interventions Initiated</span>
          <div className="text-2xl font-black font-mono text-blue-700 mt-1">{interventionsInitiated}</div>
          <span className="text-[11px] text-blue-600">Human responses</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Alert Response</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{avgResponseTime}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Target: &lt;5 mins</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hourly Alerts Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Alert Frequency Over Time (Today)</h3>
              <p className="text-xs text-slate-500">Distribution of automated warning signals across 24h cycle</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Peak: 08:00 AM (Morning wake)</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200">
            {hourlyAlerts.map(item => {
              const heightPct = (item.count / maxHourly) * 100;
              return (
                <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition">
                    {item.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[36px] bg-blue-600 hover:bg-blue-500 rounded-t-sm transition-all shadow-2xs"
                  ></div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">{item.hour}</span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 text-right">
            * Simulated demonstration metrics
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prototype Risk Score Distribution</h3>
              <p className="text-xs text-slate-500">Proportion of patients by simulated risk tier (0–100)</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {riskDistribution.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-mono text-slate-500">{item.count} patients ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.pct}%` }}
                    className={`h-full ${item.color} rounded-full`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Alert Types */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Primary Anomaly Classifications</h3>
              <p className="text-xs text-slate-500">Most frequent underlying triggers for early warnings</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {commonAlertTypes.map(item => (
              <div key={item.type} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span className="font-medium text-slate-800">{item.type}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">{item.count} events</span>
                  <span className="text-[11px] text-slate-400 font-mono">({item.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wearable Telemetry Quality & Reliability */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Telemetry Ingestion Health</h3>
              <p className="text-xs text-slate-500">Signal resilience and data packet arrival reliability</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Packet Arrival Rate</span>
              <div className="text-lg font-bold font-mono text-emerald-700 mt-1">99.4%</div>
              <p className="text-[10px] text-slate-500 mt-0.5">&lt;0.6% dropped telemetry</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Battery Depletion Risk</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-1">3 Devices</div>
              <p className="text-[10px] text-amber-600 mt-0.5">&lt;20% charge notification</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Mean Telemetry Latency</span>
              <div className="text-lg font-bold font-mono text-blue-700 mt-1">1.8 seconds</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time edge ingestion</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Caregiver App Active</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-1">94% Family</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Linked primary contacts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 21: KEY PERFORMANCE INDICATORS - Potential System Impact */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Potential System Impact</h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30 inline-block mt-2">
            Potential outcomes to validate in future clinical studies
          </span>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            ElderWatch is an early-stage healthcare technology platform demonstration. We do not claim clinical validation or unverified mortality reductions. Below are the targeted efficacy metrics planned for prospective clinical trials with partner hospitals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <span className="text-xs font-bold text-blue-300">Earlier Detection of Deterioration</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detect physiological inflection points 2–4 hours earlier than periodic nursing rounds or emergency 911 calls.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <span className="text-xs font-bold text-blue-300">Faster Caregiver & EMS Response</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated multi-channel push and SMS alerts reduce caregiver discovery lag for unattended homebound seniors.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <span className="text-xs font-bold text-blue-300">Reduced Unattended Emergencies</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminate "found down" multi-hour periods by detecting motionlessness coupled with desaturation or acute tachycardia.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <span className="text-xs font-bold text-blue-300">Reduced Time to Human Intervention</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Shorten the critical window between vital-sign divergence and active clinical or familial intervention.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <span className="text-xs font-bold text-blue-300">Monitoring Seniors Living Alone</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provide safety reassurance and dignity for independent frail elders without intrusive cameras or audio mics.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <span className="text-xs font-bold text-blue-300">Better Patient Prioritization</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enable centralized clinical monitoring teams to immediately answer: "Who needs help right now, and who needs help first?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
