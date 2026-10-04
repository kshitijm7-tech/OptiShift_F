// Typed client for the OptiShift backend branch (FastAPI, :8002).
// Base URL comes from VITE_API_URL; defaults to the local backend branch.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8002';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ── Backend DTOs (mirror backend/app/models) ────────────────────────────────

export interface BackendAvailability {
  day: string;
  available: boolean;
  preferred_shifts: string[];
}

export interface BackendEmployee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  hourly_rate: number;
  max_hours_per_week: number;
  availability: BackendAvailability[];
  email?: string | null;
}

export interface BackendShift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  hours: number;
  required_staff: number;
  required_skills: string[];
}

export interface BackendMetrics {
  labor_cost: number;
  coverage: number;
  overtime_hours: number;
  fairness_score: number;
  availability_violations: number;
  skill_violations: number;
  savings?: number | null;
  savings_percentage?: number | null;
}

export interface BackendAssignment {
  employee_id: string;
  employee_name: string;
  shift_id: string;
  shift_name: string;
  day: string;
  date: string;
  hours: number;
  cost: number;
}

export interface BackendOptimizationResult {
  status: string;
  message?: string | null;
  week_start: string;
  optimized_metrics?: BackendMetrics | null;
  baseline_metrics?: BackendMetrics | null;
  assignments: BackendAssignment[];
  infeasibility_causes: string[];
}

export type BackendLeaveStatus = 'pending' | 'approved' | 'rejected';

export interface BackendLeave {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
  status: BackendLeaveStatus;
  manager_note?: string | null;
}

export interface BackendDiffAssignment {
  employee: string;
  shift: string;
  date: string;
}

export interface BackendDiff {
  removed_assignments: BackendDiffAssignment[];
  added_assignments: BackendDiffAssignment[];
  affected_tasks: string[];
  affected_employees: string[];
}

export interface BackendReoptimizeResult {
  status: string;
  message?: string | null;
  infeasibility_causes?: string[];
  before_metrics?: BackendMetrics | null;
  after_metrics?: BackendMetrics | null;
  diff?: BackendDiff | null;
  new_assignments?: BackendAssignment[];
}

// ── Transport ───────────────────────────────────────────────────────────────

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toDetail(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
    return JSON.stringify(detail);
  }
  if (typeof body === 'string' && body.length > 0) return body;
  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init
    });
  } catch {
    throw new ApiError(0, 'Could not reach the OptiShift backend.');
  }
  const body = await parseBody(response);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      toDetail(body, `Request failed (${response.status}).`)
    );
  }
  return body as T;
}

// ── Endpoints ───────────────────────────────────────────────────────────────

export function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>('/health');
}

export function getEmployees(): Promise<BackendEmployee[]> {
  return request<BackendEmployee[]>('/api/v1/employees/');
}

export function createEmployee(
  payload: Partial<BackendEmployee> & { id: string; name: string; role: string }
): Promise<BackendEmployee> {
  return request<BackendEmployee>('/api/v1/employees/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getShifts(): Promise<BackendShift[]> {
  return request<BackendShift[]>('/api/v1/shifts/');
}

export function optimizeWeek(
  weekStart: string,
  approvedLeaveIds: string[] = []
): Promise<BackendOptimizationResult> {
  return request<BackendOptimizationResult>('/api/v1/optimize', {
    method: 'POST',
    body: JSON.stringify({
      week_start: weekStart,
      approved_leave_ids: approvedLeaveIds,
      include_baseline: true
    })
  });
}

export function reoptimizeAfterLeave(
  leaveId: string
): Promise<BackendReoptimizeResult> {
  return request<BackendReoptimizeResult>('/api/v1/reoptimize', {
    method: 'POST',
    body: JSON.stringify({ leave_id: leaveId })
  });
}

export function listLeaves(): Promise<BackendLeave[]> {
  return request<BackendLeave[]>('/api/v1/leave/');
}

export function submitLeave(payload: {
  id?: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
}): Promise<BackendLeave> {
  return request<BackendLeave>('/api/v1/leave/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function approveLeave(leaveId: string): Promise<BackendLeave> {
  return request<BackendLeave>(
    `/api/v1/leave/${encodeURIComponent(leaveId)}/approve`,
    { method: 'POST', body: JSON.stringify({}) }
  );
}

export function rejectLeave(leaveId: string): Promise<BackendLeave> {
  return request<BackendLeave>(
    `/api/v1/leave/${encodeURIComponent(leaveId)}/reject`,
    { method: 'POST', body: JSON.stringify({}) }
  );
}

export interface BackendAffectedShift {
  shift_id: string;
  shift: string;
  day: string;
  date: string;
  required_staff: number;
  assigned_before_leave: number;
  assigned_after_leave: number;
  missing_staff: number;
  replacement_available: boolean;
  replacement_candidates: string[];
  risk_level: string;
}

export interface BackendReplacementOption {
  employee_id: string;
  name: string;
  skill_match: boolean;
  available: boolean;
  current_hours: number;
  additional_hours: number;
}

export interface BackendLeaveImpact {
  leave_id: string;
  employee_id: string;
  employee_name: string;
  leave_dates: string[];
  overall_risk: string;
  overall_risk_reason: string;
  affected_tasks: { task_id: string; title: string; replacement_candidates: string[] }[];
  affected_shifts: BackendAffectedShift[];
  replacement_options: BackendReplacementOption[];
  summary: string;
  action_required: boolean;
  is_infeasible: boolean;
  infeasibility_message?: string | null;
}

export function getLeaveImpact(leaveId: string): Promise<BackendLeaveImpact> {
  return request<BackendLeaveImpact>(
    `/api/v1/leave/${encodeURIComponent(leaveId)}/impact`
  );
}

export function friendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return "Couldn't reach the OptiShift backend. Is it running on :8002?";
    }
    return error.message || 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
