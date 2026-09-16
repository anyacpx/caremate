export type PatientStatus = 'stable' | 'attention' | 'warning' | 'critical';

export type RiskCategory = 'low' | 'moderate' | 'elevated' | 'high' | 'critical';

export interface Vitals {
  heartRate: number;
  spo2: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  respiratoryRate: number;
  temperature: number;
  stepsToday: number;
  activityLevel: 'Normal' | 'Moderate' | 'Declining' | 'Very Low' | 'None';
  lastMovementMinutesAgo: number;
  ecgStatus?: string;
  source: {
    heartRate: 'wearable' | 'external_medical_cuff';
    spo2: 'wearable';
    bloodPressure: 'external_medical_cuff' | 'wearable_pulse_estimate';
    respiratoryRate: 'wearable_derived';
    temperature: 'wearable_skin_sensor';
  };
}

export interface PatientBaseline {
  heartRateMin: number;
  heartRateMax: number;
  spo2Min: number;
  spo2Max: number;
  bloodPressureSysMin: number;
  bloodPressureSysMax: number;
  bloodPressureDiaMin: number;
  bloodPressureDiaMax: number;
  dailyStepsExpected: string;
  normalSleepHours: string;
  normalActivityPattern: string;
}

export interface WearableDevice {
  id: string;
  model: string;
  isSimulated: boolean;
  status: 'connected' | 'reconnecting' | 'disconnected';
  batteryLevel: number;
  lastSyncSecondsAgo: number;
  signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Weak';
  firmwareVersion: string;
  capabilities: {
    heartRate: boolean;
    spo2: boolean;
    activity: boolean;
    sleep: boolean;
    movement: boolean;
    fallDetection: boolean;
    bloodPressure: boolean; // false for standard watch, simulated external cuff
    ecg: boolean;
    temperature: boolean;
  };
}

export interface EarlyWarningSignal {
  id: string;
  type: string;
  severity: 'attention' | 'warning' | 'critical';
  description: string;
  baselineComparison: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  detail?: string;
  status: 'normal' | 'change' | 'attention' | 'warning' | 'high_risk' | 'critical' | 'resolved';
}

export interface InterventionStep {
  time: string;
  text: string;
  completed: boolean;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  severity: 'critical' | 'high' | 'warning' | 'resolved';
  title: string;
  summary: string;
  contributingSignals: string[];
  metricsSummary: string;
  timestamp: string;
  timeAgo: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  interventionStatus: 'none' | 'check_in_sent' | 'no_response' | 'caregiver_notified' | 'hospital_notified' | 'responding' | 'resolved';
  interventionSteps: InterventionStep[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  residence: string;
  livingSituation: 'Lives Alone' | 'Assisted Living' | 'Lives with Spouse';
  contactPerson: {
    name: string;
    relation: string;
    phone: string;
  };
  primaryPhysician: string;
  status: PatientStatus;
  riskScore: number; // 0 - 100 prototype risk score
  riskCategory: RiskCategory;
  vitals: Vitals;
  baseline: PatientBaseline;
  device: WearableDevice;
  earlyWarningSignals: EarlyWarningSignal[];
  timeline: TimelineEvent[];
  lastUpdate: string;
  activeAlertCount: number;
  recentAlertTitle?: string;
  checkInStatus?: 'none' | 'prompted' | 'ok' | 'needs_help' | 'no_response';
  isEmergencySimulated?: boolean;
}

export type NavigationTab = 
  | 'command-center'
  | 'patients'
  | 'alerts'
  | 'alert-center'
  | 'patient-detail'
  | 'devices'
  | 'analytics'
  | 'caregiver'
  | 'settings';
