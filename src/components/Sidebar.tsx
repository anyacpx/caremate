import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { NavigationTab } from '../types';
import {
  LayoutDashboard,
  Users,
  BellRing,
  UserRoundCheck,
  Watch,
  LineChart,
  Settings,
  HeartHandshake,
  ShieldCheck,
  Wifi,
  Radio,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, totalCritical, totalDevicesConnected } = useMonitoring();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'command-center',
      label: 'Command Center',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'patient-detail',
      label: 'Patient Detail',
      icon: <UserRoundCheck className="w-4 h-4" />,
    },
    {
      id: 'alert-center',
      label: 'Alert Center',
      icon: <BellRing className="w-4 h-4" />,
      badge: totalCritical,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'devices',
      label: 'Wearable Fleet',
      icon: <Watch className="w-4 h-4" />,
    },
    {
      id: 'caregiver',
      label: 'Caregiver View',
      icon: <HeartHandshake className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Hospital Analytics',
      icon: <LineChart className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Demo Controls',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 select-none hidden md:flex">
      <div className="py-4">
        {/* Navigation links */}
        <div className="px-3 mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
            Clinical Navigation
          </p>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id || (item.id === 'alert-center' && activeTab === 'alerts');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || 'bg-blue-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer telemetry status & core positioning note */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-medium">Ingestion Active</span>
          </div>
          <span className="text-slate-400 font-mono">{totalDevicesConnected} devices online</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
            <span className="text-blue-400 font-semibold">Core Principle:</span> Watching over vulnerable seniors so caregivers and clinicians can intervene early.
          </p>
        </div>
      </div>
    </aside>
  );
};
