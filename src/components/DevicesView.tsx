import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import {
  Watch,
  Battery,
  Wifi,
  Radio,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const DevicesView: React.FC = () => {
  const { patients, totalDevicesConnected } = useMonitoring();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span>Connected Wearable Devices & Ingestion Fleet</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              {totalDevicesConnected} Connected
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Smartwatch telemetry links, battery levels, sync cadences, and device capability matrices
          </p>
        </div>
      </div>

      {/* Device Architecture Note (Section 18 & 19) */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-blue-400 font-bold">
          <Info className="w-4 h-4" />
          <span>Device Architecture & Clinical Honesty Guarantee</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          ElderWatch connects to commercially available smartwatches (Samsung Galaxy Watch, Apple Watch, Fitbit, Garmin).
          We do <strong className="text-white">not</strong> pretend every commercial smartwatch natively measures every clinical metric. Where optical sensors cannot natively capture medical cuffs (e.g. continuous arterial blood pressure), data is ingested from paired external Bluetooth medical cuffs or labeled as <span className="text-amber-400 font-medium">"Not available on this device"</span>.
        </p>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {patients.map(patient => {
          const device = patient.device;
          const isConnected = device.status === 'connected';

          return (
            <div
              key={device.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Watch className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <span>{device.model}</span>
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span>Assigned: <strong className="text-slate-700">{patient.name}</strong> ({patient.age}y)</span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-400">{device.id}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${
                    isConnected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`}></span>
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </span>
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-3 gap-2 py-1 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Battery</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Battery className={`w-4 h-4 ${device.batteryLevel < 40 ? 'text-amber-500' : 'text-emerald-600'}`} />
                    <span className="font-bold font-mono text-slate-800 text-sm">{device.batteryLevel}%</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Last Sync</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-mono text-slate-800 font-semibold text-xs">
                      {device.lastSyncSecondsAgo}s ago
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Signal Quality</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Radio className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-800 font-semibold text-xs">{device.signalQuality}</span>
                  </div>
                </div>
              </div>

              {/* Capabilities & Data Availability Matrix (Section 18) */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Wearable Telemetry Channels:
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-medium">Heart Rate</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-medium">SpO₂ Oxygen</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-medium">Kinetic Activity</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-medium">Wrist Movement</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-medium">Sleep Tracking</span>
                  </div>

                  {/* Fall Detection */}
                  <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-medium">Fall Detection</span>
                  </div>

                  {/* ECG */}
                  {device.capabilities.ecg ? (
                    <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] font-medium">ECG Rhythm</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-slate-400 bg-slate-50 p-1.5 rounded border border-slate-200">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px]">ECG: Not available</span>
                    </div>
                  )}

                  {/* Temperature */}
                  {device.capabilities.temperature ? (
                    <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200/60">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] font-medium">Skin Temp</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-slate-400 bg-slate-50 p-1.5 rounded border border-slate-200">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px]">Temp: Not available</span>
                    </div>
                  )}

                  {/* Blood Pressure explicitly honest */}
                  <div className="flex items-center space-x-1.5 text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-200">
                    <XCircle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="text-[11px]">Direct BP: External Cuff</span>
                  </div>
                </div>
              </div>

              {/* Firmware & Ingestion Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Firmware: {device.firmwareVersion}</span>
                <span className="text-emerald-700">Encrypted AES-256 Telemetry</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
