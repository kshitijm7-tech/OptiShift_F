// Adapters: backend-branch DTOs → OptiShift_F UI types.
// Everything here only reshapes real backend data; nothing is invented.
import {
  BackendAssignment,
  BackendDiff,
  BackendEmployee,
  BackendLeave,
  BackendLeaveImpact,
  BackendMetrics,
  BackendOptimizationResult,
  BackendShift
} from './client';
import {
  ComparisonData,
  Employee,
  LeaveRequest,
  OptimizationMetrics,
  ScheduleChangeLog,
  ShiftCellData
} from '../types';

const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function parseNoon(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

/** Days between two YYYY-MM-DD dates (date - base). */
export function daysBetween(dateStr: string, baseStr: string): number {
  const ms =
    parseNoon(dateStr).getTime() - parseNoon(baseStr).getTime();
  return Math.round(ms / 86400000);
}

export function addDays(baseStr: string, n: number): string {
  const d = parseNoon(baseStr);
  d.setDate(d.getDate() + n);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Monday-first day index (0–6) for an ISO date. */
export function weekdayIndex(dateStr: string): number {
  return (parseNoon(dateStr).getDay() + 6) % 7;
}

export function prettyDate(dateStr: string): string {
  const d = parseNoon(dateStr);
  return `${DAY_SHORT[(d.getDay() + 6) % 7]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/** Backend shift → UI grid slot. */
export function slotForShift(
  shiftId: string,
  startTime?: string
): 'morning' | 'mid' | 'evening' {
  const id = shiftId.toLowerCase();
  if (id.includes('morning')) return 'morning';
  if (id.includes('evening') || id.includes('night')) return 'evening';
  if (id.includes('afternoon') || id.includes('mid')) return 'mid';
  if (startTime) {
    const hour = parseInt(startTime.split(':')[0] || '0', 10);
    if (hour < 12) return 'morning';
    if (hour < 17) return 'mid';
    return 'evening';
  }
  return 'mid';
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map(p => p[0] || '')
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function availabilityDescOf(emp: BackendEmployee): string {
  const avail = DAY_NAMES.filter(day => {
    const a = emp.availability.find(x => x.day.toLowerCase() === day.toLowerCase());
    return a ? a.available : true;
  });
  if (avail.length === 7) return 'Available all week';
  if (avail.length === 0) return 'No availability set';
  return avail.map(d => d.substring(0, 3)).join(', ');
}

function dayAvailabilityOf(
  emp: BackendEmployee
): Record<number, 'any' | 'morning' | 'evening' | 'off'> {
  const out: Record<number, 'any' | 'morning' | 'evening' | 'off'> = {};
  for (let i = 0; i < 7; i++) {
    const day = DAY_NAMES[i];
    const a = emp.availability.find(x => x.day.toLowerCase() === day.toLowerCase());
    if (!a) {
      out[i] = 'any';
      continue;
    }
    if (!a.available) {
      out[i] = 'off';
      continue;
    }
    const prefs = (a.preferred_shifts || []).join(' ').toLowerCase();
    if (prefs.includes('morning')) out[i] = 'morning';
    else if (prefs.includes('evening')) out[i] = 'evening';
    else out[i] = 'any';
  }
  return out;
}

function leaveCategory(beType: string): LeaveRequest['category'] {
  switch (beType.toLowerCase()) {
    case 'sick':
      return 'Sick / Medical';
    case 'casual':
      return 'Personal';
    case 'annual':
      return 'Vacation';
    case 'emergency':
      return 'Family';
    default:
      return 'Other';
  }
}

function leaveDayIndexes(
  leave: BackendLeave,
  weekStart: string
): number[] {
  const out: number[] = [];
  const total = daysBetween(leave.end_date, leave.start_date);
  for (let n = 0; n <= Math.max(0, total); n++) {
    const idx = daysBetween(addDays(leave.start_date, n), weekStart);
    if (idx >= 0 && idx < 7) out.push(idx);
  }
  return out;
}

// ── Employees ───────────────────────────────────────────────────────────────

export function mapEmployees(
  list: BackendEmployee[],
  assignments: BackendAssignment[],
  leaves: BackendLeave[],
  weekStart: string
): Employee[] {
  const hours = new Map<string, number>();
  for (const a of assignments) {
    hours.set(a.employee_id, (hours.get(a.employee_id) || 0) + a.hours);
  }
  const weekEnd = addDays(weekStart, 6);
  return list.map(be => {
    const approvedLeave = leaves.find(
      l =>
        l.employee_id === be.id &&
        l.status === 'approved' &&
        l.start_date <= weekEnd &&
        l.end_date >= weekStart
    );
    return {
      id: be.id,
      name: be.name,
      initials: initialsOf(be.name),
      role: be.role,
      isFullTime: be.max_hours_per_week >= 40,
      skills: be.skills,
      hourlyRate: be.hourly_rate,
      maxWeeklyHours: be.max_hours_per_week,
      assignedHours: Math.round((hours.get(be.id) || 0) * 10) / 10,
      availabilityDesc: availabilityDescOf(be),
      dayAvailability: dayAvailabilityOf(be),
      status: approvedLeave ? 'on_leave' : 'active',
      leaveNote: approvedLeave
        ? `${leaveCategory(approvedLeave.type)} · ${prettyDate(approvedLeave.start_date)}`
        : undefined
    } as Employee;
  });
}

// ── Schedule grid ───────────────────────────────────────────────────────────

export function mapScheduleGrid(
  employees: Employee[],
  assignments: BackendAssignment[],
  leaves: BackendLeave[],
  weekStart: string,
  shiftById: Map<string, BackendShift>
): Record<string, Record<number, ShiftCellData>> {
  const grid: Record<string, Record<number, ShiftCellData>> = {};
  for (const emp of employees) {
    grid[emp.id] = {};
    for (let d = 0; d < 7; d++) {
      grid[emp.id][d] = { shiftId: 'off', label: 'Day Off' };
    }
  }

  const leaveByEmpDay = new Map<string, BackendLeave>();
  for (const l of leaves) {
    if (l.status !== 'approved') continue;
    for (const idx of leaveDayIndexes(l, weekStart)) {
      leaveByEmpDay.set(`${l.employee_id}|${idx}`, l);
    }
  }
  for (const [key, l] of leaveByEmpDay) {
    const [empId, dayStr] = key.split('|');
    const day = parseInt(dayStr, 10);
    if (grid[empId]) {
      grid[empId][day] = {
        shiftId: 'leave',
        label: 'On Leave',
        note: `${leaveCategory(l.type)} (Approved)`
      };
    }
  }

  const byEmpDay = new Map<string, BackendAssignment[]>();
  for (const a of assignments) {
    const idx = daysBetween(a.date, weekStart);
    if (idx < 0 || idx > 6) continue;
    const key = `${a.employee_id}|${idx}`;
    const arr = byEmpDay.get(key) || [];
    arr.push(a);
    byEmpDay.set(key, arr);
  }
  for (const [key, arr] of byEmpDay) {
    const [empId, dayStr] = key.split('|');
    const day = parseInt(dayStr, 10);
    if (!grid[empId]) continue;
    // Leave cells win over assignments (approved time off is binding).
    if (grid[empId][day].shiftId === 'leave') continue;
    const first = arr[0];
    const shift = shiftById.get(first.shift_id);
    const slot = slotForShift(first.shift_id, shift?.start_time);
    grid[empId][day] = {
      shiftId: slot,
      label: shift?.name || first.shift_name || 'Shift',
      timeRange:
        shift != null
          ? `${shift.start_time}–${shift.end_time}`
          : undefined,
      note: arr.length > 1 ? `+${arr.length - 1} more shift${arr.length > 2 ? 's' : ''}` : undefined
    };
  }
  return grid;
}

// ── Metrics & comparison ────────────────────────────────────────────────────

function emptyMetrics(activeStaffCount: number): OptimizationMetrics {
  return {
    totalCost: 0,
    coveragePercent: 0,
    totalShiftsFilled: 0,
    totalShiftsRequired: 0,
    overtimeHours: 0,
    fairnessScore: 0,
    activeStaffCount,
    savingsVsManual: 0,
    percentSavings: 0
  };
}

export function mapMetrics(
  result: BackendOptimizationResult,
  activeStaffCount: number
): OptimizationMetrics {
  const opt = result.optimized_metrics;
  if (!opt) return emptyMetrics(activeStaffCount);
  const filled = result.assignments.length;
  const total =
    opt.coverage > 0 ? Math.round(filled / opt.coverage) : filled;
  const base = result.baseline_metrics;
  const savings =
    base != null ? base.labor_cost - opt.labor_cost : opt.savings || 0;
  const pct =
    base != null && base.labor_cost > 0
      ? (savings / base.labor_cost) * 100
      : opt.savings_percentage || 0;
  return {
    totalCost: Math.round(opt.labor_cost * 100) / 100,
    coveragePercent: Math.round(opt.coverage * 1000) / 10,
    totalShiftsFilled: filled,
    totalShiftsRequired: total,
    overtimeHours: opt.overtime_hours,
    fairnessScore: Math.round(opt.fairness_score * 10) / 10,
    activeStaffCount,
    savingsVsManual: Math.round(savings * 100) / 100,
    percentSavings: Math.round(pct * 10) / 10
  };
}

function describeCoverage(m: BackendMetrics | null | undefined, total: number): string {
  if (!m) return `0 of ${total} (0%)`;
  const filled = Math.round(m.coverage * total);
  return `${filled} of ${total} (${Math.round(m.coverage * 100)}%)`;
}

export function mapComparison(
  result: BackendOptimizationResult
): ComparisonData | null {
  const opt = result.optimized_metrics;
  const base = result.baseline_metrics;
  if (!opt || !base) return null;
  const filled = result.assignments.length;
  const total = opt.coverage > 0 ? Math.round(filled / opt.coverage) : filled;
  const delta = opt.labor_cost - base.labor_cost;
  const manualFilled = Math.round(base.coverage * total);
  return {
    staffCostManual: Math.round(base.labor_cost * 100) / 100,
    staffCostOpti: Math.round(opt.labor_cost * 100) / 100,
    costDelta: Math.round(delta * 100) / 100,
    coverageManual: describeCoverage(base, total),
    coverageOpti: describeCoverage(opt, total),
    coverageDiff: `+${filled - manualFilled} shifts filled`,
    overtimeManualHours: base.overtime_hours,
    overtimeOptiHours: opt.overtime_hours,
    conflictsManual: base.availability_violations + base.skill_violations,
    conflictsOpti: opt.availability_violations + opt.skill_violations,
    workloadBalanceManual: Math.round(base.fairness_score * 10) / 10,
    workloadBalanceOpti: Math.round(opt.fairness_score * 10) / 10
  };
}

// ── Leave ───────────────────────────────────────────────────────────────────

export function mapLeaves(
  list: BackendLeave[],
  employeesById: Map<string, string>,
  rolesById?: Map<string, string>,
  impactsById?: Map<string, BackendLeaveImpact>,
  shiftById?: Map<string, BackendShift>,
  assignmentsByEmpDate?: Map<string, BackendAssignment>
): LeaveRequest[] {
  return list.map(l => {
    const dateStr =
      l.start_date === l.end_date
        ? prettyDate(l.start_date)
        : `${prettyDate(l.start_date)} – ${prettyDate(l.end_date)}`;
    const impact = impactsById?.get(l.id);
    const firstGap = impact?.affected_shifts?.[0];
    const gapShift = firstGap ? shiftById?.get(firstGap.shift_id) : undefined;
    // Fall back to the employee's actual assignment on the leave date
    // (affected_shifts is empty when nothing in the stored schedule collides).
    const scheduled = assignmentsByEmpDate?.get(`${l.employee_id}|${l.start_date}`);
    const scheduledShiftDef = scheduled ? shiftById?.get(scheduled.shift_id) : undefined;
    const scheduledShift = firstGap
      ? `${firstGap.shift}${gapShift ? ` (${gapShift.start_time}–${gapShift.end_time})` : ''} · ${firstGap.day}`
      : scheduled
        ? `${scheduled.shift_name}${scheduledShiftDef ? ` (${scheduledShiftDef.start_time}–${scheduledShiftDef.end_time})` : ''} · ${scheduled.day}`
        : undefined;
    const impactNotice =
      impact?.summary || (impact ? `Risk level: ${impact.overall_risk}` : undefined);
    const recommendedReplacement =
      firstGap?.replacement_candidates?.[0] ||
      impact?.replacement_options?.[0]?.name ||
      impact?.affected_tasks?.[0]?.replacement_candidates?.[0];
    return {
      id: `be-${l.id}`,
      backendId: l.id,
      employeeId: l.employee_id,
      employeeName: employeesById.get(l.employee_id) || l.employee_id,
      employeeRole: rolesById?.get(l.employee_id) || '',
      dateStr,
      dayIndex: weekdayIndex(l.start_date),
      duration: 'Full Day',
      category: leaveCategory(l.type),
      reasonNote: l.reason,
      status: l.status,
      scheduledShift,
      impactNotice,
      recommendedReplacement,
      submittedAt: prettyDate(l.start_date)
    } as LeaveRequest;
  });
}

// ── Changelog from a re-optimization diff ───────────────────────────────────
// Backend diff entries are compact {employee, shift, date} triples (names,
// not ids) — see ScheduleService._compute_diff.
export function changelogFromDiff(
  diff: BackendDiff,
  shifts: BackendShift[]
): ScheduleChangeLog[] {
  const shiftByName = new Map(shifts.map(s => [s.name, s]));
  const removedByKey = new Map<string, { employee: string; shift: string; date: string }>();
  for (const r of diff.removed_assignments) {
    if (r && r.shift && r.date) {
      removedByKey.set(`${r.shift}|${r.date}`, r);
    }
  }
  const entries: ScheduleChangeLog[] = [];
  for (const a of diff.added_assignments) {
    if (!a || !a.shift || !a.date) continue;
    const removed = removedByKey.get(`${a.shift}|${a.date}`);
    const prev = removed && removed.employee !== a.employee ? removed.employee : null;
    const s = shiftByName.get(a.shift);
    entries.push({
      id: `ch-${a.date}-${a.shift}-${a.employee}`.replace(/\s+/g, '_'),
      dayText: `${prettyDate(a.date)} · ${a.shift}`,
      shiftText: s ? `${s.start_time}–${s.end_time}` : a.date,
      prevPerson: prev || 'Unstaffed',
      newPerson: a.employee,
      reason: prev
        ? 'Reassigned by the MILP solver to keep every shift covered after the approved leave.'
        : 'Newly staffed by the MILP solver after the approved leave.',
      tag: 'Leave Handled'
    });
    if (entries.length >= 8) break;
  }
  return entries;
}
