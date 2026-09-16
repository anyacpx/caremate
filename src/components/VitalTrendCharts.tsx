import React, { useState } from 'react';
import { Patient } from '../types';
import { generateTrendData, VitalTrendPoint } from '../data/mockPatients';
import { Activity, Droplets, Heart, Info } from 'lucide-react';

interface VitalTrendChartsProps {
  patient: Patient;
}

export const VitalTrendCharts: React.FC<VitalTrendChartsProps> = ({ patient }) => {
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'spo2' | 'activity' | 'bloodPressure'>('heartRate');
  const trendData: VitalTrendPoint[] = generateTrendData(patient);

  const baseline = patient.baseline;
  const current = patient.vitals;

  // Render SVG chart based on selected metric
  const renderChart = () => {
    const width = 680;
    const height = 220;
    const padding = { top: 25, right: 30, bottom: 35, left: 50 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    let minY = 40;
    let maxY = 140;
    let baselineMin = baseline.heartRateMin;
    let baselineMax = baseline.heartRateMax;
    let unit = 'BPM';
    let dataKey: (d: VitalTrendPoint) => number = d => d.heartRate;
    let strokeColor = '#dc2626'; // red
    let fillColor = 'rgba(239, 68, 68, 0.1)';
    let isCurrentOutside = false;

    if (selectedMetric === 'heartRate') {
      minY = 50;
      maxY = 130;
      baselineMin = baseline.heartRateMin;
      baselineMax = baseline.heartRateMax;
      unit = 'BPM';
      dataKey = d => d.heartRate;
      strokeColor = current.heartRate > baselineMax ? '#e11d48' : '#2563eb';
      fillColor = current.heartRate > baselineMax ? 'rgba(225, 29, 72, 0.15)' : 'rgba(37, 99, 235, 0.1)';
      isCurrentOutside = current.heartRate > baselineMax || current.heartRate < baselineMin;
    } else if (selectedMetric === 'spo2') {
      minY = 86;
      maxY = 100;
      baselineMin = baseline.spo2Min;
      baselineMax = baseline.spo2Max;
      unit = '%';
      dataKey = d => d.spo2;
      strokeColor = current.spo2 < baselineMin ? '#e11d48' : '#0284c7';
      fillColor = current.spo2 < baselineMin ? 'rgba(225, 29, 72, 0.15)' : 'rgba(2, 132, 199, 0.1)';
      isCurrentOutside = current.spo2 < baselineMin;
    } else if (selectedMetric === 'activity') {
      minY = 0;
      maxY = 100;
      baselineMin = 25;
      baselineMax = 65;
      unit = '% index';
      dataKey = d => d.activityLevel;
      strokeColor = current.activityLevel === 'Very Low' || current.activityLevel === 'None' ? '#e11d48' : '#10b981';
      fillColor = 'rgba(16, 185, 129, 0.1)';
      isCurrentOutside = current.activityLevel === 'Very Low' || current.activityLevel === 'None';
    } else if (selectedMetric === 'bloodPressure') {
      minY = 90;
      maxY = 180;
      baselineMin = baseline.bloodPressureSysMin;
      baselineMax = baseline.bloodPressureSysMax;
      unit = 'mmHg';
      dataKey = d => d.bpSystolic;
      strokeColor = current.bloodPressureSys > baselineMax ? '#e11d48' : '#6366f1';
      fillColor = 'rgba(99, 102, 241, 0.1)';
      isCurrentOutside = current.bloodPressureSys > baselineMax;
    }

    const scaleX = (index: number) => padding.left + (index / (trendData.length - 1)) * innerWidth;
    const scaleY = (val: number) => padding.top + innerHeight - ((val - minY) / (maxY - minY)) * innerHeight;

    const baselineTopY = Math.max(padding.top, scaleY(baselineMax));
    const baselineBottomY = Math.min(padding.top + innerHeight, scaleY(baselineMin));
    const baselineHeight = Math.max(0, baselineBottomY - baselineTopY);

    // Build path line
    const points = trendData.map((d, i) => `${scaleX(i)},${scaleY(dataKey(d))}`).join(' ');
    const lastPoint = trendData[trendData.length - 1];
    const lastX = scaleX(trendData.length - 1);
    const lastY = scaleY(dataKey(lastPoint));

    // Y ticks
    const yTicks = 4;
    const yStep = (maxY - minY) / yTicks;
    const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round(minY + i * yStep));

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[560px]">
          {/* Grid lines */}
          {tickValues.map(tv => {
            const y = scaleY(tv);
            return (
              <g key={tv}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {tv}
                </text>
              </g>
            );
          })}

          {/* Shaded Personal Baseline Corridor */}
          <rect
            x={padding.left}
            y={baselineTopY}
            width={innerWidth}
            height={baselineHeight}
            fill="#10b981"
            fillOpacity="0.12"
            stroke="#10b981"
            strokeDasharray="4 2"
            strokeWidth="0.75"
          />

          <text
            x={padding.left + 8}
            y={baselineTopY + 13}
            className="text-[10px] font-bold fill-emerald-700"
          >
            Personal Baseline Corridor ({baselineMin} – {baselineMax} {unit})
          </text>

          {/* Trend line */}
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Trend points */}
          {trendData.map((d, i) => {
            const x = scaleX(i);
            const y = scaleY(dataKey(d));
            const isLast = i === trendData.length - 1;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isLast ? 5.5 : 3}
                  fill={isLast ? strokeColor : '#ffffff'}
                  stroke={strokeColor}
                  strokeWidth={isLast ? 2.5 : 1.5}
                />
                {isLast && (
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}

          {/* X axis labels */}
          {trendData.map((d, i) => {
            if (i % 2 !== 0 && i !== trendData.length - 1) return null;
            const x = scaleX(i);
            return (
              <text
                key={i}
                x={x}
                y={padding.top + innerHeight + 18}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 font-mono"
              >
                {d.time}
              </text>
            );
          })}

          {/* Current Reading Callout */}
          <g transform={`translate(${lastX - 45}, ${Math.max(padding.top + 5, lastY - 26)})`}>
            <rect
              width="90"
              height="20"
              rx="4"
              fill={isCurrentOutside ? '#991b1b' : '#1e293b'}
              className="shadow-sm"
            />
            <text
              x="45"
              y="14"
              textAnchor="middle"
              fill="#ffffff"
              className="text-[10px] font-bold font-mono"
            >
              Current: {dataKey(lastPoint)} {unit}
            </text>
          </g>
        </svg>

        {/* Legend / Clinical interpretation note */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 px-1 text-slate-500 border-t border-slate-100 mt-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-100 border border-emerald-500/60 inline-block"></span>
              <span className="text-[11px] text-slate-700 font-medium">Personal Baseline Normal Corridor</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-0.5 bg-rose-600 inline-block"></span>
              <span className="text-[11px] text-slate-700 font-medium">Measured Sensor Stream (Last 6–12h)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 italic">
            {isCurrentOutside ? (
              <span className="text-rose-700 font-semibold not-italic">
                ⚠️ Current telemetry falls outside patient's personal baseline corridor
              </span>
            ) : (
              <span className="text-emerald-700 font-medium not-italic">
                ✓ Current reading aligned within personal normal baseline
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <span>6–12 Hour Physiological Trend Analysis</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Individualized Baselines
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compares live telemetry against {patient.name}'s verified individual historical baseline, rather than generic population averages.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedMetric('heartRate')}
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              selectedMetric === 'heartRate'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Heart Rate ({patient.vitals.heartRate} BPM)
          </button>
          <button
            onClick={() => setSelectedMetric('spo2')}
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              selectedMetric === 'spo2'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SpO₂ ({patient.vitals.spo2}%)
          </button>
          <button
            onClick={() => setSelectedMetric('bloodPressure')}
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              selectedMetric === 'bloodPressure'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blood Pressure ({patient.vitals.bloodPressureSys} mmHg)
          </button>
          <button
            onClick={() => setSelectedMetric('activity')}
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              selectedMetric === 'activity'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Activity ({patient.vitals.activityLevel})
          </button>
        </div>
      </div>

      {renderChart()}
    </div>
  );
};
