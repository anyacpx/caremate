import React, { useState, useMemo } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { Patient, PatientStatus } from '../types';
import { getPatientInitials } from '../utils/nameInitials';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  AlertTriangle,
  Heart,
  Activity,
  Droplets,
  ChevronRight,
  Filter,
  ShieldAlert,
  Clock,
  Battery,
} from 'lucide-react';

type SortField = 'risk' | 'name' | 'age' | 'heartRate' | 'spo2' | 'lastUpdate';
type SortDirection = 'asc' | 'desc';

export const PatientMonitoringTable: React.FC = () => {
  const { patients, setSelectedPatientId, setActiveTab, selectedPatientId, emergencyScenario } = useMonitoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('risk');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // default to desc for risk/heartRate, asc for name
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredAndSortedPatients = useMemo(() => {
    return patients
      .filter(patient => {
        const matchesQuery =
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.residence.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'critical' && patient.status === 'critical') ||
          (statusFilter === 'warning' && (patient.status === 'warning' || patient.status === 'attention')) ||
          (statusFilter === 'stable' && patient.status === 'stable');
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        switch (sortField) {
          case 'risk':
            comp = a.riskScore - b.riskScore;
            break;
          case 'name':
            comp = a.name.localeCompare(b.name);
            break;
          case 'age':
            comp = a.age - b.age;
            break;
          case 'heartRate':
            comp = a.vitals.heartRate - b.vitals.heartRate;
            break;
          case 'spo2':
            comp = a.vitals.spo2 - b.vitals.spo2;
            break;
          case 'lastUpdate':
            comp = a.lastUpdate.localeCompare(b.lastUpdate);
            break;
          default:
            comp = 0;
        }
        return sortDirection === 'asc' ? comp : -comp;
      });
  }, [patients, searchQuery, statusFilter, sortField, sortDirection]);

  const onRowClick = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    setActiveTab('patient-detail');
  };

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 mr-1.5"></span>
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            Warning
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
            Attention
          </span>
        );
      case 'stable':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5"></span>
            Stable
          </span>
        );
    }
  };

  const getRiskScorePill = (score: number) => {
    let colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let label = 'Low';
    if (score >= 85) {
      colorClass = 'bg-rose-600 text-white font-bold border-rose-700 shadow-sm';
      label = 'Critical';
    } else if (score >= 70) {
      colorClass = 'bg-rose-100 text-rose-800 font-semibold border-rose-300';
      label = 'High';
    } else if (score >= 50) {
      colorClass = 'bg-amber-100 text-amber-800 font-semibold border-amber-300';
      label = 'Elevated';
    } else if (score >= 30) {
      colorClass = 'bg-yellow-100 text-yellow-800 font-medium border-yellow-300';
      label = 'Moderate';
    }

    return (
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-0.5 rounded text-xs border font-mono ${colorClass}`}>
          {score} / 100
        </span>
        <span className="text-xs text-slate-500 hidden xl:inline">({label})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient name or residence..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-xs"
            />
          </div>
          <div className="flex items-center space-x-1 border border-slate-300 rounded-lg p-0.5 bg-white text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({patients.length})
            </button>
            <button
              onClick={() => setStatusFilter('critical')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Warning / Attention
            </button>
            <button
              onClick={() => setStatusFilter('stable')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === 'stable' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stable
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Sort by Risk</span> prioritizes patients needing immediate clinical attention.
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 select-none uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="py-3 px-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer"
                >
                  <span>Patient</span>
                  {sortField === 'name' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              </th>
              <th scope="col" className="py-3 px-3">
                <button
                  onClick={() => handleSort('age')}
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer"
                >
                  <span>Age</span>
                  {sortField === 'age' && (sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />)}
                </button>
              </th>
              <th scope="col" className="py-3 px-3">Status</th>
              <th scope="col" className="py-3 px-4">
                <button
                  onClick={() => handleSort('risk')}
                  className="flex items-center space-x-1 text-slate-800 hover:text-blue-600 font-bold cursor-pointer"
                >
                  <span>Prototype Risk</span>
                  {sortField === 'risk' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              </th>
              <th scope="col" className="py-3 px-3">
                <button
                  onClick={() => handleSort('heartRate')}
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer"
                >
                  <span>Heart Rate</span>
                  {sortField === 'heartRate' && (sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />)}
                </button>
              </th>
              <th scope="col" className="py-3 px-3">
                <button
                  onClick={() => handleSort('spo2')}
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer"
                >
                  <span>SpO₂</span>
                  {sortField === 'spo2' && (sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />)}
                </button>
              </th>
              <th scope="col" className="py-3 px-3">Blood Pressure</th>
              <th scope="col" className="py-3 px-3">Activity</th>
              <th scope="col" className="py-3 px-3">
                <button
                  onClick={() => handleSort('lastUpdate')}
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer"
                >
                  <span>Last Update</span>
                  {sortField === 'lastUpdate' && (sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />)}
                </button>
              </th>
              <th scope="col" className="py-3 px-3">Alert & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredAndSortedPatients.map(patient => {
              const isSelected = patient.id === selectedPatientId;
              const isCritical = patient.status === 'critical';
              const hrAbnormal = patient.vitals.heartRate > patient.baseline.heartRateMax;
              const spo2Abnormal = patient.vitals.spo2 < patient.baseline.spo2Min;

              return (
                <tr
                  key={patient.id}
                  onClick={() => onRowClick(patient)}
                  className={`transition-colors cursor-pointer group ${
                    isCritical
                      ? 'bg-rose-50/60 hover:bg-rose-100/70 border-l-4 border-l-rose-600'
                      : isSelected
                      ? 'bg-blue-50/70 hover:bg-blue-100/70 border-l-4 border-l-blue-600'
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Patient Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCritical
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {getPatientInitials(patient.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                          <span>{patient.name}</span>
                          {patient.isEmergencySimulated && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-mono font-medium border border-red-200">
                              SIM ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {patient.livingSituation}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="py-3 px-3 font-medium text-slate-800">{patient.age}</td>

                  {/* Status */}
                  <td className="py-3 px-3">{getStatusBadge(patient.status)}</td>

                  {/* Risk Score */}
                  <td className="py-3 px-4">{getRiskScorePill(patient.riskScore)}</td>

                  {/* Heart Rate */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          hrAbnormal ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-400'
                        }`}
                      />
                      <span className={`font-semibold font-mono ${hrAbnormal ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                        {patient.vitals.heartRate}
                      </span>
                      <span className="text-[10px] text-slate-400">BPM</span>
                    </div>
                    {hrAbnormal && (
                      <div className="text-[10px] text-rose-600 font-medium">
                        +{patient.vitals.heartRate - patient.baseline.heartRateMax} vs baseline
                      </div>
                    )}
                  </td>

                  {/* SpO2 */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <Droplets
                        className={`w-3.5 h-3.5 ${
                          spo2Abnormal ? 'text-blue-600 fill-blue-600' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`font-semibold font-mono ${
                          spo2Abnormal ? 'text-rose-700 font-bold bg-rose-100 px-1 rounded' : 'text-slate-800'
                        }`}
                      >
                        {patient.vitals.spo2}%
                      </span>
                    </div>
                    {spo2Abnormal && (
                      <div className="text-[10px] text-rose-600 font-medium">
                        Below {patient.baseline.spo2Min}% floor
                      </div>
                    )}
                  </td>

                  {/* Blood Pressure */}
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia}
                    <span className="text-[10px] text-slate-400 ml-1">mmHg</span>
                  </td>

                  {/* Activity */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded ${
                        patient.vitals.activityLevel === 'Very Low' || patient.vitals.activityLevel === 'None'
                          ? 'bg-rose-100 text-rose-800 font-bold'
                          : patient.vitals.activityLevel === 'Declining'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {patient.vitals.activityLevel}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {patient.vitals.lastMovementMinutesAgo}m motionless
                    </div>
                  </td>

                  {/* Last Update */}
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{patient.lastUpdate}</span>
                    </div>
                  </td>

                  {/* Alert & Detail Action */}
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-between space-x-2">
                      {patient.activeAlertCount > 0 ? (
                        <div className="flex items-center space-x-1 text-rose-700 font-medium text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate max-w-[140px] text-[11px]">
                            {patient.recentAlertTitle || 'Alert Active'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>
          Showing {filteredAndSortedPatients.length} of {patients.length} monitored seniors in active triage cohort
        </span>
        <span className="text-slate-400 text-[11px]">
          Click any row to open comprehensive physiological trends and intervention timeline
        </span>
      </div>
    </div>
  );
};
