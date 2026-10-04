export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string; dateNum: number; fullDate: string }[] = [
  { key: 'mon', label: 'Mon', dateNum: 14, fullDate: 'Mon, Oct 14' },
  { key: 'tue', label: 'Tue', dateNum: 15, fullDate: 'Tue, Oct 15' },
  { key: 'wed', label: 'Wed', dateNum: 16, fullDate: 'Wed, Oct 16' },
  { key: 'thu', label: 'Thu', dateNum: 17, fullDate: 'Thu, Oct 17' },
  { key: 'fri', label: 'Fri', dateNum: 18, fullDate: 'Fri, Oct 18' },
  { key: 'sat', label: 'Sat', dateNum: 19, fullDate: 'Sat, Oct 19' },
  { key: 'sun', label: 'Sun', dateNum: 20, fullDate: 'Sun, Oct 20' }
];

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  isFullTime: boolean;
  avatarUrl?: string;
  skills: string[];
  hourlyRate: number; // in INR
  maxWeeklyHours: number;
  assignedHours: number;
  availabilityDesc: string;
  // Day -> shift availability: 'any' | 'morning' | 'evening' | 'off'
  dayAvailability: Record<number, 'any' | 'morning' | 'evening' | 'off'>;
  status: 'active' | 'on_leave';
  leaveNote?: string;
}

export interface ShiftDefinition {
  id: string; // 'morning' | 'evening' | 'mid'
  name: string;
  timeRange: string;
  startTime: string; // '07:00'
  endTime: string;   // '15:30'
  durationHours: number; // 8.0 after unpaid break
  minStaff: number;
  accentColor: string;
  icon: string;
  subtitle: string;
}

export interface ShiftCellData {
  shiftId: 'morning' | 'evening' | 'mid' | 'off' | 'leave';
  label: string;
  timeRange?: string;
  note?: string;
  isOvertime?: boolean;
  isSwap?: boolean;
}

export interface LeaveRequest {
  id: string;
  /** Backend-branch leave id (present only for requests synced with the API). */
  backendId?: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  employeeAvatar?: string;
  dateStr: string;
  dayIndex: number;
  duration: 'Full Day' | 'Morning' | 'Evening';
  category: 'Personal' | 'Sick / Medical' | 'Vacation' | 'Family' | 'Education / Exam' | 'Other';
  reasonNote: string;
  status: 'pending' | 'approved' | 'rejected';
  scheduledShift?: string;
  impactNotice?: string;
  recommendedReplacement?: string;
  submittedAt: string;
}

export interface PastLeaveRecord {
  id: string;
  employeeName: string;
  dateStr: string;
  category: string;
  status: 'Approved' | 'Rejected';
  resolvedNote: string;
}

export interface MandatorySkillRule {
  id: string;
  shiftId: string;
  roleOrSkill: string;
  minCount: number;
}

export interface RulesConfig {
  morningMinStaff: number;
  eveningMinStaff: number;
  weekendBrunchMinStaff: number;
  maxWeeklyHours: number;
  maxDailyHours: number;
  minRestHours: number;
  overtimePolicy: 'avoid' | 'allow';
  maxAllowedOvertime: number;
  balanceWeeklyHours: boolean;
  balancedWeekendDistribution: boolean;
  followPreferredShifts: boolean;
  avoidAbruptShiftChanges: boolean;
  skillRules: MandatorySkillRule[];
}

export interface BusinessConfig {
  name: string;
  type: string;
  location: string;
  currency: string;
  defaultHorizon: '7' | '14' | '30';
  startOfWeek: 'monday' | 'sunday';
  highlightWeekends: boolean;
  timeFormat: '12h' | '24h';
  email: string;
  whatsAppEnabled: boolean;
}

export interface OptimizationMetrics {
  totalCost: number;
  coveragePercent: number;
  totalShiftsFilled: number;
  totalShiftsRequired: number;
  overtimeHours: number;
  fairnessScore: number;
  activeStaffCount: number;
  savingsVsManual: number;
  percentSavings: number;
}

export interface ComparisonData {
  staffCostManual: number;
  staffCostOpti: number;
  costDelta: number;
  coverageManual: string;
  coverageOpti: string;
  coverageDiff: string;
  overtimeManualHours: number;
  overtimeOptiHours: number;
  conflictsManual: number;
  conflictsOpti: number;
  workloadBalanceManual: number;
  workloadBalanceOpti: number;
}

export interface ScheduleChangeLog {
  id: string;
  dayText: string;
  shiftText: string;
  prevPerson: string;
  newPerson: string;
  reason: string;
  tag: string;
}
