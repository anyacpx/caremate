import React from 'react';
import { Patient } from '../types';
import { Heart, Droplets, Footprints, Moon, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle } from 'lucide-react';

interface PersonalBaselineCardProps {
  patient: Patient;
}

export const PersonalBaselineCard: React.FC<PersonalBaselineCardProps> = ({ patient }) => {
  const { vitals, baseline } = patient;
  const isDeteriorating = patient.status === 'critical' || patient.status === 'warning';

  const hrDeviation = vitals.heartRate > baseline.heartRateMax ? `+${vitals.heartRate - baseline.heartRateMax} BPM above normal` : 'Within baseline';
  const spo2Deviation = vitals.spo2 < baseline.spo2Min ? `-${baseline.spo2Min - vitals.spo2}% below normal` : 'Within baseline';
  const isHrAbnormal = vitals.heartRate > baseline.heartRateMax || vitals.heartRate < baseline.heartRateMin;
  const isSpo2Abnormal = vitals.spo2 < baseline.spo2Min;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <span>Personal Baseline Profile</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Personalized Model
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical 30-day circadian norms established specifically for {patient.name}
          </p>
        </div>

        {isDeteriorating ? (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Significant deviation from personal baseline</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Congruent with personal baseline</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Heart Rate Baseline */}
        <div className={`p-3.5 rounded-lg border ${isHrAbnormal ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center space-x-1">
              <Heart className={`w-3.5 h-3.5 ${isHrAbnormal ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>Heart Rate</span>
            </span>
            {isHrAbnormal && <ArrowUpRight className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-xs text-slate-500">
            Normal: <span className="font-mono font-semibold text-slate-700">{baseline.heartRateMin}–{baseline.heartRateMax} BPM</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">
            Current: <span className={isHrAbnormal ? 'text-rose-700 font-extrabold' : 'text-slate-800'}>{vitals.heartRate} BPM</span>
          </div>
          <div className={`text-[11px] font-medium mt-1 ${isHrAbnormal ? 'text-rose-600' : 'text-emerald-700'}`}>
            {hrDeviation}
          </div>
        </div>

        {/* SpO2 Baseline */}
        <div className={`p-3.5 rounded-lg border ${isSpo2Abnormal ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center space-x-1">
              <Droplets className={`w-3.5 h-3.5 ${isSpo2Abnormal ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>Blood Oxygen (SpO₂)</span>
            </span>
            {isSpo2Abnormal && <ArrowDownRight className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-xs text-slate-500">
            Normal: <span className="font-mono font-semibold text-slate-700">{baseline.spo2Min}–{baseline.spo2Max}%</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">
            Current: <span className={isSpo2Abnormal ? 'text-rose-700 font-extrabold' : 'text-slate-800'}>{vitals.spo2}%</span>
          </div>
          <div className={`text-[11px] font-medium mt-1 ${isSpo2Abnormal ? 'text-rose-600' : 'text-emerald-700'}`}>
            {spo2Deviation}
          </div>
        </div>

        {/* Daily Activity / Steps */}
        <div className="p-3.5 rounded-lg border bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center space-x-1">
              <Footprints className="w-3.5 h-3.5 text-slate-500" />
              <span>Daily Activity</span>
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Normal: <span className="font-mono font-semibold text-slate-700">{baseline.dailyStepsExpected} steps</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">
            Current: <span className="text-slate-800">{vitals.stepsToday} steps</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">
            Pattern: {vitals.activityLevel} ({patient.vitals.lastMovementMinutesAgo}m motionless)
          </div>
        </div>

        {/* Normal Sleep Cycle */}
        <div className="p-3.5 rounded-lg border bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center space-x-1">
              <Moon className="w-3.5 h-3.5 text-slate-500" />
              <span>Sleep Duration</span>
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Normal: <span className="font-mono font-semibold text-slate-700">{baseline.normalSleepHours}</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">
            Last Night: <span className="text-slate-800">4.2 hours</span>
          </div>
          <div className="text-[11px] font-medium text-amber-600 mt-1">
            Restless night (3 awakenings)
          </div>
        </div>
      </div>

      <div className="mt-3.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
        <span className="font-semibold text-slate-700">ElderWatch Clinical Rationale:</span> Traditional fitness trackers alert on static population thresholds (e.g. 100 BPM for anyone). ElderWatch learns each senior's individual physiological baseline so that an abnormal 92 BPM resting rate in a frail patient is flagged immediately, even if a generic fitness watch would consider it "normal".
      </div>
    </div>
  );
};
