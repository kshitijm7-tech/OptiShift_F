import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { MandatorySkillRule } from '../../types';

export const RulesScreen: React.FC = () => {
  const {
    rules,
    setRules,
    rulesSimScenario,
    setRulesSimScenario,
    resetDemoData,
    triggerReoptimize,
    setActiveScreen,
    setToastMessage
  } = useSchedule();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showStrictWarning, setShowStrictWarning] = useState(false);
  const [showImpactWarning, setShowImpactWarning] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Editable form state
  const [morningStaff, setMorningStaff] = useState(rules.morningMinStaff);
  const [eveningStaff, setEveningStaff] = useState(rules.eveningMinStaff);
  const [weekendStaff, setWeekendStaff] = useState(rules.weekendBrunchMinStaff);
  const [weeklyHoursCap, setWeeklyHoursCap] = useState(rules.maxWeeklyHours);
  const [dailyHoursLimit, setDailyHoursLimit] = useState(rules.maxDailyHours);
  const [restHoursMin, setRestHoursMin] = useState(rules.minRestHours);
  const [overtimePolicy, setOvertimePolicy] = useState(rules.overtimePolicy);
  const [maxOtHours, setMaxOtHours] = useState(rules.maxAllowedOvertime);
  const [balanceWeekly, setBalanceWeekly] = useState(rules.balanceWeeklyHours);
  const [balanceWeekend, setBalanceWeekend] = useState(rules.balancedWeekendDistribution);
  const [followPreferences, setFollowPreferences] = useState(rules.followPreferredShifts);
  const [avoidAbrupt, setAvoidAbrupt] = useState(rules.avoidAbruptShiftChanges);

  // New skill rule inline form
  const [newShift, setNewShift] = useState('Morning Shift');
  const [newSkill, setNewSkill] = useState('Senior Barista');
  const [newCount, setNewCount] = useState(1);

  const markDirty = () => {
    setHasUnsavedChanges(true);
  };

  const handleScenarioChange = (scenario: string) => {
    setRulesSimScenario(scenario);
    setShowSavedToast(false);
    setShowStrictWarning(false);
    setShowImpactWarning(false);
    setShowResetModal(false);

    if (scenario === 'default') {
      setHasUnsavedChanges(false);
      setToastMessage('Default validated rules restored.');
    } else if (scenario === 'unsaved') {
      setHasUnsavedChanges(true);
    } else if (scenario === 'impact') {
      setShowImpactWarning(true);
    } else if (scenario === 'saved') {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 4000);
    } else if (scenario === 'strict') {
      setShowStrictWarning(true);
    } else if (scenario === 'reset-dialog') {
      setShowResetModal(true);
    } else if (scenario === 'first-time') {
      setMorningStaff(2);
      setEveningStaff(3);
      setWeekendStaff(3);
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = () => {
    setRules(prev => ({
      ...prev,
      morningMinStaff: morningStaff,
      eveningMinStaff: eveningStaff,
      weekendBrunchMinStaff: weekendStaff,
      maxWeeklyHours: weeklyHoursCap,
      maxDailyHours: dailyHoursLimit,
      minRestHours: restHoursMin,
      overtimePolicy,
      maxAllowedOvertime: maxOtHours,
      balanceWeeklyHours: balanceWeekly,
      balancedWeekendDistribution: balanceWeekend,
      followPreferredShifts: followPreferences,
      avoidAbruptShiftChanges: avoidAbrupt
    }));
    setHasUnsavedChanges(false);
    setShowSavedToast(true);
    triggerReoptimize();
    setTimeout(() => setShowSavedToast(false), 4000);
  };

  const handleDiscard = () => {
    setMorningStaff(rules.morningMinStaff);
    setEveningStaff(rules.eveningMinStaff);
    setWeekendStaff(rules.weekendBrunchMinStaff);
    setWeeklyHoursCap(rules.maxWeeklyHours);
    setDailyHoursLimit(rules.maxDailyHours);
    setRestHoursMin(rules.minRestHours);
    setOvertimePolicy(rules.overtimePolicy);
    setMaxOtHours(rules.maxAllowedOvertime);
    setBalanceWeekly(rules.balanceWeeklyHours);
    setBalanceWeekend(rules.balancedWeekendDistribution);
    setFollowPreferences(rules.followPreferredShifts);
    setAvoidAbrupt(rules.avoidAbruptShiftChanges);
    setHasUnsavedChanges(false);
    setToastMessage('Discarded unsaved changes.');
  };

  const handleAddSkillRule = () => {
    const newRule: MandatorySkillRule = {
      id: `rule-${Date.now()}`,
      shiftId: newShift.toLowerCase().includes('morning') ? 'morning' : 'evening',
      roleOrSkill: newSkill,
      minCount: newCount
    };
    setRules(prev => ({
      ...prev,
      skillRules: [...prev.skillRules, newRule]
    }));
    markDirty();
    setToastMessage(`Added constraint: ${newShift} requires min ${newCount} ${newSkill}.`);
  };

  const handleDeleteSkillRule = (ruleId: string) => {
    setRules(prev => ({
      ...prev,
      skillRules: prev.skillRules.filter(r => r.id !== ruleId)
    }));
    markDirty();
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* State Simulator Switcher Banner */}
      <section className="bg-[#f1f3ff] rounded-2xl p-3.5 mb-6 shadow-xs border border-[#e1e8fd]">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#166534] text-[18px]">tune</span>
            <span className="text-xs uppercase tracking-wider text-[#166534] font-bold">
              State Simulator: Switch View
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(
              [
                { id: 'default', label: 'Active Rules (Default)' },
                { id: 'unsaved', label: 'Unsaved Changes Banner' },
                { id: 'impact', label: 'Schedule Impact Warning' },
                { id: 'saved', label: 'Rules Saved Toast' },
                { id: 'strict', label: 'Rules Too Strict (Guidance)' },
                { id: 'reset-dialog', label: 'Reset Dialog' },
                { id: 'first-time', label: 'First-Time Defaults' }
              ] as const
            ).map(sc => (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  rulesSimScenario === sc.id
                    ? 'bg-[#166534] text-white font-bold shadow-xs'
                    : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">Rules</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-xs font-bold">
              Active Engine v2.4
            </span>
          </div>
          <p className="text-sm text-[#707a6f] mt-0.5">
            Tell OptiShift how you want your schedule to work for UrbanBrew Café.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-[#141b2b] rounded-xl text-xs font-semibold hover:bg-[#f1f3ff] border border-[#e1e8fd] shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#707a6f]">restart_alt</span>
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold hover:bg-[#004c22] shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>Save Changes</span>
          </button>
        </div>
      </header>

      {/* Dynamic Alerts Zone */}
      <div className="space-y-3 mb-6">
        {showSavedToast && (
          <div className="p-4 rounded-xl bg-[#b0f1c7] text-[#004c22] shadow-xs flex items-center justify-between border border-[#166534]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#004c22]">check_circle</span>
              <div>
                <h4 className="font-bold text-xs">Rules successfully updated!</h4>
                <p className="text-xs text-[#004c22]/90">
                  Your changes have been fed into the solver and the schedule rebalanced.
                </p>
              </div>
            </div>
            <button onClick={() => setShowSavedToast(false)} className="text-[#004c22]">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {showStrictWarning && (
          <div className="p-4 rounded-xl bg-red-50 text-red-900 border border-red-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[22px] text-red-600 shrink-0">warning</span>
              <div className="text-xs">
                <h4 className="font-bold text-red-900">These rules may be too strict for your current team</h4>
                <p className="text-red-700 mt-0.5">
                  3 shifts currently require <strong>4 Baristas</strong> simultaneously, but only <strong>2 Baristas</strong> are currently marked active in your team list. This makes an automatic schedule impossible without overtime or unstaffed shifts.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setMorningStaff(2);
                setShowStrictWarning(false);
                markDirty();
              }}
              className="px-3 py-1.5 bg-white text-red-900 font-bold rounded-lg hover:bg-red-100 shadow-xs text-xs shrink-0"
            >
              Adjust to Available Staff
            </button>
          </div>
        )}

        {showImpactWarning && (
          <div className="p-4 rounded-xl bg-[#e1e8fd] text-[#141b2b] border border-[#dce2f7] shadow-xs flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#166534] shrink-0">info</span>
              <div>
                <h4 className="font-bold text-[#141b2b]">Active Schedule Impact Detected</h4>
                <p className="text-[#404940] mt-0.5">
                  You've modified minimum rest periods from 11 hrs to 12 hrs. Two team members (Rahul Patil &amp; Priya Sharma) currently have back-to-back close/open shifts on Oct 17. Updating will mark these as needing reassignment.
                </p>
              </div>
            </div>
            <button onClick={() => setShowImpactWarning(false)} className="text-[#707a6f]">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}
      </div>

      {/* Intro Explanation Callout */}
      <section className="bg-[#f1f3ff] rounded-2xl p-5 mb-6 shadow-xs border border-[#e1e8fd]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#b0f1c7] text-[#004c22] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">psychology</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-base text-[#141b2b]">
              These rules help us build schedules that fit your business and your team.
            </h2>
            <p className="text-xs text-[#404940] mt-1 leading-relaxed">
              We’ll always follow your must-have requirements first (people available, mandatory skills, working limits), then try to create the most balanced, cost-effective schedule. You stay in control without having to calculate shift math.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-[#2d6a48] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#166534]"></span> 100% Labour Law Compliant
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#166534]"></span> Mumbai Retail Hours Optimized
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#166534]"></span> Fair Allocation by Default
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Primary Operational Rules (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* SECTION 1: Staffing Requirements */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#b0f1c7] text-[#004c22] text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-bold text-base text-[#141b2b]">Staffing Requirements</h2>
                </div>
                <p className="text-xs text-[#707a6f] mt-1">
                  How many people do you need working at the same time? We'll make sure every shift has enough hands.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#f1f3ff] text-[#707a6f] font-bold">
                Must-Have
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Morning Shift Stepper */}
              <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-700 shadow-xs border border-[#e1e8fd]">
                    <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#141b2b]">Morning Shift</span>
                      <span className="text-[11px] text-[#707a6f]">07:00 – 15:30</span>
                    </div>
                    <span className="text-[11px] text-[#707a6f]">Breakfast &amp; corporate coffee peak</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center bg-white rounded-lg p-0.5 shadow-xs border border-[#e1e8fd]">
                    <button
                      type="button"
                      onClick={() => {
                        setMorningStaff(prev => Math.max(1, prev - 1));
                        markDirty();
                      }}
                      className="w-7 h-7 flex items-center justify-center text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff] rounded font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#141b2b] tabular-nums">
                      {morningStaff}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMorningStaff(prev => Math.min(10, prev + 1));
                        markDirty();
                      }}
                      className="w-7 h-7 flex items-center justify-center text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff] rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-[#707a6f] w-16">people min</span>
                </div>
              </div>

              {/* Evening Shift Stepper */}
              <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-700 shadow-xs border border-[#e1e8fd]">
                    <span className="material-symbols-outlined text-[18px]">bedtime</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#141b2b]">Evening Shift</span>
                      <span className="text-[11px] text-[#707a6f]">15:00 – 23:30</span>
                    </div>
                    <span className="text-[11px] text-[#707a6f]">After-work rush &amp; kitchen closing prep</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center bg-white rounded-lg p-0.5 shadow-xs border border-[#e1e8fd]">
                    <button
                      type="button"
                      onClick={() => {
                        setEveningStaff(prev => Math.max(1, prev - 1));
                        markDirty();
                      }}
                      className="w-7 h-7 flex items-center justify-center text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff] rounded font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#141b2b] tabular-nums">
                      {eveningStaff}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEveningStaff(prev => Math.min(10, prev + 1));
                        markDirty();
                      }}
                      className="w-7 h-7 flex items-center justify-center text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff] rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-[#707a6f] w-16">people min</span>
                </div>
              </div>

              {/* Weekend Brunch Peak Stepper */}
              <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#166534] shadow-xs border border-[#e1e8fd]">
                    <span className="material-symbols-outlined text-[18px]">local_cafe</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#141b2b]">Weekend Brunch Peak</span>
                      <span className="text-[11px] text-[#707a6f]">Sat – Sun (10:00 – 16:00)</span>
                    </div>
                    <span className="text-[11px] text-[#707a6f]">Heavy dine-in &amp; patio traffic</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center bg-white rounded-lg p-0.5 shadow-xs border border-[#e1e8fd]">
                    <button
                      type="button"
                      onClick={() => {
                        setWeekendStaff(prev => Math.max(1, prev - 1));
                        markDirty();
                      }}
                      className="w-7 h-7 flex items-center justify-center text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff] rounded font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#141b2b] tabular-nums">
                      {weekendStaff}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setWeekendStaff(prev => Math.min(10, prev + 1));
                        markDirty();
                      }}
                      className="w-7 h-7 flex items-center justify-center text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff] rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-[#707a6f] w-16">people min</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEveningStaff(prev => prev + 1);
                markDirty();
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#166534] hover:underline self-start pt-1"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ Add custom shift requirement</span>
            </button>
          </section>

          {/* SECTION 2: Mandatory Skills & Roles */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#b0f1c7] text-[#004c22] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-bold text-base text-[#141b2b]">Mandatory Skills &amp; Roles</h2>
                </div>
                <p className="text-xs text-[#707a6f] mt-1">
                  Make sure specialized roles like Baristas and Supervisors are always on shift when the store is open.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#f1f3ff] text-[#707a6f] font-bold">
                Must-Have
              </span>
            </div>

            <div className="space-y-2">
              {rules.skillRules.map(sr => (
                <div
                  key={sr.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] hover:bg-[#e1e8fd]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#141b2b] w-28 capitalize">
                      {sr.shiftId} Shift
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#141b2b] text-xs font-medium border border-[#e1e8fd] shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
                      Min {sr.minCount} {sr.roleOrSkill}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSkillRule(sr.id)}
                    className="text-[#707a6f] hover:text-red-600 p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Inline Quick Add Control */}
            <div className="p-3.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd]">
              <span className="text-[10px] uppercase tracking-wider text-[#707a6f] font-bold block mb-2">
                Add Skill Coverage Rule
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#707a6f] mb-1">Shift</label>
                  <select
                    value={newShift}
                    onChange={e => setNewShift(e.target.value)}
                    className="w-full h-8 px-2 bg-white rounded-lg text-[#141b2b] border border-[#e1e8fd] focus:outline-none"
                  >
                    <option>Morning Shift</option>
                    <option>Evening Shift</option>
                    <option>Weekend Brunch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#707a6f] mb-1">Role or Skill</label>
                  <select
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    className="w-full h-8 px-2 bg-white rounded-lg text-[#141b2b] border border-[#e1e8fd] focus:outline-none"
                  >
                    <option>Senior Barista</option>
                    <option>Shift Supervisor</option>
                    <option>Counter / Cashier</option>
                    <option>Kitchen Prep</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#707a6f] mb-1">Required</label>
                  <select
                    value={newCount}
                    onChange={e => setNewCount(Number(e.target.value))}
                    className="w-full h-8 px-2 bg-white rounded-lg text-[#141b2b] border border-[#e1e8fd] focus:outline-none"
                  >
                    <option value={1}>At least 1</option>
                    <option value={2}>At least 2</option>
                    <option value={3}>At least 3</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddSkillRule}
                    className="w-full h-8 px-3 bg-[#166534] text-white rounded-lg font-bold hover:bg-[#004c22] shadow-xs transition-colors"
                  >
                    Add Rule
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Working Hours & Rest Limits */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#b0f1c7] text-[#004c22] text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-bold text-base text-[#141b2b]">Working Hours &amp; Rest Limits</h2>
                </div>
                <p className="text-xs text-[#707a6f] mt-1">
                  Set limits so people don’t get scheduled for too much work and have enough time to sleep between shifts.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#f1f3ff] text-[#707a6f] font-bold">
                Labour Safety
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Max Weekly Hours */}
              <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col justify-between border border-[#e1e8fd]">
                <div>
                  <span className="text-xs font-bold text-[#141b2b] block">Weekly Hours Cap</span>
                  <span className="text-[10px] text-[#707a6f] block mt-0.5">Maximum normal hours</span>
                </div>
                <div className="my-3 flex items-baseline gap-1.5">
                  <input
                    type="number"
                    value={weeklyHoursCap}
                    onChange={e => {
                      setWeeklyHoursCap(Number(e.target.value));
                      markDirty();
                    }}
                    className="w-14 h-8 px-2 bg-white rounded-lg text-base font-bold text-[#141b2b] text-center border border-[#e1e8fd]"
                  />
                  <span className="text-xs text-[#707a6f]">hrs / week</span>
                </div>
                <p className="text-[10px] text-[#707a6f]">Can be customized per person in My Team</p>
              </div>

              {/* Max Daily Hours */}
              <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col justify-between border border-[#e1e8fd]">
                <div>
                  <span className="text-xs font-bold text-[#141b2b] block">Daily Hours Limit</span>
                  <span className="text-[10px] text-[#707a6f] block mt-0.5">Single shift maximum</span>
                </div>
                <div className="my-3 flex items-baseline gap-1.5">
                  <input
                    type="number"
                    value={dailyHoursLimit}
                    onChange={e => {
                      setDailyHoursLimit(Number(e.target.value));
                      markDirty();
                    }}
                    className="w-14 h-8 px-2 bg-white rounded-lg text-base font-bold text-[#141b2b] text-center border border-[#e1e8fd]"
                  />
                  <span className="text-xs text-[#707a6f]">hrs / day</span>
                </div>
                <p className="text-[10px] text-[#707a6f]">Excludes 30-min unpaid meal break</p>
              </div>

              {/* Rest Between Shifts */}
              <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col justify-between border border-[#e1e8fd]">
                <div>
                  <span className="text-xs font-bold text-[#141b2b] block">Rest Between Shifts</span>
                  <span className="text-[10px] text-[#707a6f] block mt-0.5">No "clopenings"</span>
                </div>
                <div className="my-3 flex items-baseline gap-1.5">
                  <input
                    type="number"
                    value={restHoursMin}
                    onChange={e => {
                      setRestHoursMin(Number(e.target.value));
                      markDirty();
                    }}
                    className="w-14 h-8 px-2 bg-white rounded-lg text-base font-bold text-[#141b2b] text-center border border-[#e1e8fd]"
                  />
                  <span className="text-xs text-[#707a6f]">hours min</span>
                </div>
                <p className="text-[10px] text-[#707a6f]">Between store close and next open</p>
              </div>
            </div>
          </section>

          {/* SECTION 4: Extra Hours & Overtime */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#b0f1c7] text-[#004c22] text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="font-bold text-base text-[#141b2b]">Extra Hours &amp; Overtime</h2>
                </div>
                <p className="text-xs text-[#707a6f] mt-1">
                  Tell us what to do when someone would need to work beyond their normal hours to cover a shift.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#f1f3ff] text-[#707a6f] font-bold">
                Budget Control
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <label
                onClick={() => {
                  setOvertimePolicy('avoid');
                  markDirty();
                }}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  overtimePolicy === 'avoid'
                    ? 'bg-[#b0f1c7]/20 border-[#166534]'
                    : 'bg-[#f1f3ff] border-[#e1e8fd] hover:bg-[#e1e8fd]'
                }`}
              >
                <input
                  type="radio"
                  name="overtime"
                  checked={overtimePolicy === 'avoid'}
                  onChange={() => {}}
                  className="mt-0.5 accent-[#166534]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#141b2b]">Avoid extra hours whenever possible</span>
                    <span className="px-2 py-0.5 rounded bg-[#b0f1c7] text-[#004c22] font-bold text-[10px]">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[#404940] mt-0.5 leading-relaxed">
                    OptiShift will first prioritize staff who haven't reached 40 hours. Extra hours will only be used if there is truly no other person available. Protects your monthly wage budget.
                  </p>
                </div>
              </label>

              <label
                onClick={() => {
                  setOvertimePolicy('allow');
                  markDirty();
                }}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  overtimePolicy === 'allow'
                    ? 'bg-[#b0f1c7]/20 border-[#166534]'
                    : 'bg-[#f1f3ff] border-[#e1e8fd] hover:bg-[#e1e8fd]'
                }`}
              >
                <input
                  type="radio"
                  name="overtime"
                  checked={overtimePolicy === 'allow'}
                  onChange={() => {}}
                  className="mt-0.5 accent-[#166534]"
                />
                <div className="flex-1">
                  <span className="font-bold text-[#141b2b]">Allow extra hours when needed</span>
                  <p className="text-[#404940] mt-0.5 leading-relaxed">
                    Allows team members to take on up to
                    <input
                      type="number"
                      value={maxOtHours}
                      onChange={e => {
                        setMaxOtHours(Number(e.target.value));
                        markDirty();
                      }}
                      className="inline-block w-12 h-6 px-1 mx-1.5 text-center bg-white rounded font-bold text-[#141b2b] border border-[#e1e8fd]"
                    />
                    extra hours per week if they want more hours or to cover absences easily.
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Preferences, Balance & Impact (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* SECTION 5: Work Balance */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#b0f1c7] text-[#004c22] text-xs font-bold flex items-center justify-center">
                  5
                </span>
                <h2 className="font-bold text-base text-[#141b2b]">Fair Work Distribution</h2>
              </div>
              <p className="text-xs text-[#707a6f] mt-1">
                Try to share work and weekend shifts fairly across your team so morale stays high.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-[#141b2b] block">Keep weekly hours balanced</span>
                  <span className="text-[#707a6f] block mt-0.5 leading-relaxed">
                    When possible, avoid giving one full-timer 42 hours while another gets only 28 hours.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={balanceWeekly}
                  onChange={e => {
                    setBalanceWeekly(e.target.checked);
                    markDirty();
                  }}
                  className="mt-1 w-4 h-4 accent-[#166534]"
                />
              </div>

              <div className="flex items-start justify-between gap-3 pt-2 border-t border-[#f1f3ff]">
                <div>
                  <span className="font-bold text-[#141b2b] block">Prefer balanced weekend distribution</span>
                  <span className="text-[#707a6f] block mt-0.5 leading-relaxed">
                    Rotate Saturday and Sunday shifts across staff so everyone gets some weekend rest.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={balanceWeekend}
                  onChange={e => {
                    setBalanceWeekend(e.target.checked);
                    markDirty();
                  }}
                  className="mt-1 w-4 h-4 accent-[#166534]"
                />
              </div>
            </div>
          </section>

          {/* SECTION 6: Team Preferences */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#b0f1c7] text-[#004c22] text-xs font-bold flex items-center justify-center">
                  6
                </span>
                <h2 className="font-bold text-base text-[#141b2b]">Team Preferences</h2>
              </div>
              <p className="text-xs text-[#707a6f] mt-1">
                Use people’s shift preferences whenever they don’t conflict with store opening needs.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-[#141b2b] block">Try to follow preferred shifts</span>
                  <span className="text-[#707a6f] block mt-0.5 leading-relaxed">
                    We'll match employee preferred mornings or evenings when staffing permits.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={followPreferences}
                  onChange={e => {
                    setFollowPreferences(e.target.checked);
                    markDirty();
                  }}
                  className="mt-1 w-4 h-4 accent-[#166534]"
                />
              </div>

              <div className="flex items-start justify-between gap-3 pt-2 border-t border-[#f1f3ff]">
                <div>
                  <span className="font-bold text-[#141b2b] block">Avoid abrupt shift pattern changes</span>
                  <span className="text-[#707a6f] block mt-0.5 leading-relaxed">
                    Keep people on consistent blocks (e.g. 3 mornings in a row instead of daily flip).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={avoidAbrupt}
                  onChange={e => {
                    setAvoidAbrupt(e.target.checked);
                    markDirty();
                  }}
                  className="mt-1 w-4 h-4 accent-[#166534]"
                />
              </div>
            </div>
          </section>

          {/* SECTION 7: How OptiShift Uses Your Rules */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e1e8fd] flex flex-col gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#2d6a48] font-bold">
                Priority Hierarchy Guide
              </span>
              <h2 className="font-bold text-sm text-[#141b2b] mt-0.5">How OptiShift Applies Your Rules</h2>
              <p className="text-xs text-[#707a6f] mt-0.5">
                When creating your schedule, our engine balances requirements in this exact priority order:
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#f1f3ff] flex items-start gap-2.5 border border-[#e1e8fd]">
                <span className="w-5 h-5 rounded bg-[#166534] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#141b2b]">
                    <span>Must-Haves (Non-negotiable)</span>
                    <span className="material-symbols-outlined text-[15px] text-[#166534]">lock</span>
                  </div>
                  <p className="text-[#404940] mt-0.5">
                    Store coverage targets, certified skill availability (Baristas &amp; Supervisors), approved leaves, and not double-booking.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f1f3ff] flex items-start gap-2.5 border border-[#e1e8fd]">
                <span className="w-5 h-5 rounded bg-[#2d6a48] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#141b2b]">
                    <span>Well-being &amp; Rest Limits</span>
                    <span className="material-symbols-outlined text-[15px] text-[#2d6a48]">shield</span>
                  </div>
                  <p className="text-[#404940] mt-0.5">
                    Max 40 hrs/week per person, max 8 hrs/day, and mandatory 12 hours rest between evening close and morning opening.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f1f3ff] flex items-start gap-2.5 border border-[#e1e8fd]">
                <span className="w-5 h-5 rounded bg-[#e1e8fd] text-[#141b2b] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#141b2b]">
                    <span>Staff Happiness &amp; Optimization</span>
                    <span className="material-symbols-outlined text-[15px] text-[#707a6f]">sentiment_satisfied</span>
                  </div>
                  <p className="text-[#404940] mt-0.5">
                    Zero overtime where possible, balanced weekend rotations, and matching individual morning or evening preferences.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Current Schedule Status Box */}
          <section className="bg-[#f1f3ff] rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#141b2b]">
              <span className="material-symbols-outlined text-[18px] text-[#166534]">calendar_month</span>
              <span>Current Schedule Status</span>
            </div>
            <p className="text-[#404940] leading-relaxed">
              UrbanBrew Café's active schedule for <strong>Oct 14 – Oct 20</strong> is running smoothly under these rules. Changing staffing minimums or weekly caps will automatically apply to next week's draft.
            </p>
            <button
              onClick={() => setActiveScreen('schedule')}
              className="font-bold text-[#166534] hover:underline self-start pt-1 flex items-center gap-1"
            >
              <span>View Active Schedule</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </section>
        </div>
      </div>

      {/* Bottom Floating Unsaved Changes Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl bg-[#141b2b] text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">info</span>
            <div>
              <p className="text-xs font-bold text-white">You have unsaved changes</p>
              <p className="text-[11px] text-[#bfc9bd]">Changes will take effect once saved.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white hover:bg-white/10 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#166534] text-white rounded-lg text-xs font-bold hover:bg-[#004c22] transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-[#293040]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-[#e1e8fd] animate-in fade-in">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">restart_alt</span>
            </div>
            <div>
              <h2 className="font-bold text-base text-[#141b2b]">Reset rules to defaults?</h2>
              <p className="text-xs text-[#404940] mt-1 leading-relaxed">
                This will restore the standard UrbanBrew Café shift settings: 3 morning staff, 4 evening staff, 40-hour weekly cap, and 12-hour rest requirement. Your team roster will not be altered.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f3ff]">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#707a6f] hover:bg-[#f1f3ff]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetModal(false);
                  handleDiscard();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow-xs"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
