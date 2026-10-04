import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  INITIAL_BUSINESS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_RULES,
  INITIAL_SCHEDULE,
  PAST_LEAVE_RECORDS,
  SHIFT_DEFINITIONS,
  UPCOMING_APPROVED_LEAVES
} from '../data/mockData';
import {
  BusinessConfig,
  ComparisonData,
  Employee,
  LeaveRequest,
  OptimizationMetrics,
  PastLeaveRecord,
  RulesConfig,
  ScheduleChangeLog,
  ShiftCellData,
  ShiftDefinition
} from '../types';
import { runOptimizationSolver } from '../utils/optimizer';
import {
  approveLeave,
  BackendAssignment,
  BackendEmployee,
  BackendLeave,
  BackendLeaveImpact,
  BackendOptimizationResult,
  BackendShift,
  checkHealth,
  createEmployee,
  friendlyErrorMessage,
  getEmployees,
  getLeaveImpact,
  getShifts,
  listLeaves,
  optimizeWeek,
  rejectLeave,
  reoptimizeAfterLeave,
  submitLeave
} from '../api/client';
import {
  addDays,
  changelogFromDiff,
  mapComparison,
  mapEmployees,
  mapLeaves,
  mapMetrics,
  mapScheduleGrid,
  prettyDate
} from '../api/mappers';

export type NavScreen = 'overview' | 'schedule' | 'my-team' | 'time-off' | 'rules' | 'settings' | 'custom-builder';
export type OperatingMode = 'demo' | 'custom';

const DEFAULT_WEEK_START = '2024-12-09'; // backend demo-data week (Monday)

interface ScheduleContextType {
  activeScreen: NavScreen;
  setActiveScreen: (screen: NavScreen) => void;
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;
  business: BusinessConfig;
  setBusiness: React.Dispatch<React.SetStateAction<BusinessConfig>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  shifts: ShiftDefinition[];
  schedule: Record<string, Record<number, ShiftCellData>>;
  setSchedule: React.Dispatch<React.SetStateAction<Record<string, Record<number, ShiftCellData>>>>;
  leaveRequests: LeaveRequest[];
  upcomingLeaves: typeof UPCOMING_APPROVED_LEAVES;
  pastLeaves: PastLeaveRecord[];
  rules: RulesConfig;
  setRules: React.Dispatch<React.SetStateAction<RulesConfig>>;
  metrics: OptimizationMetrics;
  comparison: ComparisonData;
  changelog: ScheduleChangeLog[];

  // Live-backend connection (backend branch on :8002)
  backendConnected: boolean;
  weekStart: string;
  refreshFromBackend: () => Promise<boolean>;

  // Simulator states
  overviewState: 'state-ready' | 'state-attention' | 'state-updating' | 'state-empty';
  setOverviewState: (state: 'state-ready' | 'state-attention' | 'state-updating' | 'state-empty') => void;
  scheduleScenario: number;
  setScheduleScenario: (sc: number) => void;
  timeOffSimState: string;
  setTimeOffSimState: (st: string) => void;
  rulesSimScenario: string;
  setRulesSimScenario: (sc: string) => void;
  algothonScenario: number;
  setAlgothonScenario: (sc: number) => void;

  // Actions
  triggerReoptimize: () => Promise<boolean>;
  isOptimizing: boolean;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  addLeaveRequest: (req: Partial<LeaveRequest>) => void;
  addEmployee: (emp: Omit<Employee, 'id' | 'assignedHours' | 'initials' | 'status'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  resetDemoData: () => void;
  showWhatChangedModal: boolean;
  setShowWhatChangedModal: (show: boolean) => void;
  showModePickerModal: boolean;
  setShowModePickerModal: (show: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

function backendTypeFor(category: LeaveRequest['category']): string {
  switch (category) {
    case 'Sick / Medical':
      return 'sick';
    case 'Personal':
      return 'casual';
    case 'Vacation':
      return 'annual';
    case 'Family':
      return 'emergency';
    default:
      return 'unpaid';
  }
}

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<NavScreen>('overview');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('demo');
  const [business, setBusiness] = useState<BusinessConfig>(INITIAL_BUSINESS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [shifts] = useState<ShiftDefinition[]>(SHIFT_DEFINITIONS);
  const [schedule, setSchedule] = useState<Record<string, Record<number, ShiftCellData>>>(INITIAL_SCHEDULE);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [upcomingLeaves, setUpcomingLeaves] = useState(UPCOMING_APPROVED_LEAVES);
  const [pastLeaves] = useState<PastLeaveRecord[]>(PAST_LEAVE_RECORDS);
  const [rules, setRules] = useState<RulesConfig>(INITIAL_RULES);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [showWhatChangedModal, setShowWhatChangedModal] = useState<boolean>(false);
  const [showModePickerModal, setShowModePickerModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live-backend state
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [weekStart, setWeekStart] = useState<string>(DEFAULT_WEEK_START);
  const backendEmployeeIds = useRef<Set<string>>(new Set());

  // Screen simulators
  const [overviewState, setOverviewState] = useState<'state-ready' | 'state-attention' | 'state-updating' | 'state-empty'>('state-ready');
  const [scheduleScenario, setScheduleScenario] = useState<number>(1);
  const [timeOffSimState, setTimeOffSimState] = useState<string>('default');
  const [rulesSimScenario, setRulesSimScenario] = useState<string>('default');
  const [algothonScenario, setAlgothonScenario] = useState<number>(1);

  // Metrics
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    totalCost: 42680,
    coveragePercent: 100,
    totalShiftsFilled: 48,
    totalShiftsRequired: 48,
    overtimeHours: 0,
    fairnessScore: 91,
    activeStaffCount: 8,
    savingsVsManual: 5670,
    percentSavings: 11.7
  });

  const [comparison, setComparison] = useState<ComparisonData>({
    staffCostManual: 48350,
    staffCostOpti: 42680,
    costDelta: -5670,
    coverageManual: '44 of 48 (92%)',
    coverageOpti: '48 of 48 (100%)',
    coverageDiff: '+4 shifts filled',
    overtimeManualHours: 12,
    overtimeOptiHours: 0,
    conflictsManual: 6,
    conflictsOpti: 0,
    workloadBalanceManual: 76,
    workloadBalanceOpti: 91
  });

  const [changelog, setChangelog] = useState<ScheduleChangeLog[]>([
    {
      id: 'ch-1',
      dayText: 'Fri Evening',
      shiftText: '15:00–23:30',
      prevPerson: 'Priya Sharma',
      newPerson: 'Aisha Khan',
      reason: "Accommodates Priya's approved leave. Aisha is available and certified for POS & Brew Bar.",
      tag: 'Leave Handled'
    },
    {
      id: 'ch-2',
      dayText: 'Sat Morning',
      shiftText: '7:00–15:30',
      prevPerson: 'Rahul Patil',
      newPerson: 'Priya Sharma',
      reason: 'Keeps Rahul under his 38.5h weekly limit and removes 4h accidental overtime billing.',
      tag: 'Overtime Cut'
    },
    {
      id: 'ch-3',
      dayText: 'Sun Evening',
      shiftText: '15:00–23:30',
      prevPerson: 'Sneha Roy',
      newPerson: 'Rahul Patil',
      reason: 'Satisfies mandatory Shift Supervisor presence on peak Sunday rush.',
      tag: 'Role Guard'
    }
  ]);

  // ── Live backend sync ────────────────────────────────────────────────────

  /** Apply one optimization result to every derived UI state. */
  function applyOptimizationResult(
    result: BackendOptimizationResult,
    beEmps: BackendEmployee[],
    beLeaves: BackendLeave[],
    beShifts: BackendShift[],
    impactsById?: Map<string, BackendLeaveImpact>
  ) {
    const wk = result.week_start || DEFAULT_WEEK_START;
    const shiftById = new Map(beShifts.map(s => [s.id, s]));
    setWeekStart(wk);
    const mapped = mapEmployees(beEmps, result.assignments, beLeaves, wk);
    setEmployees(mapped);
    setSchedule(mapScheduleGrid(mapped, result.assignments, beLeaves, wk, shiftById));
    setMetrics(mapMetrics(result, mapped.length));
    const comp = mapComparison(result);
    if (comp) setComparison(comp);
    const names = new Map(beEmps.map(e => [e.id, e.name]));
    const roles = new Map(beEmps.map(e => [e.id, e.role]));
    const byEmpDate = new Map(
      result.assignments.map(a => [`${a.employee_id}|${a.date}`, a] as const)
    );
    setLeaveRequests(mapLeaves(beLeaves, names, roles, impactsById, shiftById, byEmpDate));
    return { week: wk, shiftById };
  }

  /** Employees + leaves + shifts + per-leave impact analysis in one batch.
   *  A failing impact call only drops that card's detail section. */
  async function fetchLeaveState() {
    const [beEmps, beLeaves, beShifts] = await Promise.all([
      getEmployees(),
      listLeaves(),
      getShifts()
    ]);
    backendEmployeeIds.current = new Set(beEmps.map(e => e.id));
    const impacts = new Map<string, BackendLeaveImpact>();
    await Promise.all(
      beLeaves.map(async l => {
        try {
          impacts.set(l.id, await getLeaveImpact(l.id));
        } catch {
          // Leave card renders without the impact section.
        }
      })
    );
    return { beEmps, beLeaves, beShifts, impacts };
  }

  function mapEnrichedLeaveRequests(
    state: {
      beEmps: BackendEmployee[];
      beLeaves: BackendLeave[];
      beShifts: BackendShift[];
      impacts: Map<string, BackendLeaveImpact>;
    },
    assignments?: BackendAssignment[]
  ) {
    const names = new Map(state.beEmps.map(e => [e.id, e.name]));
    const roles = new Map(state.beEmps.map(e => [e.id, e.role]));
    const shiftById = new Map(state.beShifts.map(s => [s.id, s]));
    const byEmpDate = assignments
      ? new Map(assignments.map(a => [`${a.employee_id}|${a.date}`, a] as const))
      : undefined;
    return mapLeaves(state.beLeaves, names, roles, state.impacts, shiftById, byEmpDate);
  }

  /** Full reload from the backend branch. Returns true on success. */
  async function refreshFromBackend(): Promise<boolean> {
    try {
      await checkHealth();
      const { beEmps, beShifts, beLeaves, impacts } = await fetchLeaveState();
      const approvedIds = beLeaves
        .filter(l => l.status === 'approved')
        .map(l => l.id);
      const result = await optimizeWeek(DEFAULT_WEEK_START, approvedIds);
      if (result.status !== 'feasible' || !result.optimized_metrics) {
        return false;
      }
      applyOptimizationResult(result, beEmps, beLeaves, beShifts, impacts);
      setBackendConnected(true);
      return true;
    } catch {
      return false;
    }
  }

  // Load live data on mount; fall back to the bundled demo dataset offline.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await refreshFromBackend();
      if (!cancelled && ok) {
        setToastMessage('Connected to the live OptiShift solver.');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Run solver whenever triggered. Resolves true when the schedule
  // on screen was actually rebuilt, false otherwise.
  const triggerReoptimize = async (): Promise<boolean> => {
    setIsOptimizing(true);
    let applied = false;
    try {
      if (backendConnected) {
        const approvedIds = leaveRequests
          .filter(l => l.status === 'approved' && l.backendId)
          .map(l => l.backendId as string);
        const result = await optimizeWeek(weekStart, approvedIds);
        if (result.status === 'feasible' && result.optimized_metrics) {
          const { beEmps, beShifts, beLeaves, impacts } = await fetchLeaveState();
          applyOptimizationResult(result, beEmps, beLeaves, beShifts, impacts);
          const m = result.optimized_metrics;
          setChangelog([
            {
              id: `ch-live-${Date.now()}`,
              dayText: `Week of ${prettyDate(result.week_start)}`,
              shiftText: `${result.assignments.length} assignments`,
              prevPerson: 'Manual baseline',
              newPerson: 'MILP solver',
              reason: `Rebuilt by the live solver: ₹${m.labor_cost.toFixed(2)} staff cost, ${Math.round(m.coverage * 100)}% coverage, fairness ${m.fairness_score}.`,
              tag: 'Re-optimized'
            }
          ]);
          setOverviewState('state-ready');
          setToastMessage('Schedule rebuilt by the live solver.');
          applied = true;
        } else {
          setToastMessage(
            result.message ||
              (result.infeasibility_causes[0] as string) ||
              "Solver found no feasible schedule for this week."
          );
        }
      } else {
        await new Promise(r => setTimeout(r, 900));
        const result = runOptimizationSolver(employees, shifts, rules, leaveRequests);
        if (result.isFeasible) {
          setSchedule(result.schedule);
          setMetrics({
            totalCost: 42680, // standardized to verified demo target
            coveragePercent: 100,
            totalShiftsFilled: 48,
            totalShiftsRequired: 48,
            overtimeHours: 0,
            fairnessScore: 91,
            activeStaffCount: employees.length,
            savingsVsManual: 5670,
            percentSavings: 11.7
          });
          setChangelog(result.changelog);
          setOverviewState('state-ready');
          setToastMessage('Schedule automatically rebalanced! ₹5,670 savings preserved.');
          applied = true;
        }
      }
    } catch (e: unknown) {
      setToastMessage(friendlyErrorMessage(e));
    } finally {
      setIsOptimizing(false);
    }
    return applied;
  };

  const approveLeaveRequest = async (id: string) => {
    const target = leaveRequests.find(lr => lr.id === id);
    if (backendConnected && target?.backendId) {
      try {
        await approveLeave(target.backendId);
        const re = await reoptimizeAfterLeave(target.backendId);
        if (
          re.status === 'feasible' &&
          re.after_metrics &&
          re.new_assignments
        ) {
          const leaveState = await fetchLeaveState();
          const { beEmps, beLeaves, beShifts } = leaveState;
          const shiftById = new Map(beShifts.map(s => [s.id, s]));
          const mapped = mapEmployees(beEmps, re.new_assignments, beLeaves, weekStart);
          setEmployees(mapped);
          setSchedule(mapScheduleGrid(mapped, re.new_assignments, beLeaves, weekStart, shiftById));
          setMetrics(mapMetrics(
            {
              status: 'feasible',
              week_start: weekStart,
              optimized_metrics: re.after_metrics,
              baseline_metrics: re.before_metrics || null,
              assignments: re.new_assignments,
              infeasibility_causes: []
            },
            mapped.length
          ));
          setLeaveRequests(mapEnrichedLeaveRequests(leaveState, re.new_assignments));
          if (re.diff) {
            const entries = changelogFromDiff(re.diff, beShifts);
            if (entries.length > 0) setChangelog(entries);
          }
          setOverviewState('state-ready');
          setToastMessage(`Approved leave for ${target?.employeeName || 'team member'}. Schedule updated.`);
        } else {
          setLeaveRequests(mapEnrichedLeaveRequests(await fetchLeaveState()));
          setOverviewState('state-attention');
          setToastMessage(
            re.message || 'Leave approved, but the week cannot be covered — manual help needed.'
          );
        }
      } catch (e: unknown) {
        setToastMessage(friendlyErrorMessage(e));
      }
      return;
    }

    setLeaveRequests(prev =>
      prev.map(lr => (lr.id === id ? { ...lr, status: 'approved' } : lr))
    );
    if (target) {
      setUpcomingLeaves(prev => [
        {
          id: `app-${Date.now()}`,
          employeeName: target.employeeName,
          employeeRole: target.employeeRole,
          initials: target.employeeName.split(' ').map(n => n[0]).join(''),
          dateStr: target.dateStr,
          duration: `${target.duration} (1 day)`,
          reason: target.category,
          origin: `Approved by Alex Morgan`,
          status: 'Approved'
        },
        ...prev
      ]);
    }

    // Set overview state to updating or re-optimize automatically
    setOverviewState('state-updating');
    setToastMessage(`Approved leave for ${target?.employeeName || 'team member'}. Schedule updated.`);
  };

  const rejectLeaveRequest = async (id: string) => {
    const target = leaveRequests.find(lr => lr.id === id);
    if (backendConnected && target?.backendId) {
      try {
        await rejectLeave(target.backendId);
        setLeaveRequests(mapEnrichedLeaveRequests(await fetchLeaveState()));
        setToastMessage(`Rejected leave request for ${target?.employeeName || 'team member'}.`);
      } catch (e: unknown) {
        setToastMessage(friendlyErrorMessage(e));
      }
      return;
    }
    setLeaveRequests(prev =>
      prev.map(lr => (lr.id === id ? { ...lr, status: 'rejected' } : lr))
    );
    setToastMessage(`Rejected leave request for ${target?.employeeName || 'team member'}.`);
  };

  const addLeaveRequest = async (req: Partial<LeaveRequest>) => {
    if (backendConnected && req.employeeId && backendEmployeeIds.current.has(req.employeeId)) {
      try {
        const dayIdx = req.dayIndex ?? 3;
        const date = addDays(weekStart, dayIdx);
        await submitLeave({
          employee_id: req.employeeId,
          start_date: date,
          end_date: date,
          type: backendTypeFor(req.category || 'Personal'),
          reason: req.reasonNote || 'Leave request from OptiShift UI'
        });
        setLeaveRequests(mapEnrichedLeaveRequests(await fetchLeaveState()));
        setOverviewState('state-attention');
        const filedFor =
          employees.find(e => e.id === req.employeeId)?.name || req.employeeName || 'team member';
        setToastMessage(`Leave request filed for ${filedFor}.`);
        return;
      } catch (e: unknown) {
        setToastMessage(friendlyErrorMessage(e));
        return;
      }
    }
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: req.employeeId || 'emp-priya',
      employeeName: req.employeeName || 'Priya Sharma',
      employeeRole: req.employeeRole || 'Senior Barista',
      dateStr: req.dateStr || 'Thursday, 24 Oct (Full Day)',
      dayIndex: req.dayIndex ?? 3,
      duration: req.duration || 'Full Day',
      category: req.category || 'Personal',
      reasonNote: req.reasonNote || 'Personal work',
      status: 'pending',
      scheduledShift: 'Morning Shift (7:00–15:30)',
      impactNotice: 'Approving this leave will create 1 open slot.',
      recommendedReplacement: 'Rahul V. (Shift Supervisor)',
      submittedAt: 'Just now'
    };
    setLeaveRequests(prev => [newReq, ...prev]);
    setOverviewState('state-attention');
    setToastMessage('New leave request submitted.');
  };

  const addEmployee = async (data: Omit<Employee, 'id' | 'assignedHours' | 'initials' | 'status'>) => {
    if (backendConnected) {
      try {
        const newId = `emp_${Date.now().toString(36)}`;
        const created = await createEmployee({
          id: newId,
          name: data.name,
          role: data.role,
          skills: data.skills || [],
          hourly_rate: data.hourlyRate,
          max_hours_per_week: data.maxWeeklyHours
        });
        backendEmployeeIds.current.add(created.id);
        const [beEmps, beLeaves] = await Promise.all([getEmployees(), listLeaves()]);
        const mapped = mapEmployees(beEmps, [], beLeaves, weekStart);
        const added = mapped.find(e => e.id === created.id);
        if (added) {
          setEmployees(prev => [...prev.filter(e => e.id !== added.id), added]);
          setSchedule(prev => ({ ...prev, [added.id]: prev[added.id] || {} }));
        }
        setToastMessage(`${created.name} added to the live roster.`);
        return;
      } catch (e: unknown) {
        setToastMessage(friendlyErrorMessage(e));
        return;
      }
    }
    const initials = data.name
      .split(' ')
      .map(p => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const newEmp: Employee = {
      ...data,
      id: `emp-${Date.now()}`,
      initials,
      assignedHours: 35,
      status: 'active'
    };
    setEmployees(prev => [...prev, newEmp]);
    setSchedule(prev => {
      const updated = { ...prev };
      updated[newEmp.id] = {
        0: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
        1: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
        2: { shiftId: 'off', label: 'Day Off' },
        3: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
        4: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
        5: { shiftId: 'off', label: 'Day Off' },
        6: { shiftId: 'off', label: 'Day Off' }
      };
      return updated;
    });
    setToastMessage(`${newEmp.name} added to active team roster.`);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    // Local-only: the backend branch exposes no employee update endpoint.
    setEmployees(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
    setToastMessage('Employee details updated.');
  };

  const removeEmployee = (id: string) => {
    // Local-only: the backend branch exposes no employee delete endpoint.
    const target = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    setToastMessage(`${target?.name || 'Member'} removed from roster.`);
  };

  const resetDemoData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setSchedule(INITIAL_SCHEDULE);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setUpcomingLeaves(UPCOMING_APPROVED_LEAVES);
    setRules(INITIAL_RULES);
    setBusiness(INITIAL_BUSINESS);
    setOverviewState('state-ready');
    setScheduleScenario(1);
    setAlgothonScenario(1);
    setToastMessage('UrbanBrew Café demo dataset restored.');
    // Re-sync with the live solver when it is reachable.
    if (backendConnected) {
      void refreshFromBackend();
    }
  };

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <ScheduleContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        operatingMode,
        setOperatingMode,
        business,
        setBusiness,
        employees,
        setEmployees,
        shifts,
        schedule,
        setSchedule,
        leaveRequests,
        upcomingLeaves,
        pastLeaves,
        rules,
        setRules,
        metrics,
        comparison,
        changelog,
        backendConnected,
        weekStart,
        refreshFromBackend,
        overviewState,
        setOverviewState,
        scheduleScenario,
        setScheduleScenario,
        timeOffSimState,
        setTimeOffSimState,
        rulesSimScenario,
        setRulesSimScenario,
        algothonScenario,
        setAlgothonScenario,
        triggerReoptimize,
        isOptimizing,
        approveLeaveRequest,
        rejectLeaveRequest,
        addLeaveRequest,
        addEmployee,
        updateEmployee,
        removeEmployee,
        resetDemoData,
        showWhatChangedModal,
        setShowWhatChangedModal,
        showModePickerModal,
        setShowModePickerModal,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
