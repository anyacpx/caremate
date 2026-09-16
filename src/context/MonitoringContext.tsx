import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Patient,
  Alert,
  PatientStatus,
  RiskCategory,
  NavigationTab,
  Vitals,
  TimelineEvent,
  EarlyWarningSignal
} from '../types';
import { INITIAL_PATIENTS, INITIAL_ALERTS } from '../data/mockPatients';
import {
  playEarlyWarningChime,
  playEmergencyAlarm,
  playCaregiverChime,
} from '../utils/audioAlert';

export interface EmergencyScenarioState {
  isActive: boolean;
  stage: number; // 0: Stable, 1: Attention, 2: Warning, 3: High Risk, 4: Critical/No Response, 5: Escalated, 6: Resolved
  stageLabel: string;
  patientId: string;
  autoCheckInActive: boolean;
  checkInCountdown: number;
  showEscalationModal: boolean;
  speedMultiplier: number; // 1x, 2x, 4x
}

export interface CaregiverToastData {
  patientName: string;
  caregiverName: string;
  caregiverPhone: string;
  relation: string;
  timestamp: string;
}

interface MonitoringContextType {
  patients: Patient[];
  alerts: Alert[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  presentationMode: boolean;
  isPresentationMode: boolean;
  setPresentationMode: (active: boolean) => void;
  caregiverViewOpen: boolean;
  setCaregiverViewOpen: (open: boolean) => void;
  emergencyScenario: EmergencyScenarioState;
  caregiverNotifiedIds: string[];
  caregiverToast: CaregiverToastData | null;
  dismissCaregiverToast: () => void;
  
  // Modular API methods matching spec
  getPatients: () => Patient[];
  getPatient: (id: string) => Patient | undefined;
  getPatientVitals: (id: string) => Vitals | undefined;
  getAlerts: () => Alert[];
  calculatePrototypeRisk: (patient: Patient) => { score: number; category: RiskCategory; status: PatientStatus };
  
  // Interactive Simulation Controls
  startEmergencyScenario: (patientId?: string) => void;
  stopEmergencyScenario: () => void;
  pauseEmergencyScenario: () => void;
  resumeEmergencyScenario: () => void;
  fastForwardToCritical: () => void;
  setEmergencySpeed: (speed: number) => void;
  respondToCheckIn: (response: 'ok' | 'needs_help' | 'no_response') => void;
  dismissEscalationModal: () => void;
  
  // Alert Actions
  acknowledgeAlert: (alertId: string, responderName?: string) => void;
  resolveAlert: (alertId: string) => void;
  triggerAlert: (alert: Partial<Alert>) => void;
  
  // Caregiver actions
  notifyCaregiverAction: (patientId: string) => void;
  escalateToHospitalAction: (patientId: string) => void;
  caregiverAcknowledge: (patientId: string) => void;
  sendCaregiverSms: (patientId: string, message: string) => void;

  // Stats
  totalMonitored: number;
  totalStable: number;
  totalAttention: number;
  totalCritical: number;
  totalDevicesConnected: number;
}

const MonitoringContext = createContext<MonitoringContextType | null>(null);

export const calculatePrototypeRisk = (patient: Patient): { score: number; category: RiskCategory; status: PatientStatus } => {
  let score = 5;
  const vitals = patient.vitals;
  const baseline = patient.baseline;
  let abnormalSignalCount = 0;

  // 1. Heart Rate deviation
  if (vitals.heartRate > baseline.heartRateMax) {
    const diff = vitals.heartRate - baseline.heartRateMax;
    score += Math.min(30, diff * 1.2);
    abnormalSignalCount++;
  } else if (vitals.heartRate < baseline.heartRateMin) {
    const diff = baseline.heartRateMin - vitals.heartRate;
    score += Math.min(20, diff * 0.9);
    abnormalSignalCount++;
  }

  // 2. SpO2 deviation (heavily weighted in geriatric early warning)
  if (vitals.spo2 < baseline.spo2Min) {
    const diff = baseline.spo2Min - vitals.spo2;
    score += Math.min(35, diff * 5.5);
    abnormalSignalCount++;
  }

  // 3. Blood pressure variance
  if (vitals.bloodPressureSys > baseline.bloodPressureSysMax) {
    const diff = vitals.bloodPressureSys - baseline.bloodPressureSysMax;
    score += Math.min(15, diff * 0.4);
    abnormalSignalCount++;
  }

  // 4. Inactivity & Activity reduction
  if (vitals.activityLevel === 'Very Low' || vitals.activityLevel === 'None') {
    score += 12;
    abnormalSignalCount++;
  }
  if (vitals.lastMovementMinutesAgo > 30) {
    score += Math.min(15, (vitals.lastMovementMinutesAgo - 30) * 0.3);
  }

  // 5. Multi-signal compounding factor (Multiple simultaneous abnormalities)
  if (abnormalSignalCount >= 3) {
    score += 18; // Compound risk multiplier
  } else if (abnormalSignalCount === 2) {
    score += 8;
  }

  // 6. Check-in status
  if (patient.checkInStatus === 'no_response') {
    score += 25;
  } else if (patient.checkInStatus === 'needs_help') {
    score += 30;
  }

  // 7. Device disconnect penalty
  if (patient.device.status !== 'connected') {
    score += 10;
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  let category: RiskCategory = 'low';
  let status: PatientStatus = 'stable';

  if (score >= 85) {
    category = 'critical';
    status = 'critical';
  } else if (score >= 70) {
    category = 'high';
    status = 'warning';
  } else if (score >= 50) {
    category = 'elevated';
    status = 'warning';
  } else if (score >= 30) {
    category = 'moderate';
    status = 'attention';
  } else {
    category = 'low';
    status = 'stable';
  }

  return { score, category, status };
};

export const MonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [activeTab, setActiveTab] = useState<NavigationTab>('command-center');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-01');
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [caregiverViewOpen, setCaregiverViewOpen] = useState<boolean>(false);
  const [caregiverNotifiedIds, setCaregiverNotifiedIds] = useState<string[]>([]);
  const [caregiverToast, setCaregiverToast] = useState<CaregiverToastData | null>(null);

  // Emergency Scenario state
  const [emergencyScenario, setEmergencyScenario] = useState<EmergencyScenarioState>({
    isActive: false,
    stage: 0,
    stageLabel: 'Normal Baseline',
    patientId: 'p-01',
    autoCheckInActive: false,
    checkInCountdown: 5,
    showEscalationModal: false,
    speedMultiplier: 1,
  });

  const scenarioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkInTimerRef = useRef<NodeJS.Timeout | null>(null);

  const dismissCaregiverToast = useCallback(() => {
    setCaregiverToast(null);
  }, []);

  // Background subtle telemetry drift (Section 26: realistic gradual drift)
  useEffect(() => {
    const driftInterval = setInterval(() => {
      setPatients(prev =>
        prev.map(patient => {
          // If currently in emergency scenario and this is the active patient, let the scenario control it
          if (emergencyScenario.isActive && patient.id === emergencyScenario.patientId) {
            return patient;
          }

          // Gentle random drift within +/- 1-2 units
          const hrDelta = (Math.random() - 0.5) * 2;
          const spo2Delta = Math.random() > 0.8 ? (Math.random() - 0.5) * 0.8 : 0;
          const newHR = Math.round(Math.max(55, Math.min(140, patient.vitals.heartRate + hrDelta)));
          const newSpO2 = Math.round(Math.max(88, Math.min(100, patient.vitals.spo2 + spo2Delta)));
          const lastSync = (patient.device.lastSyncSecondsAgo + 2) % 45;

          const updatedVitals = {
            ...patient.vitals,
            heartRate: newHR,
            spo2: newSpO2,
          };

          const newRisk = calculatePrototypeRisk({
            ...patient,
            vitals: updatedVitals,
          });

          return {
            ...patient,
            vitals: updatedVitals,
            riskScore: newRisk.score,
            riskCategory: newRisk.category,
            status: newRisk.status,
            device: {
              ...patient.device,
              lastSyncSecondsAgo: lastSync,
            },
          };
        })
      );
    }, 3000);

    return () => clearInterval(driftInterval);
  }, [emergencyScenario.isActive, emergencyScenario.patientId]);

  // Methods matching spec
  const getPatients = useCallback(() => patients, [patients]);
  const getPatient = useCallback((id: string) => patients.find(p => p.id === id), [patients]);
  const getPatientVitals = useCallback((id: string) => patients.find(p => p.id === id)?.vitals, [patients]);
  const getAlerts = useCallback(() => alerts, [alerts]);

  // Check-In countdown handling
  useEffect(() => {
    if (emergencyScenario.autoCheckInActive && emergencyScenario.checkInCountdown > 0) {
      checkInTimerRef.current = setTimeout(() => {
        setEmergencyScenario(prev => ({
          ...prev,
          checkInCountdown: prev.checkInCountdown - 1,
        }));
      }, 1000 / emergencyScenario.speedMultiplier);
    } else if (emergencyScenario.autoCheckInActive && emergencyScenario.checkInCountdown === 0) {
      // Auto-trigger NO RESPONSE as mandated by Section 13
      respondToCheckIn('no_response');
    }

    return () => {
      if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);
    };
  }, [emergencyScenario.autoCheckInActive, emergencyScenario.checkInCountdown, emergencyScenario.speedMultiplier]);

  // Respond to check-in
  const respondToCheckIn = useCallback((response: 'ok' | 'needs_help' | 'no_response') => {
    if (response !== 'ok') {
      playEmergencyAlarm();
    }

    setEmergencyScenario(prev => ({
      ...prev,
      autoCheckInActive: false,
      showEscalationModal: response !== 'ok',
      stage: response === 'ok' ? 6 : 5,
      stageLabel: response === 'ok' ? 'Event Checked - Patient Confirmed OK' : 'Patient Did Not Respond — Escalation Required',
    }));

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPatients(prev =>
      prev.map(p => {
        if (p.id !== emergencyScenario.patientId) return p;

        const updatedTimeline: TimelineEvent[] = [
          ...p.timeline,
          {
            id: `t-${Date.now()}`,
            time: timeStr,
            title:
              response === 'no_response'
                ? 'Check-In Timeout: Patient did not respond'
                : response === 'needs_help'
                ? 'Patient pressed "I Need Help" on wearable'
                : 'Patient confirmed "I\'m OK" on wearable',
            detail:
              response === 'no_response'
                ? 'Automated prompt timed out after 60s haptic vibration'
                : 'Haptic interaction registered',
            status: response === 'ok' ? 'resolved' : 'critical',
          },
        ];

        return {
          ...p,
          checkInStatus: response,
          riskScore: response === 'ok' ? 24 : 96,
          status: response === 'ok' ? 'stable' : 'critical',
          riskCategory: response === 'ok' ? 'low' : 'critical',
          timeline: updatedTimeline,
        };
      })
    );

    if (response !== 'ok') {
      // Add or update critical alert
      setAlerts(prev => {
        const existing = prev.find(a => a.patientId === emergencyScenario.patientId && a.severity === 'critical');
        if (existing) {
          return prev.map(a =>
            a.id === existing.id
              ? {
                  ...a,
                  interventionStatus: 'hospital_notified',
                  metricsSummary: 'SpO₂: 90% | HR: 110 BPM | No response to check-in | Escalation dispatched',
                }
              : a
          );
        }
        return [
          {
            id: `alt-${Date.now()}`,
            patientId: emergencyScenario.patientId,
            patientName: 'Kim, Sun-hee',
            patientAge: 82,
            severity: 'critical',
            title: 'Critical Emergency: Potential deterioration & check-in timeout',
            summary: 'Wearable check-in received no response following acute SpO₂ desaturation and tachycardia.',
            contributingSignals: [
              'SpO₂ dropped to 90%',
              'Heart rate peaked at 110 BPM',
              'Cessation of physical movement',
              'Patient did not respond to check-in prompt',
            ],
            metricsSummary: 'SpO₂: 90% | HR: 110 BPM | No movement: 8 min',
            timestamp: timeStr,
            timeAgo: 'Just now',
            acknowledged: false,
            interventionStatus: 'hospital_notified',
            interventionSteps: [
              { time: timeStr, text: 'Wearable haptic chime sent to patient', completed: true },
              { time: timeStr, text: 'No response received (60s timeout)', completed: true },
              { time: timeStr, text: 'Caregiver notification dispatched', completed: true },
              { time: timeStr, text: 'Hospital central command center notified', completed: true },
            ],
          },
          ...prev,
        ];
      });
    }
  }, [emergencyScenario.patientId]);

  // Start Emergency Scenario (Section 12)
  const startEmergencyScenario = useCallback((targetPatientId: string = 'p-01') => {
    setSelectedPatientId(targetPatientId);
    if (scenarioIntervalRef.current) clearInterval(scenarioIntervalRef.current);
    if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);

    // Initial Stage 0: Stable
    setEmergencyScenario({
      isActive: true,
      stage: 0,
      stageLabel: 'Stage 0: Normal Baseline (Stable) — Initiating telemetry stream',
      patientId: targetPatientId,
      autoCheckInActive: false,
      checkInCountdown: 5,
      showEscalationModal: false,
      speedMultiplier: emergencyScenario.speedMultiplier || 1,
    });

    // Reset Kim Sun-hee to start state
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== targetPatientId) return p;
        return {
          ...p,
          status: 'stable',
          riskScore: 8,
          riskCategory: 'low',
          vitals: {
            ...p.vitals,
            heartRate: 76,
            spo2: 98,
            bloodPressureSys: 124,
            bloodPressureDia: 78,
            respiratoryRate: 16,
            activityLevel: 'Normal',
            lastMovementMinutesAgo: 1,
          },
          earlyWarningSignals: [],
          checkInStatus: 'none',
          isEmergencySimulated: true,
        };
      })
    );

    let currentStage = 0;
    const speed = emergencyScenario.speedMultiplier || 1;
    // Advance to Stage 1 quickly (1.2s) so user immediately feels the emergency simulation activate!
    const firstStageDelayMs = 1200 / speed;
    const subsequentStageIntervalMs = 3800 / speed;

    const advanceToStage = (stageNum: number) => {
      if (stageNum === 1) {
        playEarlyWarningChime();
        setEmergencyScenario(prev => ({
          ...prev,
          stage: 1,
          stageLabel: 'Stage 1: HR begins climbing (91 BPM) — Attention',
        }));

        setPatients(prev =>
          prev.map(p => {
            if (p.id !== targetPatientId) return p;
            const newSignals: EarlyWarningSignal[] = [
              {
                id: `sig-${Date.now()}-1`,
                type: 'heart_rate',
                severity: 'attention',
                description: 'Heart rate began increasing beyond resting baseline ceiling (+9 BPM)',
                baselineComparison: 'Current 91 BPM vs Baseline 65–82 BPM',
                timestamp: 'Just now',
              },
            ];
            return {
              ...p,
              status: 'attention',
              riskScore: 38,
              riskCategory: 'moderate',
              vitals: {
                ...p.vitals,
                heartRate: 91,
                spo2: 96,
                respiratoryRate: 18,
                activityLevel: 'Normal',
                lastMovementMinutesAgo: 2,
              },
              earlyWarningSignals: newSignals,
            };
          })
        );
      } else if (stageNum === 2) {
        playEarlyWarningChime();
        setEmergencyScenario(prev => ({
          ...prev,
          stage: 2,
          stageLabel: 'Stage 2: SpO2 dropping (93%), HR 103 BPM — Warning',
        }));

        setPatients(prev =>
          prev.map(p => {
            if (p.id !== targetPatientId) return p;
            const newSignals: EarlyWarningSignal[] = [
              ...p.earlyWarningSignals,
              {
                id: `sig-${Date.now()}-2`,
                type: 'spo2',
                severity: 'warning',
                description: 'SpO₂ decreased below normal baseline floor (-3% desaturation)',
                baselineComparison: 'Current 93% vs Baseline 96–99%',
                timestamp: 'Just now',
              },
              {
                id: `sig-${Date.now()}-3`,
                type: 'activity',
                severity: 'attention',
                description: 'Physical activity slowing down noticeably',
                baselineComparison: 'Pacing cadence ceased',
                timestamp: 'Just now',
              },
            ];
            return {
              ...p,
              status: 'warning',
              riskScore: 64,
              riskCategory: 'elevated',
              vitals: {
                ...p.vitals,
                heartRate: 103,
                spo2: 93,
                bloodPressureSys: 146,
                bloodPressureDia: 90,
                respiratoryRate: 21,
                activityLevel: 'Declining',
                lastMovementMinutesAgo: 5,
              },
              earlyWarningSignals: newSignals,
            };
          })
        );
      } else if (stageNum === 3) {
        playEmergencyAlarm();
        setEmergencyScenario(prev => ({
          ...prev,
          stage: 3,
          stageLabel: 'Stage 3: Severe hypoxemia (90%) & resting tachycardia (110 BPM) — High Risk',
        }));

        setPatients(prev =>
          prev.map(p => {
            if (p.id !== targetPatientId) return p;
            const newSignals: EarlyWarningSignal[] = [
              ...p.earlyWarningSignals,
              {
                id: `sig-${Date.now()}-4`,
                type: 'multi_signal',
                severity: 'critical',
                description: 'Multi-signal compound deterioration: severe desaturation + tachycardia + kinetic cessation',
                baselineComparison: 'Current 90% SpO₂ / 110 BPM vs Baseline 96-99% / 65-82 BPM',
                timestamp: 'Just now',
              },
            ];
            return {
              ...p,
              status: 'critical',
              riskScore: 86,
              riskCategory: 'critical',
              vitals: {
                ...p.vitals,
                heartRate: 110,
                spo2: 90,
                bloodPressureSys: 158,
                bloodPressureDia: 94,
                respiratoryRate: 24,
                activityLevel: 'Very Low',
                lastMovementMinutesAgo: 8,
              },
              earlyWarningSignals: newSignals,
            };
          })
        );
      } else if (stageNum === 4) {
        if (scenarioIntervalRef.current) clearInterval(scenarioIntervalRef.current);
        playEmergencyAlarm();
        setEmergencyScenario(prev => ({
          ...prev,
          stage: 4,
          stageLabel: 'Stage 4: Zero movement detected — Initiating Wearable Check-In',
          autoCheckInActive: true,
          checkInCountdown: 5,
        }));

        setPatients(prev =>
          prev.map(p => {
            if (p.id !== targetPatientId) return p;
            return {
              ...p,
              status: 'critical',
              riskScore: 92,
              riskCategory: 'critical',
              checkInStatus: 'prompted',
              vitals: {
                ...p.vitals,
                activityLevel: 'None',
              },
            };
          })
        );
      }
    };

    // First transition after initial delay
    const initialTimer = setTimeout(() => {
      currentStage = 1;
      advanceToStage(1);

      scenarioIntervalRef.current = setInterval(() => {
        currentStage++;
        advanceToStage(currentStage);
      }, subsequentStageIntervalMs);
    }, firstStageDelayMs);

    scenarioIntervalRef.current = initialTimer as unknown as NodeJS.Timeout;
  }, [emergencyScenario.speedMultiplier]);

  // Fast forward straight to critical stage 4
  const fastForwardToCritical = useCallback((targetPatientId: string = 'p-01') => {
    setSelectedPatientId(targetPatientId);
    if (scenarioIntervalRef.current) clearInterval(scenarioIntervalRef.current);
    if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);

    playEmergencyAlarm();

    setEmergencyScenario(prev => ({
      ...prev,
      isActive: true,
      stage: 4,
      stageLabel: 'Stage 4: Zero movement detected — Initiating Wearable Check-In',
      patientId: targetPatientId,
      autoCheckInActive: true,
      checkInCountdown: 5,
      showEscalationModal: false,
    }));

    setPatients(prev =>
      prev.map(p => {
        if (p.id !== targetPatientId) return p;
        const newSignals: EarlyWarningSignal[] = [
          {
            id: `sig-${Date.now()}-fast`,
            type: 'multi_signal',
            severity: 'critical',
            description: 'Critical acute decompensation: SpO₂ 90%, HR 110 BPM, kinetic cessation',
            baselineComparison: 'Current 90% SpO₂ / 110 BPM vs Baseline 96-99% / 65-82 BPM',
            timestamp: 'Just now',
          },
        ];
        return {
          ...p,
          status: 'critical',
          riskScore: 94,
          riskCategory: 'critical',
          checkInStatus: 'prompted',
          vitals: {
            ...p.vitals,
            heartRate: 110,
            spo2: 90,
            bloodPressureSys: 160,
            bloodPressureDia: 96,
            respiratoryRate: 25,
            activityLevel: 'None',
            lastMovementMinutesAgo: 10,
          },
          earlyWarningSignals: newSignals,
        };
      })
    );
  }, []);

  const stopEmergencyScenario = useCallback(() => {
    if (scenarioIntervalRef.current) clearInterval(scenarioIntervalRef.current);
    if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);

    setEmergencyScenario(prev => ({
      ...prev,
      isActive: false,
      autoCheckInActive: false,
      showEscalationModal: false,
      stage: 0,
      stageLabel: 'Simulation Reset',
    }));
  }, []);

  const pauseEmergencyScenario = useCallback(() => {
    if (scenarioIntervalRef.current) clearInterval(scenarioIntervalRef.current);
    if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);
    setEmergencyScenario(prev => ({
      ...prev,
      stageLabel: `${prev.stageLabel} (Paused)`,
    }));
  }, []);

  const resumeEmergencyScenario = useCallback(() => {
    // restart scenario loop from current stage
    startEmergencyScenario(emergencyScenario.patientId);
  }, [emergencyScenario.patientId, startEmergencyScenario]);

  const setEmergencySpeed = useCallback((speed: number) => {
    setEmergencyScenario(prev => ({ ...prev, speedMultiplier: speed }));
  }, []);

  const dismissEscalationModal = useCallback(() => {
    setEmergencyScenario(prev => ({ ...prev, showEscalationModal: false }));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string, responderName: string = 'Dr. Central Command') => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: responderName,
              interventionSteps: [
                ...a.interventionSteps,
                { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `Alert acknowledged by ${responderName}`, completed: true },
              ],
            }
          : a
      )
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              severity: 'resolved',
              interventionStatus: 'resolved',
              interventionSteps: [
                ...a.interventionSteps,
                { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Patient condition stabilized & event marked resolved', completed: true },
              ],
            }
          : a
      )
    );
  }, []);

  const triggerAlert = useCallback((newAlert: Partial<Alert>) => {
    const alert: Alert = {
      id: `alt-${Date.now()}`,
      patientId: newAlert.patientId || 'p-01',
      patientName: newAlert.patientName || 'Patient',
      patientAge: newAlert.patientAge || 80,
      severity: newAlert.severity || 'high',
      title: newAlert.title || 'Abnormal Physiological Change Flagged',
      summary: newAlert.summary || 'Deviation from personal baseline detected.',
      contributingSignals: newAlert.contributingSignals || ['Heart rate deviation'],
      metricsSummary: newAlert.metricsSummary || 'Telemetry alert',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      acknowledged: false,
      interventionStatus: 'none',
      interventionSteps: [],
    };
    setAlerts(prev => [alert, ...prev]);
  }, []);

  // Caregiver actions
  const notifyCaregiverAction = useCallback((patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const caregiverName = patient?.contactPerson?.name || 'Primary Caregiver';
    const caregiverPhone = patient?.contactPerson?.phone || '+82 10-4821-9923';
    const relation = patient?.contactPerson?.relation || 'Family Contact';

    // 1. Play audio confirmation
    playCaregiverChime();

    // 2. Mark as notified in caregiverNotifiedIds
    setCaregiverNotifiedIds(prev => Array.from(new Set([...prev, patientId])));

    // 3. Set floating toast notification
    setCaregiverToast({
      patientName: patient?.name || 'Patient',
      caregiverName,
      caregiverPhone,
      relation,
      timestamp: now,
    });

    // 4. Update patient's timeline
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        const event: TimelineEvent = {
          id: `t-${Date.now()}-cg`,
          time: now,
          title: `Caregiver Alert Sent: ${caregiverName}`,
          detail: `Direct urgent dispatch to ${caregiverPhone} (${relation}) with telemetry & GPS.`,
          status: 'attention',
        };
        return {
          ...p,
          timeline: [...p.timeline, event],
        };
      })
    );

    // 5. Update or create alert
    setAlerts(prev => {
      const match = prev.find(a => a.patientId === patientId);
      if (match) {
        return prev.map(a =>
          a.patientId === patientId
            ? {
                ...a,
                interventionStatus: 'caregiver_notified',
                interventionSteps: [
                  ...a.interventionSteps,
                  { time: now, text: `Caregiver (${caregiverName}) contacted via urgent push & SMS`, completed: true },
                ],
              }
            : a
        );
      } else {
        // Create an alert record
        const newAlert: Alert = {
          id: `alt-${Date.now()}-cg`,
          patientId,
          patientName: patient?.name || 'Patient',
          patientAge: patient?.age || 80,
          severity: patient?.status === 'critical' ? 'critical' : 'high',
          title: `Caregiver Notification Dispatched: ${patient?.name}`,
          summary: `Primary contact ${caregiverName} was alerted via mobile priority channel.`,
          contributingSignals: ['Clinician manual dispatch', 'Active monitoring corridor'],
          metricsSummary: `HR: ${patient?.vitals.heartRate} BPM | SpO₂: ${patient?.vitals.spo2}%`,
          timestamp: now,
          timeAgo: 'Just now',
          acknowledged: false,
          interventionStatus: 'caregiver_notified',
          interventionSteps: [
            { time: now, text: `Caregiver (${caregiverName}) contacted via urgent notification`, completed: true },
          ],
        };
        return [newAlert, ...prev];
      }
    });
  }, [patients]);

  const escalateToHospitalAction = useCallback((patientId: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts(prev =>
      prev.map(a =>
        a.patientId === patientId
          ? {
              ...a,
              interventionStatus: 'hospital_notified',
              interventionSteps: [
                ...a.interventionSteps,
                { time: now, text: 'Emergency dispatch protocol activated with local medical team', completed: true },
              ],
            }
          : a
      )
    );
  }, []);

  const caregiverAcknowledge = useCallback((patientId: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts(prev =>
      prev.map(a => {
        if (a.patientId !== patientId) return a;
        if (a.interventionStatus === 'responding') return a;
        const alreadyHasStep = a.interventionSteps.some(s => s.text.includes('responding and en route'));
        if (alreadyHasStep) return a;
        return {
          ...a,
          interventionStatus: 'responding',
          interventionSteps: [
            ...a.interventionSteps,
            { time: now, text: 'Caregiver acknowledged: "I am responding and en route"', completed: true },
          ],
        };
      })
    );
  }, []);

  const sendCaregiverSms = useCallback((patientId: string, message: string) => {
    const patient = patients.find(p => p.id === patientId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const caregiverName = patient?.contactPerson?.name || 'Caregiver';

    // Append to timeline as a caregiver check-in event
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        const event: TimelineEvent = {
          id: `t-${Date.now()}-sms`,
          time: now,
          title: `SMS Check-In from Caregiver (${caregiverName})`,
          detail: `Text sent: "${message}"`,
          status: 'normal',
        };
        return {
          ...p,
          timeline: [...p.timeline, event],
        };
      })
    );
  }, [patients]);

  // Aggregated Stats
  // To match spec (e.g. 248 patients, 231 stable, 12 attention, 5 critical, 243 devices connected)
  const baseTotal = 248;
  const criticalCount = patients.filter(p => p.status === 'critical').length + 4;
  const attentionCount = patients.filter(p => p.status === 'attention' || p.status === 'warning').length + 8;
  const stableCount = baseTotal - criticalCount - attentionCount;
  const connectedDevices = 243;

  return (
    <MonitoringContext.Provider
      value={{
        patients,
        alerts,
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        presentationMode,
        isPresentationMode: presentationMode,
        setPresentationMode,
        caregiverViewOpen,
        setCaregiverViewOpen,
        emergencyScenario,
        caregiverNotifiedIds,
        caregiverToast,
        dismissCaregiverToast,
        getPatients,
        getPatient,
        getPatientVitals,
        getAlerts,
        calculatePrototypeRisk,
        startEmergencyScenario,
        stopEmergencyScenario,
        pauseEmergencyScenario,
        resumeEmergencyScenario,
        fastForwardToCritical,
        setEmergencySpeed,
        respondToCheckIn,
        dismissEscalationModal,
        acknowledgeAlert,
        resolveAlert,
        triggerAlert,
        notifyCaregiverAction,
        escalateToHospitalAction,
        caregiverAcknowledge,
        sendCaregiverSms,
        totalMonitored: baseTotal,
        totalStable: Math.max(0, stableCount),
        totalAttention: attentionCount,
        totalCritical: criticalCount,
        totalDevicesConnected: connectedDevices,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
};
