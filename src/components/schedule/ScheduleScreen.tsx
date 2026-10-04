import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { DAYS_OF_WEEK } from '../../types';

export const ScheduleScreen: React.FC = () => {
  const {
    employees,
    schedule,
    scheduleScenario,
    setScheduleScenario,
    metrics,
    setShowWhatChangedModal,
    triggerReoptimize,
    isOptimizing,
    setToastMessage
  } = useSchedule();

  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'evening'>('all');
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [progressWidth, setProgressWidth] = useState<number>(30);

  const handleScenarioChange = (num: number) => {
    setScheduleScenario(num);
    if (num === 1) {
      setToastMessage('Scenario 1: Optimal 100% coverage schedule loaded.');
    } else if (num === 2) {
      setToastMessage('Scenario 2: Understaffed warning on Friday (Priya leave gap).');
    } else if (num === 3) {
      setShowWhatChangedModal(true);
    } else if (num === 4) {
      runProgressSimulation();
    } else if (num === 5) {
      setToastMessage('Scenario 5: Empty schedule state.');
    }
  };

  const runProgressSimulation = async () => {
    if (isOptimizing) return;
    setShowProgressModal(true);
    setProgressWidth(70);
    // Apply the real solver (live MILP API, local fallback offline).
    // The modal below only opens when the schedule actually changed.
    const applied = await triggerReoptimize();
    setProgressWidth(100);
    setShowProgressModal(false);
    if (applied) {
      setScheduleScenario(1);
      setShowWhatChangedModal(true);
    }
  };

  const isFridayUnderstaffed = scheduleScenario === 2;

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Interactive Scenario Switcher Banner for Evaluation */}
      <aside aria-label="Interactive State Switcher" className="mb-6 bg-white p-3 rounded-xl shadow-xs border border-[#e1e8fd] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#404940] text-xs uppercase tracking-wider font-bold pl-1">
          <span className="material-symbols-outlined text-[18px] text-[#166534]">science</span>
          <span>Simulate Scenarios:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleScenarioChange(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scheduleScenario === 1
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#404940] bg-[#f1f3ff] hover:bg-[#e1e8fd]'
            }`}
          >
            1. Full Schedule (Optimal)
          </button>
          <button
            onClick={() => handleScenarioChange(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scheduleScenario === 2
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#404940] bg-[#f1f3ff] hover:bg-[#e1e8fd]'
            }`}
          >
            2. Understaffed Warning (Friday)
          </button>
          <button
            onClick={() => handleScenarioChange(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scheduleScenario === 3
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#404940] bg-[#f1f3ff] hover:bg-[#e1e8fd]'
            }`}
          >
            3. What Changed Modal
          </button>
          <button
            onClick={() => handleScenarioChange(4)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#404940] bg-[#f1f3ff] hover:bg-[#e1e8fd] transition-all"
          >
            4. Updating Progress
          </button>
          <button
            onClick={() => handleScenarioChange(5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scheduleScenario === 5
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#404940] bg-[#f1f3ff] hover:bg-[#e1e8fd]'
            }`}
          >
            5. Empty (No Schedule Yet)
          </button>
        </div>
      </aside>

      {/* Empty State View (Scenario 5) */}
      {scheduleScenario === 5 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl shadow-xs border border-[#e1e8fd] text-center max-w-xl mx-auto my-8">
          <div className="w-20 h-20 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#166534] mb-4 shadow-xs">
            <span className="material-symbols-outlined text-[40px]">calendar_add_on</span>
          </div>
          <h2 className="text-xl font-bold text-[#141b2b] mb-1">No schedule built yet for this week.</h2>
          <p className="text-sm text-[#707a6f] max-w-md mb-6 leading-relaxed">
            Tell us who can work and your store hours, and OptiShift will build your schedule in one click.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => void runProgressSimulation()}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] disabled:opacity-60 transition-all text-xs font-bold shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>{isOptimizing ? 'Building…' : 'Build My Schedule'}</span>
            </button>
            <button
              onClick={() => setScheduleScenario(1)}
              className="px-5 py-3 rounded-xl bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e1e8fd] text-xs font-semibold"
            >
              Load Sample Template
            </button>
          </div>
        </div>
      ) : (
        /* Workspace Loaded Display */
        <div className="flex flex-col w-full gap-5">
          {/* Header Area */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd]">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl font-bold text-[#141b2b] tracking-tight">Your Schedule</h1>
              <p className="text-xs text-[#707a6f]">
                See who is working each day and ensure every shift has enough people.
              </p>
            </div>

            {/* Controls & Navigation */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Date navigator */}
              <nav aria-label="Schedule Period Navigation" className="flex items-center bg-[#f1f3ff] p-1 rounded-xl">
                <button
                  aria-label="Previous Week"
                  onClick={() => setToastMessage('Showing previous weekly cycle')}
                  className="p-1 rounded-lg text-[#707a6f] hover:text-[#141b2b] hover:bg-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1 text-[#141b2b] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#166534]">calendar_month</span>
                  <span>This Week: Oct 14 – Oct 20</span>
                </div>
                <button
                  aria-label="Next Week"
                  onClick={() => setToastMessage('Showing next weekly cycle')}
                  className="p-1 rounded-lg text-[#707a6f] hover:text-[#141b2b] hover:bg-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </nav>

              {/* Filter pills */}
              <div className="flex items-center bg-[#f1f3ff] p-1 rounded-xl">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    activeFilter === 'all'
                      ? 'font-bold bg-white text-[#141b2b] shadow-xs'
                      : 'text-[#404940] hover:text-[#141b2b]'
                  }`}
                >
                  All Shifts
                </button>
                <button
                  onClick={() => setActiveFilter('morning')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    activeFilter === 'morning'
                      ? 'font-bold bg-white text-[#141b2b] shadow-xs'
                      : 'text-[#404940] hover:text-[#141b2b]'
                  }`}
                >
                  Morning (7:00–15:30)
                </button>
                <button
                  onClick={() => setActiveFilter('evening')}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    activeFilter === 'evening'
                      ? 'font-bold bg-white text-[#141b2b] shadow-xs'
                      : 'text-[#404940] hover:text-[#141b2b]'
                  }`}
                >
                  Evening (15:00–23:30)
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => void runProgressSimulation()}
                  disabled={isOptimizing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] disabled:opacity-60 transition-all text-xs font-semibold shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                  <span>{isOptimizing ? 'Updating…' : 'Update Schedule'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e1e8fd] transition-all text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Export / Print</span>
                </button>
              </div>
            </div>
          </header>

          {/* Weekly Summary KPI Strip */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f1f3ff] flex items-center justify-center text-[#166534] shrink-0">
                <span className="material-symbols-outlined text-[20px]">date_range</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707a6f] uppercase tracking-wider font-semibold">Duration</span>
                <span className="text-base font-bold text-[#141b2b]">7 Days</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#b0f1c7] flex items-center justify-center text-[#004c22] shrink-0">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707a6f] uppercase tracking-wider font-semibold">Active Staff</span>
                <span className="text-base font-bold text-[#141b2b]">{employees.length} Members</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isFridayUnderstaffed ? 'bg-amber-100 text-amber-800' : 'bg-[#b0f1c7] text-[#004c22]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isFridayUnderstaffed ? 'warning' : 'verified'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707a6f] uppercase tracking-wider font-semibold">Coverage Rate</span>
                <span className={`text-base font-bold ${isFridayUnderstaffed ? 'text-amber-700' : 'text-[#141b2b]'}`}>
                  {isFridayUnderstaffed ? '94% Covered' : '100% Covered'}
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f1f3ff] flex items-center justify-center text-[#2d6a48] shrink-0">
                <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707a6f] uppercase tracking-wider font-semibold">Extra Hours</span>
                <span className="text-base font-bold text-[#141b2b]">0 Overtime</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e1e8fd] flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#b0f1c7]/40 flex items-center justify-center text-[#166534] shrink-0">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707a6f] uppercase tracking-wider font-semibold">Est. Staff Cost</span>
                <span className="text-base font-bold text-[#166534] tabular-nums">
                  ₹{metrics.totalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </section>

          {/* Shift Fulfillment per Day Strip */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e1e8fd]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#141b2b] text-xs font-bold">
                <span className="material-symbols-outlined text-[18px] text-[#166534]">fact_check</span>
                <span>Shift Fulfillment per Day</span>
              </div>
              <span className="text-xs text-[#707a6f]">Store Requirement: Morning (3) · Evening (4)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5">
              {DAYS_OF_WEEK.map((day, idx) => {
                const isToday = idx === 1; // Tuesday
                const isFriday = idx === 4; // Friday
                const isFridayShort = isFriday && isFridayUnderstaffed;

                return (
                  <div
                    key={day.key}
                    className={`p-2.5 rounded-xl flex flex-col justify-between gap-1.5 transition-all border ${
                      isFridayShort
                        ? 'bg-amber-50 border-amber-300 shadow-xs'
                        : isToday
                        ? 'bg-[#e1e8fd] border-[#b0f1c7] shadow-xs'
                        : 'bg-[#f1f3ff] border-[#e1e8fd]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#141b2b]">{day.label}, Oct {day.dateNum}</span>
                        {isToday && (
                          <span className="px-1 py-0.2 bg-[#166534] text-white rounded text-[9px] uppercase font-bold tracking-wider">
                            Today
                          </span>
                        )}
                      </div>
                      {isFridayShort ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> 1 more needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#b0f1c7] text-[#004c22]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span> Fully staffed
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#404940]">
                      {isFridayShort ? (
                        <span className="text-amber-900 font-bold">Morn: 2/3 · Eve: 4/4</span>
                      ) : (
                        <span>
                          Morn: <strong>3/3</strong> · Eve: <strong>{idx === 6 ? '3/3' : '4/4'}</strong>
                        </span>
                      )}
                    </div>

                      {isFridayShort && (
                        <button
                          onClick={() => {
                            void runProgressSimulation();
                          }}
                          disabled={isOptimizing}
                          className="w-full mt-1 py-1 px-2 rounded-md bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">build</span>
                          <span>{isOptimizing ? 'Fixing…' : 'Auto-Fix Gap'}</span>
                        </button>
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Weekly Schedule Matrix */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#e1e8fd] overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <div className="min-w-[1080px] flex flex-col">
                {/* Table Header Row */}
                <div className="grid grid-cols-[260px_repeat(7,1fr)] bg-[#f1f3ff] py-2.5 px-4 text-[#141b2b] text-xs font-bold uppercase tracking-wider border-b border-[#e1e8fd]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#707a6f]">badge</span>
                    <span>Team Member</span>
                  </div>
                  {DAYS_OF_WEEK.map((d, i) => (
                    <div
                      key={d.key}
                      className={`text-center ${
                        i === 1 ? 'font-bold text-[#166534] flex items-center justify-center gap-1' : ''
                      }`}
                    >
                      <span>{d.label} {d.dateNum}</span>
                      {i === 1 && <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>}
                    </div>
                  ))}
                </div>

                {/* Employee Rows */}
                {employees.map(emp => {
                  const empSchedule = schedule[emp.id] || {};

                  return (
                    <div
                      key={emp.id}
                      className="grid grid-cols-[260px_repeat(7,1fr)] items-center px-4 py-3 border-b border-[#f1f3ff] hover:bg-[#f1f3ff]/50 transition-colors"
                    >
                      {/* Person info */}
                      <div className="flex items-center gap-3 pr-2">
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#e1e8fd] text-[#141b2b] font-bold text-xs flex items-center justify-center shrink-0">
                            {emp.initials}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#141b2b] truncate">{emp.name}</span>
                          <span className="text-[11px] text-[#707a6f] truncate">{emp.role}</span>
                          <span className="text-[10px] text-[#166534] font-semibold">{emp.assignedHours} hrs assigned</span>
                        </div>
                      </div>

                      {/* Mon to Sun shift cells */}
                      {DAYS_OF_WEEK.map((day, dayIndex) => {
                        let cell = empSchedule[dayIndex] || { shiftId: 'off', label: 'Day Off' };

                        // If Scenario 2 (Understaffed on Friday), Aisha is shown as Day Off on Friday to simulate the gap!
                        if (isFridayUnderstaffed && emp.id === 'emp-aisha' && dayIndex === 4) {
                          cell = { shiftId: 'off', label: 'Day Off' };
                        }

                        // Filter opacity
                        const isFilteredOut =
                          (activeFilter === 'morning' && cell.shiftId !== 'morning') ||
                          (activeFilter === 'evening' && cell.shiftId !== 'evening');

                        return (
                          <div
                            key={day.key}
                            className={`p-1 transition-opacity ${isFilteredOut ? 'opacity-20' : 'opacity-100'}`}
                          >
                            {cell.shiftId === 'morning' ? (
                              <div className="bg-emerald-50 text-emerald-950 p-2 rounded-xl border border-emerald-200 flex flex-col gap-0.5 shadow-xs">
                                <span className="text-[11px] font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  Morning
                                </span>
                                <span className="text-[10px] font-mono text-emerald-800 tabular-nums">
                                  {cell.timeRange || '7:00–15:30'}
                                </span>
                              </div>
                            ) : cell.shiftId === 'mid' ? (
                              <div className="bg-sky-50 text-sky-950 p-2 rounded-xl border border-sky-200 flex flex-col gap-0.5 shadow-xs">
                                <span className="text-[11px] font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                                  {cell.label || 'Midday'}
                                </span>
                                <span className="text-[10px] font-mono text-sky-800 tabular-nums">
                                  {cell.timeRange || ''}
                                </span>
                                {cell.note && (
                                  <span className="text-[10px] text-sky-700 font-medium">
                                    {cell.note}
                                  </span>
                                )}
                              </div>
                            ) : cell.shiftId === 'evening' ? (
                              <div className="bg-slate-100 text-slate-800 p-2 rounded-xl border border-slate-200 flex flex-col gap-0.5 shadow-xs">
                                <span className="text-[11px] font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                  Evening
                                </span>
                                <span className="text-[10px] font-mono text-slate-700 tabular-nums">
                                  {cell.timeRange || '15:00–23:30'}
                                </span>
                              </div>
                            ) : cell.shiftId === 'leave' ? (
                              <div className="bg-amber-50 text-amber-900 p-2 rounded-xl border border-amber-200 flex flex-col gap-0.5 shadow-xs">
                                <span className="text-[11px] font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-amber-600">beach_access</span>
                                  Time Off
                                </span>
                                <span className="text-[10px] text-amber-700 font-medium">
                                  Personal (Approved)
                                </span>
                              </div>
                            ) : (
                              <div className="bg-[#f1f3ff]/60 text-[#707a6f] p-2 rounded-xl text-center flex flex-col justify-center min-h-[44px]">
                                <span className="text-[11px] font-medium">Day Off</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Legend Footer */}
            <footer className="p-4 bg-[#f1f3ff]/80 border-t border-[#e1e8fd] flex flex-wrap items-center justify-between text-xs text-[#707a6f] gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-200 border border-emerald-400 inline-block"></span>
                  <span>Morning (7:00–15:30)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-400 inline-block"></span>
                  <span>Evening (15:00–23:30)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400 inline-block"></span>
                  <span>Approved Time Off</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#e1e8fd] border border-[#dce2f7] inline-block"></span>
                  <span>Scheduled Rest Day</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#141b2b] font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">lock_clock</span>
                <span>Mandatory 14-hour minimum rest guaranteed across shifts</span>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Progress Simulation Modal (Scenario 4) */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#293040]/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-[#e1e8fd] animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#166534] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px] animate-spin">sync</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-base text-[#141b2b]">Updating Schedule</h3>
                <p className="text-xs text-[#707a6f]">OptiShift MILP solver running checks</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="flex flex-col gap-2 bg-[#f1f3ff] p-3.5 rounded-xl border border-[#e1e8fd] text-xs">
              <div className="flex items-center gap-2 text-[#141b2b] font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">check_circle</span>
                <span>Checking your team (8 active staff)...</span>
              </div>
              <div className="flex items-center gap-2 text-[#141b2b] font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">check_circle</span>
                <span>Checking when people can work...</span>
              </div>
              <div className="flex items-center gap-2 text-[#141b2b] font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">check_circle</span>
                <span>Checking store rules & rest gaps...</span>
              </div>
              <div className="flex items-center gap-2 text-[#166534] font-bold animate-pulse">
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                <span>Finding optimal feasible schedule...</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
              <div className="w-full bg-[#f1f3ff] rounded-full h-2 overflow-hidden border border-[#e1e8fd]">
                <div
                  className="bg-[#166534] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-[#707a6f] text-center">
                Your new schedule will be ready in seconds.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
