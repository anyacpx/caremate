import React from 'react';
import { MonitoringProvider, useMonitoring } from './context/MonitoringContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandCenter } from './components/CommandCenter';
import { PatientDetailView } from './components/PatientDetailView';
import { AlertCenterView } from './components/AlertCenterView';
import { DevicesView } from './components/DevicesView';
import { AnalyticsView } from './components/AnalyticsView';
import { CaregiverView } from './components/CaregiverView';
import { SettingsView } from './components/SettingsView';
import { PresentationMode } from './components/PresentationMode';
import { EmergencyAlertBanner } from './components/EmergencyAlertBanner';
import { EmergencyEscalationModal } from './components/EmergencyEscalationModal';
import { CaregiverModal } from './components/CaregiverModal';
import { CaregiverToast } from './components/CaregiverToast';

const ElderWatchApp: React.FC = () => {
  const { activeTab, isPresentationMode } = useMonitoring();

  if (isPresentationMode) {
    return <PresentationMode />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'command-center':
        return <CommandCenter />;
      case 'patient-detail':
        return <PatientDetailView />;
      case 'alert-center':
        return <AlertCenterView />;
      case 'devices':
        return <DevicesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'caregiver':
        return <CaregiverView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans antialiased">
      {/* Global Clinical Header with Simulation Controls and Disclaimers */}
      <Header />

      {/* Persistent Emergency Scenario HUD Banner when active */}
      <EmergencyAlertBanner />

      {/* Main Layout: Sidebar Navigation + Dynamic Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <EmergencyEscalationModal />
      <CaregiverModal />
      <CaregiverToast />
    </div>
  );
};

export default function App() {
  return (
    <MonitoringProvider>
      <ElderWatchApp />
    </MonitoringProvider>
  );
}
