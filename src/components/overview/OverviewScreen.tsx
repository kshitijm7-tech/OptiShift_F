import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';

export const OverviewScreen: React.FC = () => {
  const {
    overviewState,
    setOverviewState,
    setActiveScreen,
    triggerReoptimize,
    isOptimizing,
    metrics,
    comparison,
    approveLeaveRequest,
    setToastMessage
  } = useSchedule();

  const handleStateSelect = (state: 'state-ready' | 'state-attention' | 'state-updating' | 'state-empty') => {
    setOverviewState(state);
    if (state === 'state-ready') {
      setToastMessage('State A: Active schedule running smoothly.');
    } else if (state === 'state-attention') {
      setToastMessage('State B: 1 pending leave request requires review.');
    } else if (state === 'state-updating') {
      setToastMessage('State C: Leave approved, schedule needs auto-rebalance.');
    } else if (state === 'state-empty') {
      setToastMessage('State D: Empty store state loaded.');
    }
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* State Switcher Control Ribbon (Interactive Simulator for Judges) */}
      <div className="w-full bg-[#e1e8fd]/60 backdrop-blur-md px-4 py-2 rounded-xl shadow-xs mb-6 flex flex-wrap items-center justify-between gap-2 border border-[#dce2f7]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#166534] text-[18px]">tune</span>
          <span className="text-xs uppercase tracking-wider text-[#404940] font-bold">
            Store State Simulator:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleStateSelect('state-ready')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              overviewState === 'state-ready'
                ? 'bg-[#166534] text-white shadow-xs font-semibold'
                : 'text-[#404940] bg-white hover:bg-[#f1f3ff]'
            }`}
          >
            State A: Schedule Ready
          </button>
          <button
            onClick={() => handleStateSelect('state-attention')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              overviewState === 'state-attention'
                ? 'bg-[#166534] text-white shadow-xs font-semibold'
                : 'text-[#404940] bg-white hover:bg-[#f1f3ff]'
            }`}
          >
            State B: Attention Needed (Time Off)
          </button>
          <button
            onClick={() => handleStateSelect('state-updating')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              overviewState === 'state-updating'
                ? 'bg-[#166534] text-white shadow-xs font-semibold'
                : 'text-[#404940] bg-white hover:bg-[#f1f3ff]'
            }`}
          >
            State C: Needs Updating
          </button>
          <button
            onClick={() => handleStateSelect('state-empty')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              overviewState === 'state-empty'
                ? 'bg-[#166534] text-white shadow-xs font-semibold'
                : 'text-[#404940] bg-white hover:bg-[#f1f3ff]'
            }`}
          >
            State D: First Time (No Schedule)
          </button>
        </div>
      </div>

      {/* Main Active Canvas */}
      <div className="flex flex-col gap-6">
        {/* Header Block */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#166534] uppercase tracking-wider font-bold">
                Live Operational Sync
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#166534] animate-pulse"></span>
              <span className="text-xs text-[#707a6f]">
                UrbanBrew Café · Mumbai · Week of Oct 14 – Oct 20
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">
              {overviewState === 'state-empty' ? 'Welcome, Alex' : 'Good morning, Alex'}
            </h1>
            <p className="text-sm text-[#404940]">
              {overviewState === 'state-empty'
                ? "Let's set up your team schedule for Oct 14 – Oct 20."
                : overviewState === 'state-attention'
                ? 'There is 1 team request that needs your quick review today.'
                : overviewState === 'state-updating'
                ? 'Schedule needs a quick refresh to account for recent team time-off.'
                : 'Here’s how your team and schedule are looking today.'}
            </p>
          </div>

          {/* Action Cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => setActiveScreen('schedule')}
              className="px-4 py-2.5 bg-white text-[#141b2b] rounded-xl text-xs font-semibold shadow-xs hover:bg-[#f1f3ff] border border-[#e1e8fd] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>View Schedule</span>
            </button>
            <div className="flex flex-col items-center">
              <button
                onClick={triggerReoptimize}
                disabled={isOptimizing}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#166534] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#004c22] transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                <span className={`material-symbols-outlined text-[18px] ${isOptimizing ? 'animate-spin' : ''}`}>
                  {isOptimizing ? 'sync' : 'auto_fix_high'}
                </span>
                <span>{isOptimizing ? 'Solving Roster...' : 'Update Schedule'}</span>
              </button>
              <span className="text-[10px] text-[#707a6f] mt-0.5 text-center">
                Using latest team availability
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Notification Banners */}
        <div>
          {overviewState === 'state-ready' && (
            <div className="p-4 rounded-xl bg-white border border-[#e1e8fd] shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#b0f1c7] text-[#004c22]">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#141b2b]">
                    Weekly schedule is locked and running smoothly
                  </span>
                  <p className="text-xs text-[#707a6f] mt-0.5">
                    All 48 café shifts are assigned and accepted by your 8 team members.
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#166534] font-semibold flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-sm">check_circle</span> All Set
              </span>
            </div>
          )}

          {overviewState === 'state-attention' && (
            <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-amber-200 text-amber-900 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">notification_important</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950">
                      Your attention is needed: 1 pending request
                    </span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Action Needed
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium">
                    Priya Sharma requested Friday, Oct 18 off (Personal Time Off).
                  </p>
                  <p className="text-xs text-amber-800">
                    <strong className="font-semibold">Impact on store:</strong> If approved, Friday morning needs 1 replacement. Aisha Khan is available with 0 extra cost.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setActiveScreen('time-off')}
                  className="px-3.5 py-2 bg-white text-[#141b2b] rounded-lg text-xs font-medium shadow-xs hover:bg-amber-100 transition-colors"
                >
                  Review Details
                </button>
                <button
                  onClick={() => {
                    approveLeaveRequest('leave-1');
                    setOverviewState('state-updating');
                  }}
                  className="px-3.5 py-2 bg-[#166534] text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-[#004c22] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  <span>Approve & Update</span>
                </button>
              </div>
            </div>
          )}

          {overviewState === 'state-updating' && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#e1e8fd] border border-[#dce2f7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#b0f1c7] text-[#004c22] mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">sync_problem</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#141b2b]">
                      Schedule Needs Updating (1 Open Shift)
                    </span>
                    <span className="bg-white text-[#166534] text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Unsaved Changes
                    </span>
                  </div>
                  <p className="text-xs text-[#141b2b]">
                    Priya’s approved leave created an unfilled Friday Morning Barista shift.
                  </p>
                  <p className="text-xs text-[#404940]">
                    OptiShift found a match: Aisha Khan can take this shift without triggering overtime or exceeding budget.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={triggerReoptimize}
                  className="px-4 py-2 bg-[#166534] text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-[#004c22] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                  <span>Auto-Fill & Save</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* KPI Strip (6 Cards) */}
        <section className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 ${overviewState === 'state-empty' ? 'opacity-40' : ''}`}>
          {/* 1: Team */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex flex-col justify-between h-28 hover:shadow-sm transition-shadow">
            <span className="text-[11px] uppercase tracking-wide text-[#707a6f] font-semibold">Active Team</span>
            <div>
              <div className="text-2xl font-bold text-[#141b2b] tracking-tight tabular-nums">
                {overviewState === 'state-empty' ? '0 people' : `${metrics.activeStaffCount} people`}
              </div>
              <p className="text-xs text-[#707a6f] mt-1 truncate">All active & ready</p>
            </div>
          </div>

          {/* 2: Staffing Covered */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex flex-col justify-between h-28 hover:shadow-sm transition-shadow">
            <span className="text-[11px] uppercase tracking-wide text-[#707a6f] font-semibold">Staffing Covered</span>
            <div>
              <div className="text-2xl font-bold text-[#141b2b] tracking-tight tabular-nums">
                {overviewState === 'state-empty' ? '0%' : overviewState === 'state-updating' ? '98%' : `${metrics.coveragePercent}%`}
              </div>
              <p className="text-xs text-[#2d6a48] mt-1 truncate font-medium">
                {overviewState === 'state-empty' ? 'No shifts scheduled' : overviewState === 'state-updating' ? '1 shift open on Friday' : 'All planned shifts filled'}
              </p>
            </div>
          </div>

          {/* 3: Staff Cost */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex flex-col justify-between h-28 hover:shadow-sm transition-shadow">
            <span className="text-[11px] uppercase tracking-wide text-[#707a6f] font-semibold">Staff Cost</span>
            <div>
              <div className="text-2xl font-bold text-[#141b2b] tracking-tight tabular-nums">
                {overviewState === 'state-empty' ? '₹0' : overviewState === 'state-updating' ? '₹41,920' : `₹${metrics.totalCost.toLocaleString('en-IN')}`}
              </div>
              <p className="text-xs text-[#707a6f] mt-1 truncate">Estimated 7-day cost</p>
            </div>
          </div>

          {/* 4: Extra Hours */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex flex-col justify-between h-28 hover:shadow-sm transition-shadow">
            <span className="text-[11px] uppercase tracking-wide text-[#707a6f] font-semibold">Extra Hours</span>
            <div>
              <div className="text-2xl font-bold text-[#141b2b] tracking-tight tabular-nums">
                {overviewState === 'state-empty' ? '0 hrs' : `${metrics.overtimeHours} hrs`}
              </div>
              <p className="text-xs text-[#707a6f] mt-1 truncate">Within normal limits</p>
            </div>
          </div>

          {/* 5: Money Saved (Hero Highlighted in restrained green) */}
          <div className="bg-[#b0f1c7]/40 p-3.5 rounded-xl shadow-xs border border-[#b0f1c7] flex flex-col justify-between h-28 hover:shadow-sm transition-shadow">
            <span className="text-[11px] uppercase tracking-wide text-[#004c22] font-semibold">Money Saved</span>
            <div>
              <div className="text-2xl font-bold text-[#166534] tracking-tight tabular-nums">
                {overviewState === 'state-empty' ? '₹0' : `₹${metrics.savingsVsManual.toLocaleString('en-IN')}`}
              </div>
              <p className="text-xs text-[#2d6a48] mt-1 truncate font-medium">vs. manual scheduling</p>
            </div>
          </div>

          {/* 6: Work Balance */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex flex-col justify-between h-28 hover:shadow-sm transition-shadow">
            <span className="text-[11px] uppercase tracking-wide text-[#707a6f] font-semibold">Work Balance</span>
            <div>
              <div className="text-2xl font-bold text-[#141b2b] tracking-tight tabular-nums">
                {overviewState === 'state-empty' ? '0 / 100' : `${metrics.fairnessScore} / 100`}
              </div>
              <p className="text-xs text-[#707a6f] mt-1 truncate">Evenly distributed</p>
            </div>
          </div>
        </section>

        {/* Empty State View (When State D is active) */}
        {overviewState === 'state-empty' ? (
          <div className="bg-white p-12 rounded-2xl shadow-xs border border-[#e1e8fd] flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#166534] mb-4">
              <span className="material-symbols-outlined text-[36px]">calendar_add_on</span>
            </div>
            <h2 className="text-xl font-bold text-[#141b2b] mb-1">
              You don’t have a schedule for this week yet
            </h2>
            <p className="text-sm text-[#404940] max-w-lg mb-6 leading-relaxed">
              OptiShift can build your entire weekly schedule in under 10 seconds. It automatically respects team availability and covers your busy café hours with zero overtime.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  triggerReoptimize();
                  setOverviewState('state-ready');
                }}
                className="px-6 py-3 bg-[#166534] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#004c22] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Build My Schedule Now</span>
              </button>
              <button
                onClick={() => setOverviewState('state-ready')}
                className="px-5 py-3 bg-[#f1f3ff] text-[#141b2b] rounded-xl text-xs font-semibold hover:bg-[#e1e8fd] transition-colors"
              >
                Import from Past Week
              </button>
            </div>
            <p className="text-xs text-[#707a6f] mt-4">
              8 team members ready · Store hours: 7:00 AM - 11:30 PM
            </p>
          </div>
        ) : (
          /* Main Operational Workspace Grid (2 Columns: 7 left / 5 right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Daily Staffing & Real-Time Roster (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Today's Schedule Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f1f3ff]">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#166534] text-[22px]">event</span>
                    <div>
                      <h2 className="font-bold text-base text-[#141b2b]">Today's Shifts &amp; Daily Staffing</h2>
                      <p className="text-xs text-[#707a6f]">Tuesday, Oct 15 · UrbanBrew Espresso &amp; Counter</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#b0f1c7] text-[#004c22] px-2.5 py-1 rounded-full font-bold">
                    7 / 7 Present Today
                  </span>
                </div>

                {/* Morning Shift Bar */}
                <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col gap-2 border border-[#e1e8fd]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-700 text-[18px]">wb_sunny</span>
                      <span className="text-xs font-bold text-[#141b2b]">Morning Shift</span>
                      <span className="text-xs text-[#707a6f]">7:00 AM – 3:30 PM</span>
                    </div>
                    <span className="text-[11px] text-[#2d6a48] bg-white px-2 py-0.5 rounded-full font-semibold border border-[#e1e8fd]">
                      3 of 3 assigned · Fully staffed
                    </span>
                  </div>

                  {/* Personnel List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e1e8fd]">
                      <div className="w-6 h-6 rounded-full bg-[#e1e8fd] flex items-center justify-center text-[10px] font-bold text-[#141b2b]">RV</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#141b2b] truncate">Rahul V.</div>
                        <div className="text-[10px] text-[#707a6f] truncate">Lead Barista</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e1e8fd]">
                      <div className="w-6 h-6 rounded-full bg-[#e1e8fd] flex items-center justify-center text-[10px] font-bold text-[#141b2b]">AK</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#141b2b] truncate">Aisha K.</div>
                        <div className="text-[10px] text-[#707a6f] truncate">Counter Service</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e1e8fd]">
                      <div className="w-6 h-6 rounded-full bg-[#e1e8fd] flex items-center justify-center text-[10px] font-bold text-[#141b2b]">VM</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#141b2b] truncate">Vikram M.</div>
                        <div className="text-[10px] text-[#707a6f] truncate">Kitchen Prep</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evening Shift Bar */}
                <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col gap-2 border border-[#e1e8fd]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-700 text-[18px]">nights_stay</span>
                      <span className="text-xs font-bold text-[#141b2b]">Evening Shift</span>
                      <span className="text-xs text-[#707a6f]">3:00 PM – 11:30 PM</span>
                    </div>
                    <span className="text-[11px] text-[#2d6a48] bg-white px-2 py-0.5 rounded-full font-semibold border border-[#e1e8fd]">
                      4 of 4 assigned · Fully staffed
                    </span>
                  </div>

                  {/* Personnel List */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e1e8fd]">
                      <div className="w-6 h-6 rounded-full bg-[#e1e8fd] flex items-center justify-center text-[10px] font-bold text-[#141b2b]">KN</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#141b2b] truncate">Kavita N.</div>
                        <div className="text-[10px] text-[#707a6f] truncate">Shift Supervisor</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e1e8fd]">
                      <div className="w-6 h-6 rounded-full bg-[#e1e8fd] flex items-center justify-center text-[10px] font-bold text-[#141b2b]">AP</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#141b2b] truncate">Arjun P.</div>
                        <div className="text-[10px] text-[#707a6f] truncate">Barista</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e1e8fd]">
                      <div className="w-6 h-6 rounded-full bg-[#e1e8fd] flex items-center justify-center text-[10px] font-bold text-[#141b2b]">SR</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#141b2b] truncate">Sneha R.</div>
                        <div className="text-[10px] text-[#707a6f] truncate">Cashier & Floor</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e1e8fd]">
                      <div className="w-6 h-6 rounded-full bg-[#e1e8fd] flex items-center justify-center text-[10px] font-bold text-[#141b2b]">DL</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#141b2b] truncate">David L.</div>
                        <div className="text-[10px] text-[#707a6f] truncate">Counter Help</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day footnote */}
                <div className="flex items-center justify-between pt-1 text-[#707a6f] text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">person_off</span>
                    1 team member off today (Priya Sharma · Regular Day Off).
                  </span>
                  <button
                    onClick={() => setActiveScreen('schedule')}
                    className="text-xs text-[#166534] font-semibold hover:underline"
                  >
                    Full Day Roster →
                  </button>
                </div>
              </div>

              {/* Weekly Operational Impact Comparison Table */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f3ff]">
                  <div>
                    <h2 className="font-bold text-base text-[#141b2b]">How This Schedule Helps Your Business</h2>
                    <p className="text-xs text-[#707a6f]">Real comparison against standard fixed scheduling patterns</p>
                  </div>
                  <div className="bg-[#b0f1c7] text-[#004c22] text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    Optimized
                  </div>
                </div>

                {/* Comparison Metrics Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f1f3ff] text-[#707a6f] uppercase font-bold text-[10px] tracking-wider">
                        <th className="py-2.5 px-3 rounded-l-lg">Metric</th>
                        <th className="py-2.5 px-3">Usual Way (Manual)</th>
                        <th className="py-2.5 px-3">OptiShift Schedule</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg">Store Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f3ff]">
                      <tr className="hover:bg-[#f1f3ff]/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#141b2b]">Staff Cost</td>
                        <td className="py-3 px-3 text-[#707a6f] tabular-nums">₹{comparison.staffCostManual.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-bold text-[#166534] tabular-nums">₹{comparison.staffCostOpti.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-right font-bold text-[#166534]">
                          <span className="inline-flex items-center gap-0.5 bg-[#b0f1c7]/60 px-2 py-0.5 rounded-full text-[11px]">
                            -₹{Math.abs(comparison.costDelta).toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f1f3ff]/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#141b2b]">Shifts Covered</td>
                        <td className="py-3 px-3 text-[#707a6f]">{comparison.coverageManual}</td>
                        <td className="py-3 px-3 font-semibold text-[#141b2b]">{comparison.coverageOpti}</td>
                        <td className="py-3 px-3 text-right font-medium text-[#2d6a48]">
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold">
                            {comparison.coverageDiff}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f1f3ff]/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#141b2b]">Extra Overtime</td>
                        <td className="py-3 px-3 text-amber-700">{comparison.overtimeManualHours} hrs overtime</td>
                        <td className="py-3 px-3 font-bold text-[#166534]">{comparison.overtimeOptiHours} hrs</td>
                        <td className="py-3 px-3 text-right font-medium text-[#2d6a48]">
                          <span className="text-[11px] font-semibold">Zero overtime cost</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f1f3ff]/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#141b2b]">Scheduling Conflicts</td>
                        <td className="py-3 px-3 text-red-600">{comparison.conflictsManual} overlap clashes</td>
                        <td className="py-3 px-3 font-bold text-[#166534]">{comparison.conflictsOpti} issues</td>
                        <td className="py-3 px-3 text-right font-medium text-[#2d6a48]">
                          <span className="material-symbols-outlined text-[18px] text-[#166534] align-middle">
                            check_circle
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Plain Language Summary */}
                <div className="bg-[#f1f3ff] p-3.5 rounded-xl flex items-start gap-2.5 border border-[#e1e8fd]">
                  <span className="material-symbols-outlined text-[#166534] text-[20px] mt-0.5">lightbulb</span>
                  <div>
                    <p className="text-xs font-bold text-[#141b2b]">Why this saves you money:</p>
                    <p className="text-xs text-[#404940] leading-relaxed mt-0.5">
                      You saved ₹5,670 this week by matching shift start times with peak customer rush hours (8:30–11:00 AM &amp; 5:00–7:30 PM) and completely eliminating unplanned overtime.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Context, Visuals & Activity Log (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Store Presence Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#141b2b]">Store Presence</h3>
                  <span className="text-xs text-[#707a6f]">Mumbai Outlet</span>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative rounded-xl overflow-hidden h-28 bg-[#f1f3ff] shadow-xs">
                    <img
                      className="w-full h-full object-cover"
                      alt="Modern café interior"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0vg-owPFtvyd-opCMaTuh7aHvtALXpiEX9qATZ2-otzqzjWzsKPJCoJbPG5NqhHVvN5JMcSg-fMQW5SJjOzvE8w7dXuCwRXZNEd8iqOQSWg7N3MrYgOFfxsjxHy6q1ZIH3W-xS-8DcGo1X8GsYcyrbq1LJH48XYngLZ9BRlsSoBXYtHtg2VhjuBFvdOddShrHeRGkSp7PeULOqnJoRsU29CtLPWrTsBPVtHWiBlwLszf_vD8b6FMz"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-xs text-white font-medium">Coffee Bar &amp; Floor</span>
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden h-28 bg-[#f1f3ff] shadow-xs">
                    <img
                      className="w-full h-full object-cover"
                      alt="Barista brewing coffee"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFYBdCQU_2ivXe3tBcl5as2Y5xMEJ2Ni2q17T1-jG_NrE991MflzU_xR0HGG6uraBVxVuPKUkATkNeUIrItI9Wa3uaIAp7f0zRoHKNnXrf1ZBqe-oMtsqzFLayoK9VI3OYVF8vs8l09kZcxBgx1nH-58G9rYduEtZbUXmSE9QacxH5lSX5fNgew0CflbEw5thI18k2b8_9V8mhdh-M_ZSdGNpQEvq-chTNzavaXNki8az1kcYqxj_3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-xs text-white font-medium">Shift Crew Ready</span>
                    </div>
                  </div>
                </div>

                {/* Customer Rush Trend Sparkline */}
                <div className="bg-[#f1f3ff] p-3.5 rounded-xl flex flex-col gap-1 border border-[#e1e8fd]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-[#707a6f]">
                      Rush Hours vs Staff On Floor
                    </span>
                    <span className="text-xs text-[#166534] font-bold">100% Match</span>
                  </div>
                  {/* Hourly Distribution Visual */}
                  <div className="h-16 w-full pt-1 flex items-end justify-between">
                    <svg className="w-full h-full text-[#166534]" preserveAspectRatio="none" viewBox="0 0 240 50">
                      <path
                        className="opacity-80"
                        d="M 0,40 Q 30,38 50,15 T 90,30 T 130,42 T 170,10 T 210,25 T 240,45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                      <path
                        className="opacity-15"
                        d="M 0,40 Q 30,38 50,15 T 90,30 T 130,42 T 170,10 T 210,25 T 240,45 L 240,50 L 0,50 Z"
                        fill="currentColor"
                      />
                      <circle className="fill-[#166534]" cx="50" cy="15" r="3" />
                      <circle className="fill-[#166534]" cx="170" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#707a6f] pt-1 border-t border-[#e1e8fd]">
                    <span>7 AM (Open)</span>
                    <span className="font-semibold text-[#141b2b]">9 AM Peak (3 staff)</span>
                    <span className="font-semibold text-[#141b2b]">6 PM Peak (4 staff)</span>
                    <span>11 PM (Close)</span>
                  </div>
                </div>
              </div>

              {/* Recent Team Activity Feed */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] flex flex-col gap-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f3ff]">
                  <h3 className="font-bold text-base text-[#141b2b]">Recent Team Activity</h3>
                  <span className="material-symbols-outlined text-[18px] text-[#707a6f]">history</span>
                </div>
                <div className="flex flex-col gap-2.5 divide-y divide-[#f1f3ff]">
                  <div className="flex items-start gap-2.5 pt-1 first:pt-0">
                    <div className="p-1.5 rounded-lg bg-[#b0f1c7]/40 text-[#166534] mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#141b2b]">Schedule updated</span>
                        <span className="text-[10px] text-[#707a6f]">Today 10:42 AM</span>
                      </div>
                      <p className="text-xs text-[#707a6f] truncate">Yielded ₹5,670 savings, 100% shifts covered</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">event_busy</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#141b2b]">Time off requested</span>
                        <span className="text-[10px] text-[#707a6f]">Today 9:18 AM</span>
                      </div>
                      <p className="text-xs text-[#707a6f] truncate">Priya Sharma requested Friday, Oct 18 off</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2">
                    <div className="p-1.5 rounded-lg bg-[#f1f3ff] text-[#707a6f] mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#141b2b]">Hours updated</span>
                        <span className="text-[10px] text-[#707a6f]">Yesterday 2:10 PM</span>
                      </div>
                      <p className="text-xs text-[#707a6f] truncate">Aisha Khan updated availability for Thursday</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2">
                    <div className="p-1.5 rounded-lg bg-[#f1f3ff] text-[#707a6f] mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">bookmark_added</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#141b2b]">Schedule template loaded</span>
                        <span className="text-[10px] text-[#707a6f]">Oct 12 11:00 AM</span>
                      </div>
                      <p className="text-xs text-[#707a6f] truncate">Fall Café Schedule applied successfully</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
