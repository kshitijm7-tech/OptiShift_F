import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { LeaveRequest } from '../../types';
import { AddTimeOffModal } from './AddTimeOffModal';
import { ApproveLeaveModal } from './ApproveLeaveModal';

export const TimeOffScreen: React.FC = () => {
  const {
    leaveRequests,
    upcomingLeaves,
    pastLeaves,
    approveLeaveRequest,
    rejectLeaveRequest,
    triggerReoptimize,
    isOptimizing,
    setToastMessage
  } = useSchedule();

  const [simState, setSimState] = useState<string>('default');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState<LeaveRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'waiting' | 'past'>('all');
  const [showPastSection, setShowPastSection] = useState(false);

  // Active pending requests
  const pendingRequests = leaveRequests.filter(l => l.status === 'pending');

  const handleSimState = (stateKey: string) => {
    setSimState(stateKey);
    if (stateKey === 'default') {
      setToastMessage('Simulator: Default pending triage loaded.');
    } else if (stateKey === 'approve-modal') {
      const priya = leaveRequests.find(l => l.employeeId === 'emp-priya') || leaveRequests[0];
      setApprovingRequest(priya);
    } else if (stateKey === 'impact-warning') {
      setToastMessage('Warning: Approved leave on Friday will create an uncrewed morning slot.');
    } else if (stateKey === 'updating') {
      triggerReoptimize();
    } else if (stateKey === 'updated-success') {
      setToastMessage('Schedule automatically rebalanced! All slots covered.');
    } else if (stateKey === 'conflict') {
      setToastMessage('Conflict detected: No available Barista without statutory overtime.');
    } else if (stateKey === 'empty') {
      setToastMessage('Simulated empty queue: 0 pending requests.');
    }
  };

  const handleApproveClick = (req: LeaveRequest) => {
    if (req.employeeId === 'emp-priya') {
      setApprovingRequest(req);
    } else {
      approveLeaveRequest(req.id);
    }
  };

  const confirmApprovalWithSwap = () => {
    if (approvingRequest) {
      approveLeaveRequest(approvingRequest.id);
      setApprovingRequest(null);
      triggerReoptimize();
    }
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Interactive Prototype State Controller Bar */}
      <div className="sticky top-0 z-30 mb-6 flex items-center justify-between rounded-xl bg-[#f1f3ff] px-4 py-2 shadow-xs border border-[#e1e8fd]">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-[#404940] text-xs uppercase tracking-wider font-bold pr-1">
            <span className="material-symbols-outlined text-[18px] text-[#166534]">tune</span>
            <span>State Simulator:</span>
          </div>
          <button
            onClick={() => handleSimState('default')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              simState === 'default'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            Default (Pending Triage)
          </button>
          <button
            onClick={() => handleSimState('approve-modal')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              simState === 'approve-modal'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            Approve Flow Modal
          </button>
          <button
            onClick={() => handleSimState('impact-warning')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              simState === 'impact-warning'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            Schedule Impact Warning
          </button>
          <button
            onClick={() => handleSimState('updating')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              simState === 'updating'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            Updating Schedule...
          </button>
          <button
            onClick={() => handleSimState('updated-success')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              simState === 'updated-success'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            Schedule Updated Success
          </button>
          <button
            onClick={() => handleSimState('conflict')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              simState === 'conflict'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-red-600 hover:bg-red-50'
            }`}
          >
            No Replacement Conflict
          </button>
          <button
            onClick={() => handleSimState('empty')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              simState === 'empty'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            Empty State
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 pl-4 text-[#404940] text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse"></span>
          <span>Solver Engine Active</span>
        </div>
      </div>

      {/* Simulator Transient Banners */}
      <div className="space-y-3 mb-6">
        {simState === 'updated-success' && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#b0f1c7]/60 border border-[#b0f1c7] text-[#004c22] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#004c22]">Schedule automatically rebalanced</span>
                <span className="text-xs text-[#2d6a48]">
                  Priya's time off is now reflected. <strong>Aisha Khan</strong> has been assigned to Friday Morning (7:00–15:30) with 0 overtime impact.
                </span>
              </div>
            </div>
            <button
              onClick={() => setSimState('default')}
              className="px-3 py-1 bg-white text-[#141b2b] rounded-lg text-xs font-semibold shadow-xs hover:bg-[#f1f3ff]"
            >
              Dismiss
            </button>
          </div>
        )}

        {simState === 'conflict' && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">error_outline</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-red-900">We couldn't auto-resolve shift coverage</span>
                <span className="text-xs text-red-700">
                  Friday, 18 Oct Morning shift lacks 1 certified Barista. All alternate qualified baristas are at weekly statutory hour maximums.
                </span>
              </div>
            </div>
            <button
              onClick={() => setSimState('default')}
              className="px-3 py-1 bg-white text-red-900 rounded-lg text-xs font-semibold shadow-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {isOptimizing && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#e1e8fd] border border-[#dce2f7] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0 animate-spin">
                <span className="material-symbols-outlined text-[18px]">sync</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#166534]">Running shift constraint solver...</span>
                <span className="text-xs text-[#707a6f]">Scanning availability profiles, role certifications, and rest turnaround thresholds.</span>
              </div>
            </div>
            <div className="w-32 bg-white rounded-full h-2 overflow-hidden shadow-inner border border-[#dce2f7]">
              <div className="bg-[#166534] h-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Page Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">Time Off</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f1f3ff] text-[#141b2b] text-xs font-bold border border-[#e1e8fd]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
              {simState === 'empty' ? '0 Requests Waiting' : `${pendingRequests.length} Requests Waiting`}
            </span>
          </div>
          <p className="text-sm text-[#707a6f] mt-0.5">
            See when your team can't work and manage their leave requests.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerReoptimize}
            disabled={isOptimizing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold shadow-xs border border-[#e1e8fd] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#2d6a48]">auto_fix_high</span>
            <span>Update Schedule</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#004c22] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Time Off</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#707a6f]">Review Queue</span>
            <span className="w-2 h-2 rounded-full bg-[#166534] animate-ping"></span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#141b2b] tabular-nums">
              {simState === 'empty' ? '0' : pendingRequests.length}
            </span>
            <span className="text-xs text-[#707a6f]">waiting approval</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#707a6f]">
            <span className="material-symbols-outlined text-[16px] text-[#166534]">priority_high</span>
            <span>Action required before Friday roster run</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#707a6f]">Active Today</span>
            <span className="px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-[10px] font-bold">On Leave</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#141b2b] tabular-nums">1</span>
            <span className="text-xs text-[#707a6f]">person off</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#141b2b]">
            <span className="material-symbols-outlined text-[16px] text-[#2d6a48]">person</span>
            <span className="font-bold">Priya Sharma</span>
            <span className="text-[#707a6f]">· Personal (Full Day)</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#707a6f]">Next 14 Days</span>
            <span className="material-symbols-outlined text-[#707a6f] text-[18px]">date_range</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#141b2b] tabular-nums">3</span>
            <span className="text-xs text-[#707a6f]">upcoming leaves</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#707a6f]">
            <span className="material-symbols-outlined text-[16px] text-[#166534]">check_circle</span>
            <span>Already accommodated in draft</span>
          </div>
        </div>

        {/* Context explanation */}
        <div className="bg-[#f1f3ff] rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[#166534] text-[11px] font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Smart Availability Sync</span>
          </div>
          <p className="text-xs text-[#404940] leading-relaxed">
            Approved time off is locked as <strong>unavailable time</strong> in the solver. Shifts are reassigned using qualified staff to prevent overtime penalties.
          </p>
        </div>
      </div>

      {/* SECTION 1: Needs Your Attention */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#141b2b]">Needs Your Attention</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#166534]/10 text-[#166534] text-xs font-bold">
              {simState === 'empty' ? '0 waiting' : `${pendingRequests.length} waiting`}
            </span>
          </div>
          <span className="text-xs text-[#707a6f]">Review promptly to prevent scheduling bottlenecks</span>
        </div>

        {simState === 'empty' || pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#e1e8fd] shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#b0f1c7]/60 text-[#166534] mx-auto flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <h3 className="font-bold text-base text-[#141b2b]">You're all caught up!</h3>
            <p className="text-xs text-[#707a6f] mt-1 max-w-md mx-auto">
              There are no pending time-off requests waiting for review. All future leaves are reflected in the current shift plan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col justify-between hover:shadow-sm transition-all"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {req.employeeAvatar ? (
                        <img
                          src={req.employeeAvatar}
                          alt={req.employeeName}
                          className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-[#e1e8fd]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#e1e8fd] text-[#141b2b] flex items-center justify-center font-bold text-xs">
                          {req.employeeName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#141b2b]">{req.employeeName}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#f1f3ff] text-[#707a6f]">
                            Staff
                          </span>
                        </div>
                        <span className="text-xs text-[#707a6f]">{req.employeeRole}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold">
                      {req.category}
                    </span>
                  </div>

                  {/* Shift Context */}
                  <div className="space-y-1 mb-3 text-xs">
                    <div className="flex items-center gap-2 text-[#141b2b] font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-[#2d6a48]">calendar_today</span>
                      <span>{req.dateStr}</span>
                    </div>
                    <p className="text-[#404940] pl-6 italic">"{req.reasonNote}"</p>
                  </div>

                  {/* Impact Notice */}
                  <div className="p-3 rounded-xl bg-[#f1f3ff] flex items-start gap-2.5 mb-3 border border-[#e1e8fd]">
                    <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">warning</span>
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-[#141b2b] block">{req.scheduledShift}</span>
                      <span className="text-[#404940]">{req.impactNotice}</span>
                    </div>
                  </div>

                  <div className="text-[#707a6f] text-[11px] mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>Requested · {req.submittedAt}</span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-3 border-t border-[#f1f3ff]">
                  <button
                    onClick={() =>
                      alert(
                        `Shift History for ${req.employeeName}:\n\n` +
                          `• Attendance Reliability: 99.2%\n` +
                          `• Completed Shifts This Month: 18\n` +
                          `• Leave Accrual Balance: 4.5 days\n` +
                          `• Shift Category: ${req.category}`
                      )
                    }
                    className="text-[#166534] hover:underline text-xs font-semibold flex items-center gap-0.5"
                  >
                    <span>View shift history</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectLeaveRequest(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveClick(req)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004c22] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Schedule Connection Notice / Rebalance Prompt */}
      <section className="mb-6">
        <div className="bg-gradient-to-r from-[#f1f3ff] via-white to-[#f1f3ff] rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#b0f1c7] text-[#004c22] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">sync_alt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#141b2b]">Schedule may need updating</h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#e1e8fd] text-[#166534] font-bold">
                  1 open shift
                </span>
              </div>
              <p className="text-xs text-[#707a6f] mt-1 max-w-2xl leading-relaxed">
                Priya Sharma is currently scheduled to work Friday Morning. Once approved, click <strong>Update Schedule</strong> to automatically find an available replacement with matching barista skills without adding overtime.
              </p>
            </div>
          </div>
          <button
            onClick={triggerReoptimize}
            disabled={isOptimizing}
            className="px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#004c22] text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
            <span>Update Schedule</span>
          </button>
        </div>
      </section>

      {/* SECTION 3: Upcoming Approved Time Off (Table) */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl shadow-xs border border-[#e1e8fd] overflow-hidden">
          {/* Header & Filter Tabs */}
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f1f3ff]">
            <div>
              <h2 className="font-bold text-base text-[#141b2b]">Upcoming Approved Time Off</h2>
              <p className="text-xs text-[#707a6f]">Scheduled absences booked in advance across the next 30 days</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px]">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#707a6f] text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search team member..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#f1f3ff] text-xs text-[#141b2b] placeholder:text-[#707a6f] focus:outline-none border border-[#e1e8fd]"
                />
              </div>

              <div className="flex items-center bg-[#f1f3ff] p-1 rounded-xl text-xs">
                {(
                  [
                    { id: 'all', label: `All (${upcomingLeaves.length})` },
                    { id: 'approved', label: 'Approved (3)' },
                    { id: 'waiting', label: `Waiting (${pendingRequests.length})` },
                    { id: 'past', label: `Past (${pastLeaves.length})` }
                  ] as const
                ).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'font-bold bg-white text-[#141b2b] shadow-xs'
                        : 'text-[#404940] hover:text-[#141b2b]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f1f3ff] text-[#707a6f] uppercase font-bold text-[10px] tracking-wider border-b border-[#e1e8fd]">
                  <th className="px-5 py-2.5">Team Member</th>
                  <th className="px-4 py-2.5">Dates &amp; Duration</th>
                  <th className="px-4 py-2.5">Reason</th>
                  <th className="px-4 py-2.5">Origin</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3ff]">
                {upcomingLeaves
                  .filter(l => l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(row => (
                    <tr key={row.id} className="hover:bg-[#f1f3ff]/40 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {row.avatarUrl ? (
                            <img
                              src={row.avatarUrl}
                              alt={row.employeeName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#b0f1c7] text-[#004c22] flex items-center justify-center font-bold text-xs">
                              {row.initials}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-[#141b2b] block">{row.employeeName}</span>
                            <span className="text-[11px] text-[#707a6f]">{row.employeeRole}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#141b2b] block">{row.dateStr}</span>
                        <span className="text-[11px] text-[#707a6f]">{row.duration}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f1f3ff] text-[#141b2b] text-[10px] font-semibold border border-[#e1e8fd]">
                          {row.reason}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#707a6f] text-[11px]">{row.origin}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setToastMessage(`Viewing leave ticket for ${row.employeeName}`)}
                          className="p-1 rounded-lg text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff]"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 bg-[#f1f3ff]/60 border-t border-[#e1e8fd] flex items-center justify-between text-xs text-[#707a6f]">
            <span>Showing {upcomingLeaves.length} upcoming scheduled absences</span>
            <button
              onClick={() => setToastMessage('Exporting iCal calendar sync...')}
              className="text-[#166534] hover:underline font-semibold"
            >
              Download Leave Calendar (iCal/CSV) →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: Past Time Off (Collapsible) */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl shadow-xs border border-[#e1e8fd] p-5">
          <div
            onClick={() => setShowPastSection(prev => !prev)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#707a6f]">
                {showPastSection ? 'expand_less' : 'expand_more'}
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#141b2b]">Past Time Off</h3>
                <span className="text-xs text-[#707a6f]">
                  Archived time-off records for previous operational cycles
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold border border-[#e1e8fd]">
              12 completed
            </span>
          </div>

          {showPastSection && (
            <div className="mt-4 pt-4 border-t border-[#f1f3ff] space-y-2 text-xs">
              {pastLeaves.map(pl => (
                <div
                  key={pl.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#f1f3ff] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#141b2b] w-32">{pl.employeeName}</span>
                    <span className="text-[#707a6f] w-36">{pl.dateStr}</span>
                    <span className="px-2 py-0.5 rounded bg-[#f1f3ff] text-[#707a6f] text-[10px]">
                      {pl.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[10px] ${
                        pl.status === 'Approved' ? 'text-[#166534]' : 'text-red-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          pl.status === 'Approved' ? 'bg-[#166534]' : 'bg-red-600'
                        }`}
                      ></span>
                      {pl.status}
                    </span>
                    <span className="text-[#707a6f] text-[11px]">{pl.resolvedNote}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Time Off Modal */}
      <AddTimeOffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Approve Leave Flow Modal */}
      <ApproveLeaveModal
        isOpen={!!approvingRequest}
        request={approvingRequest}
        onClose={() => setApprovingRequest(null)}
        onConfirm={confirmApprovalWithSwap}
      />
    </div>
  );
};
