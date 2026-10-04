import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Employee, ShiftDefinition } from '../../types';

export const CustomBuilderScreen: React.FC = () => {
  const {
    setOperatingMode,
    setActiveScreen,
    setShowModePickerModal,
    setToastMessage
  } = useSchedule();

  // Wizard view: 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'state-success' | 'state-infeasible'
  const [activePane, setActivePane] = useState<string>('step-1');
  const [showBuildingModal, setShowBuildingModal] = useState<boolean>(false);

  // Form states for Custom Business
  const [bizName, setBizName] = useState('Blue Tokai Roastery');
  const [bizType, setBizType] = useState('Café & Specialty Coffee');
  const [bizLocation, setBizLocation] = useState('Bandra West, Mumbai - Store #4');

  // Custom Team
  const [customTeam, setCustomTeam] = useState<Employee[]>([
    {
      id: 'c-1',
      name: 'Rohan Verma',
      initials: 'RV',
      role: 'Lead Barista',
      isFullTime: true,
      skills: ['Specialty Coffee', 'Latte Art', 'Barista L2'],
      hourlyRate: 260,
      maxWeeklyHours: 40,
      assignedHours: 40,
      availabilityDesc: 'Mon - Fri',
      dayAvailability: { 0: 'any', 1: 'any', 2: 'any', 3: 'any', 4: 'any', 5: 'off', 6: 'off' },
      status: 'active'
    },
    {
      id: 'c-2',
      name: 'Sneha Roy',
      initials: 'SR',
      role: 'Cashier / Front',
      isFullTime: false,
      skills: ['Billing', 'Customer Care'],
      hourlyRate: 210,
      maxWeeklyHours: 30,
      assignedHours: 30,
      availabilityDesc: 'Tue - Sat',
      dayAvailability: { 0: 'off', 1: 'any', 2: 'any', 3: 'any', 4: 'any', 5: 'any', 6: 'off' },
      status: 'active'
    },
    {
      id: 'c-3',
      name: 'David Lobo',
      initials: 'DL',
      role: 'Prep & Kitchen',
      isFullTime: true,
      skills: ['Food Prep', 'Sanitation'],
      hourlyRate: 240,
      maxWeeklyHours: 35,
      assignedHours: 35,
      availabilityDesc: 'All 7 Days',
      dayAvailability: { 0: 'any', 1: 'any', 2: 'any', 3: 'any', 4: 'any', 5: 'any', 6: 'any' },
      status: 'active'
    },
    {
      id: 'c-4',
      name: 'Pooja Kadam',
      initials: 'PK',
      role: 'Supervisor',
      isFullTime: true,
      skills: ['Management', 'Inventory', 'Lead Barista'],
      hourlyRate: 290,
      maxWeeklyHours: 40,
      assignedHours: 40,
      availabilityDesc: 'Wed - Sun',
      dayAvailability: { 0: 'off', 1: 'off', 2: 'any', 3: 'any', 4: 'any', 5: 'any', 6: 'any' },
      status: 'active'
    },
    {
      id: 'c-5',
      name: 'Aarav Patel',
      initials: 'AP',
      role: 'Junior Barista',
      isFullTime: false,
      skills: ['Brew Assist', 'Barista'],
      hourlyRate: 200,
      maxWeeklyHours: 30,
      assignedHours: 30,
      availabilityDesc: 'Thu - Mon',
      dayAvailability: { 0: 'any', 1: 'off', 2: 'off', 3: 'any', 4: 'any', 5: 'any', 6: 'any' },
      status: 'active'
    },
    {
      id: 'c-6',
      name: 'Tanya Sen',
      initials: 'TS',
      role: 'Senior Barista',
      isFullTime: true,
      skills: ['Specialty Coffee', 'Latte Art', 'Training'],
      hourlyRate: 270,
      maxWeeklyHours: 40,
      assignedHours: 40,
      availabilityDesc: 'Mon - Fri',
      dayAvailability: { 0: 'any', 1: 'any', 2: 'any', 3: 'any', 4: 'any', 5: 'off', 6: 'off' },
      status: 'active'
    },
    {
      id: 'c-7',
      name: 'Sameer Khan',
      initials: 'SK',
      role: 'Counter & Support',
      isFullTime: false,
      skills: ['Billing', 'Order Taking'],
      hourlyRate: 220,
      maxWeeklyHours: 35,
      assignedHours: 35,
      availabilityDesc: 'All 7 Days',
      dayAvailability: { 0: 'any', 1: 'any', 2: 'any', 3: 'any', 4: 'any', 5: 'any', 6: 'any' },
      status: 'active'
    }
  ]);

  // Headcounts needed
  const [morningNeeded, setMorningNeeded] = useState(3);
  const [midNeeded, setMidNeeded] = useState(2);
  const [eveningNeeded, setEveningNeeded] = useState(4);
  const [enableSkills, setEnableSkills] = useState(true);

  // New staff modal inline
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Barista');
  const [newStaffPay, setNewStaffPay] = useState(240);
  const [newStaffHours, setNewStaffHours] = useState(35);

  const handleAddStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff: Employee = {
      id: `c-${Date.now()}`,
      name: newStaffName.trim(),
      initials: newStaffName.substring(0, 2).toUpperCase(),
      role: newStaffRole.trim(),
      isFullTime: newStaffHours >= 35,
      skills: [newStaffRole, 'Customer Care'],
      hourlyRate: Number(newStaffPay),
      maxWeeklyHours: Number(newStaffHours),
      assignedHours: Number(newStaffHours),
      availabilityDesc: 'All 7 Days',
      dayAvailability: { 0: 'any', 1: 'any', 2: 'any', 3: 'any', 4: 'any', 5: 'any', 6: 'any' },
      status: 'active'
    };

    setCustomTeam(prev => [newStaff, ...prev]);
    setShowAddTeamModal(false);
    setNewStaffName('');
    setToastMessage(`Added ${newStaff.name} to custom problem.`);
  };

  const handleStartSolve = () => {
    setShowBuildingModal(true);
    setTimeout(() => {
      setShowBuildingModal(false);
      setActivePane('state-success');
      setToastMessage('Schedule solved in 1.4 seconds with zero compliance breaches!');
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Simulation & State Navigator Bar for Evaluators */}
      <div className="mb-6 bg-white p-3 rounded-2xl shadow-xs border border-[#e1e8fd] border-l-4 border-l-[#166534] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#166534] text-[18px]">tune</span>
          <span className="text-xs uppercase tracking-wider text-[#404940] font-bold">
            Simulator Controls:
          </span>
          <span className="text-xs text-[#707a6f]">Interactive Step &amp; State Switcher</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActivePane('step-1')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activePane === 'step-1'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            1. Business
          </button>
          <button
            onClick={() => setActivePane('step-2')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activePane === 'step-2'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            2. Team
          </button>
          <button
            onClick={() => setActivePane('step-3')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activePane === 'step-3'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            3. Shifts
          </button>
          <button
            onClick={() => setActivePane('step-4')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activePane === 'step-4'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            4. Staffing
          </button>
          <button
            onClick={() => setActivePane('step-5')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activePane === 'step-5'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            5. Review
          </button>
          <span className="w-px h-4 bg-[#e1e8fd] mx-1 hidden sm:inline-block"></span>
          <button
            onClick={() => handleStartSolve()}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-[#b0f1c7] text-[#004c22] hover:bg-[#8bd79b] transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">hourglass_top</span>
            <span>State: Building</span>
          </button>
          <button
            onClick={() => setActivePane('state-success')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activePane === 'state-success'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#166534] hover:bg-[#e1e8fd]'
            }`}
          >
            State: Success
          </button>
          <button
            onClick={() => setActivePane('state-infeasible')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activePane === 'state-infeasible'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-[#f1f3ff] text-red-600 hover:bg-red-100'
            }`}
          >
            State: Guidance
          </button>
          <button
            onClick={() => setShowModePickerModal(true)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#e1e8fd] text-[#141b2b] hover:bg-[#dce2f7] transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">switch_access_shortcut</span>
            <span>Mode Picker</span>
          </button>
        </div>
      </div>

      {/* Operational Mode Banner */}
      <div className="mb-6 bg-white p-4 rounded-2xl shadow-xs border border-[#e1e8fd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#b0f1c7] text-[#004c22] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">handyman</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#141b2b]">Custom Schedule Builder</span>
              <span className="px-2 py-0.5 rounded-full bg-[#166534] text-white text-[10px] uppercase font-bold">
                Active Session
              </span>
            </div>
            <p className="text-xs text-[#707a6f]">
              Building fresh roster for a new store. Demo Mode (UrbanBrew Café) paused.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setOperatingMode('demo');
            setActiveScreen('overview');
            setToastMessage('Switched back to Demo Store.');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold hover:bg-[#e1e8fd] transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px] text-[#2d6a48]">swap_horiz</span>
          <span>Switch to Demo Store</span>
        </button>
      </div>

      {/* Header & Progress Tracker */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-[#166534] text-xs mb-1 font-bold uppercase tracking-wider">
              <span>Custom Setup</span>
              <span>·</span>
              <span>Create Your Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">
              Create Your Custom Schedule
            </h1>
            <p className="text-sm text-[#707a6f] mt-1">
              Tell us a little about your business and team. We'll build the optimal schedule for you.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase text-[#707a6f] font-semibold">Auto-Save Active</span>
            <div className="flex items-center gap-1.5 text-[#166534] text-xs font-bold justify-end">
              <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse"></span>
              <span>Draft #204-BT</span>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="bg-white p-2 rounded-2xl shadow-xs border border-[#e1e8fd]">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'step-1', step: 1, title: 'Business', sub: 'Type & details' },
              { id: 'step-2', step: 2, title: 'Team', sub: `${customTeam.length} members added` },
              { id: 'step-3', step: 3, title: 'Shifts', sub: '3 windows set' },
              { id: 'step-4', step: 4, title: 'Staffing', sub: '9 slots/day' },
              { id: 'step-5', step: 5, title: 'Review', sub: 'Ready to solve' }
            ].map(item => {
              const isActive = activePane === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePane(item.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[#b0f1c7] text-[#004c22]'
                      : 'text-[#707a6f] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive ? 'bg-[#166534] text-white' : 'bg-[#e1e8fd] text-[#141b2b]'
                    }`}
                  >
                    {item.step}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold leading-tight truncate text-[#141b2b]">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#707a6f] truncate hidden lg:block">
                      {item.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIEW CONTAINER */}
      <div>
        {/* STEP 1: BUSINESS */}
        {activePane === 'step-1' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e1e8fd]">
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold">
                    Step 1 of 5
                  </span>
                  <h2 className="text-xl font-bold text-[#141b2b]">About Your Business</h2>
                  <p className="text-xs text-[#707a6f] mt-1">
                    This helps us tailor shift patterns, typical rush hours, and break frequency compliance.
                  </p>
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setActivePane('step-2');
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-[#141b2b] mb-1">Business Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#707a6f] text-[18px]">
                        store
                      </span>
                      <input
                        type="text"
                        required
                        value={bizName}
                        onChange={e => setBizName(e.target.value)}
                        placeholder="e.g. Blue Tokai Roastery"
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#141b2b] mb-1">Business Type</label>
                      <select
                        value={bizType}
                        onChange={e => setBizType(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                      >
                        <option>Café &amp; Specialty Coffee</option>
                        <option>Restaurant &amp; Dining</option>
                        <option>Retail &amp; Boutique</option>
                        <option>Salon &amp; Spa</option>
                        <option>Clinic &amp; Wellness</option>
                        <option>Warehouse &amp; Logistics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#141b2b] mb-1">Location / Branch Name</label>
                      <input
                        type="text"
                        value={bizLocation}
                        onChange={e => setBizLocation(e.target.value)}
                        placeholder="Branch Name or City"
                        className="w-full h-10 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f1f3ff] flex items-start gap-3 border border-[#e1e8fd]">
                    <span className="material-symbols-outlined text-[#166534] text-[20px] mt-0.5">
                      auto_awesome
                    </span>
                    <div>
                      <h4 className="font-bold text-[#141b2b]">Intelligent Calibration</h4>
                      <p className="text-[#404940] mt-0.5 leading-relaxed">
                        We calibrate shift templates and peak customer footfall patterns based on your business type (Café patterns weight early morning rush &amp; late afternoon peak).
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#f1f3ff]">
                    <button
                      type="button"
                      onClick={() => setActiveScreen('overview')}
                      className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] font-semibold"
                    >
                      Cancel Setup
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <span>Continue to Team</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                  Setup Fast-Track
                </span>
                <h3 className="font-bold text-sm text-[#141b2b] mt-1">Why this information matters</h3>
                <p className="text-[#707a6f] mt-1.5 leading-relaxed">
                  OptiShift eliminates 90% of schedule trial-and-error by mapping standard operating hours for hospitality and retail automatically.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#f1f3ff] flex items-center gap-2 border border-[#e1e8fd]">
                    <span className="material-symbols-outlined text-[#166534] text-[18px]">schedule</span>
                    <span className="font-medium text-[#141b2b]">Auto 7-day or 6-day cycle</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f1f3ff] flex items-center gap-2 border border-[#e1e8fd]">
                    <span className="material-symbols-outlined text-[#166534] text-[18px]">gavel</span>
                    <span className="font-medium text-[#141b2b]">Pre-loaded Indian &amp; State Shops Act laws</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TEAM */}
        {activePane === 'step-2' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e1e8fd]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold">
                      Step 2 of 5
                    </span>
                    <h2 className="text-xl font-bold text-[#141b2b]">Add Your Team</h2>
                    <p className="text-xs text-[#707a6f] mt-0.5">
                      Enrolled staff members, their contract hourly caps, and regular availability.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddTeamModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#004c22] shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span>Add Team Member</span>
                  </button>
                </div>

                {/* Team Roster Cards */}
                <div className="space-y-2.5 text-xs">
                  {customTeam.map(emp => (
                    <div
                      key={emp.id}
                      className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e1e8fd] hover:bg-[#e1e8fd]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#b0f1c7] text-[#004c22] flex items-center justify-center font-bold text-xs">
                          {emp.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#141b2b]">{emp.name}</span>
                            <span className="px-2 py-0.2 rounded-full bg-white text-[#166534] text-[10px] font-bold border border-[#e1e8fd]">
                              {emp.role}
                            </span>
                          </div>
                          <span className="text-[#707a6f] text-[11px]">
                            ₹{emp.hourlyRate}/hr · Max {emp.maxWeeklyHours} hrs/wk · {emp.availabilityDesc}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="px-2.5 py-1 rounded-full bg-white text-[#141b2b] font-medium border border-[#e1e8fd]">
                          {emp.availabilityDesc}
                        </span>
                        <button
                          onClick={() => setCustomTeam(prev => prev.filter(e => e.id !== emp.id))}
                          className="p-1 rounded text-[#707a6f] hover:text-red-600"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-[#f1f3ff] mt-6">
                  <button
                    onClick={() => setActivePane('step-1')}
                    className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setActivePane('step-3')}
                    className="px-6 py-2.5 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <span>Continue to Shifts</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Capacity Health Helper */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                  Capacity Health
                </span>
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#707a6f]">Total Available Weekly Hours:</span>
                    <span className="font-bold text-[#141b2b]">250 hrs</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f1f3ff] overflow-hidden border border-[#e1e8fd]">
                    <div className="h-full bg-[#166534] rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#f1f3ff]">
                    <span className="text-[#707a6f]">Average Hourly Pay:</span>
                    <span className="font-bold text-[#141b2b]">₹241.40</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#707a6f]">Supervisor Coverage:</span>
                    <span className="text-[#166534] font-bold">2 Certified Staff</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SHIFTS */}
        {activePane === 'step-3' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e1e8fd]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold">
                      Step 3 of 5
                    </span>
                    <h2 className="text-xl font-bold text-[#141b2b]">What shifts do you use?</h2>
                    <p className="text-xs text-[#707a6f] mt-0.5">
                      Specify your daily operating windows. Durations and mandatory rest gaps update automatically.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] font-bold text-[10px]">
                          Shift 1
                        </span>
                        <span className="material-symbols-outlined text-amber-700 text-[18px]">wb_sunny</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#141b2b]">Morning Shift</h3>
                      <div className="mt-2 text-xs font-semibold text-[#141b2b]">08:00 – 16:00</div>
                      <div className="mt-1 text-[11px] text-[#166534] font-bold">Auto-calculated: 8.0 hrs</div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-[#e1e8fd] text-[11px] text-[#707a6f]">
                      Includes 45m break
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#141b2b] font-bold text-[10px] border border-[#e1e8fd]">
                          Shift 2
                        </span>
                        <span className="material-symbols-outlined text-[#707a6f] text-[18px]">wb_twilight</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#141b2b]">Mid Shift</h3>
                      <div className="mt-2 text-xs font-semibold text-[#141b2b]">12:00 – 20:00</div>
                      <div className="mt-1 text-[11px] text-[#166534] font-bold">Auto-calculated: 8.0 hrs</div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-[#e1e8fd] text-[11px] text-[#707a6f]">
                      Rush-hour overlap
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#141b2b] font-bold text-[10px] border border-[#e1e8fd]">
                          Shift 3
                        </span>
                        <span className="material-symbols-outlined text-indigo-700 text-[18px]">nights_stay</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#141b2b]">Evening Shift</h3>
                      <div className="mt-2 text-xs font-semibold text-[#141b2b]">16:00 – 22:00</div>
                      <div className="mt-1 text-[11px] text-[#166534] font-bold">Auto-calculated: 6.0 hrs</div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-[#e1e8fd] text-[11px] text-[#707a6f]">
                      Store close &amp; clean
                    </div>
                  </div>
                </div>

                {/* Shift Coverage Visual Timeline Bar */}
                <div className="mt-6 p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#707a6f] tracking-wider block mb-2">
                    Visual Coverage Timeline (08:00 – 22:00)
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-16 font-semibold text-[#141b2b]">Morning</span>
                      <div className="flex-1 bg-white h-3.5 rounded-full overflow-hidden border border-[#e1e8fd]">
                        <div className="h-full bg-[#166534] rounded-full" style={{ width: '57%' }}></div>
                      </div>
                      <span className="text-[11px] text-[#707a6f] w-12 text-right">8 hrs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 font-semibold text-[#141b2b]">Mid</span>
                      <div className="flex-1 bg-white h-3.5 rounded-full overflow-hidden border border-[#e1e8fd]">
                        <div className="h-full bg-[#2d6a48] rounded-full" style={{ width: '57%', marginLeft: '28%' }}></div>
                      </div>
                      <span className="text-[11px] text-[#707a6f] w-12 text-right">8 hrs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 font-semibold text-[#141b2b]">Evening</span>
                      <div className="flex-1 bg-white h-3.5 rounded-full overflow-hidden border border-[#e1e8fd]">
                        <div className="h-full bg-slate-700 rounded-full" style={{ width: '43%', marginLeft: '57%' }}></div>
                      </div>
                      <span className="text-[11px] text-[#707a6f] w-12 text-right">6 hrs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-[#f1f3ff] mt-6">
                  <button
                    onClick={() => setActivePane('step-2')}
                    className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setActivePane('step-4')}
                    className="px-6 py-2.5 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <span>Continue to Staffing</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                  Rest Rule Safety
                </span>
                <div className="mt-3 space-y-2 text-[#404940]">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#166534] text-[18px]">verified</span>
                    <span>Minimum 12 hours between consecutive shifts guaranteed to prevent burnout.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#166534] text-[18px]">verified</span>
                    <span>No back-to-back Clopening (closing evening shift followed by next morning opener).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: STAFFING */}
        {activePane === 'step-4' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e1e8fd]">
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold">
                    Step 4 of 5
                  </span>
                  <h2 className="text-xl font-bold text-[#141b2b]">How many people do you need?</h2>
                  <p className="text-xs text-[#707a6f] mt-0.5">
                    Set headcounts required for each shift window to guarantee smooth customer service.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e1e8fd]">
                    <div>
                      <div className="font-bold text-[#141b2b]">Morning Shift (08:00 – 16:00)</div>
                      <div className="text-[#707a6f] text-[11px]">High espresso and takeaway volume</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMorningNeeded(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#e1e8fd] font-bold border border-[#e1e8fd]"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-6 text-center tabular-nums">{morningNeeded}</span>
                      <button
                        type="button"
                        onClick={() => setMorningNeeded(prev => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#e1e8fd] font-bold border border-[#e1e8fd]"
                      >
                        +
                      </button>
                      <span className="text-[#707a6f] text-[11px] ml-1">staff required</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e1e8fd]">
                    <div>
                      <div className="font-bold text-[#141b2b]">Mid Shift (12:00 – 20:00)</div>
                      <div className="text-[#707a6f] text-[11px]">Lunch rush handoff &amp; stock restock</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMidNeeded(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#e1e8fd] font-bold border border-[#e1e8fd]"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-6 text-center tabular-nums">{midNeeded}</span>
                      <button
                        type="button"
                        onClick={() => setMidNeeded(prev => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#e1e8fd] font-bold border border-[#e1e8fd]"
                      >
                        +
                      </button>
                      <span className="text-[#707a6f] text-[11px] ml-1">staff required</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f1f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e1e8fd]">
                    <div>
                      <div className="font-bold text-[#141b2b]">Evening Shift (16:00 – 22:00)</div>
                      <div className="text-[#707a6f] text-[11px]">Evening dine-in &amp; kitchen sanitization</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEveningNeeded(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#e1e8fd] font-bold border border-[#e1e8fd]"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-6 text-center tabular-nums">{eveningNeeded}</span>
                      <button
                        type="button"
                        onClick={() => setEveningNeeded(prev => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#e1e8fd] font-bold border border-[#e1e8fd]"
                      >
                        +
                      </button>
                      <span className="text-[#707a6f] text-[11px] ml-1">staff required</span>
                    </div>
                  </div>
                </div>

                {/* Skill Matching Section */}
                <div className="mt-6 p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#141b2b]">Do any shifts need specific skills?</h4>
                      <p className="text-[#707a6f] mt-0.5">Require certified Baristas or Supervisors for specific shifts.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSkills}
                      onChange={e => setEnableSkills(e.target.checked)}
                      className="w-4 h-4 accent-[#166534]"
                    />
                  </div>

                  {enableSkills && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-[#e1e8fd]">
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#e1e8fd]">
                        <span className="font-bold text-[#141b2b]">Morning Shift:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] font-semibold text-[10px]">
                            Min 1 Barista (L2+)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#f1f3ff] text-[#141b2b] font-semibold text-[10px] border border-[#e1e8fd]">
                            Min 1 Cashier
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#e1e8fd]">
                        <span className="font-bold text-[#141b2b]">Evening Shift:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] font-semibold text-[10px]">
                            Min 1 Shift Supervisor
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#f1f3ff] text-[#141b2b] font-semibold text-[10px] border border-[#e1e8fd]">
                            Min 1 Kitchen Prep
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-[#f1f3ff] mt-6">
                  <button
                    onClick={() => setActivePane('step-3')}
                    className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setActivePane('step-5')}
                    className="px-6 py-2.5 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <span>Continue to Review</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e1e8fd] text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                  Coverage Feasibility
                </span>
                <div className="mt-3 space-y-2.5 text-[#404940]">
                  <div className="p-3 rounded-lg bg-[#b0f1c7]/40 border border-[#b0f1c7] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#166534] text-[18px]">check_circle</span>
                    <span>
                      9 staff slots/day across {customTeam.length} enrolled members is mathematically feasible with fair rotations.
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#707a6f]">Daily Total Hours:</span>
                    <span className="font-bold text-[#141b2b]">22 hrs / day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#707a6f]">Weekly Total Hours:</span>
                    <span className="font-bold text-[#141b2b]">154 hrs / week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUMMARY */}
        {activePane === 'step-5' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e1e8fd]">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold">
                  Step 5 of 5
                </span>
                <h2 className="text-xl font-bold text-[#141b2b]">Review &amp; Generate Schedule</h2>
                <p className="text-xs text-[#707a6f] mt-0.5">
                  Review your business setup. When you tap Build, our engine solves the roster in under 2 seconds.
                </p>
              </div>

              {/* Review Summary Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Business Card */}
                <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                        1. Business Profile
                      </span>
                      <button
                        onClick={() => setActivePane('step-1')}
                        className="text-[#166534] hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-[#141b2b] mt-1">{bizName}</h4>
                    <p className="text-[#707a6f] text-[11px] mt-0.5">{bizType} · {bizLocation}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#e1e8fd] text-[#707a6f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#166534]">storefront</span>
                    <span>Store #4 Active</span>
                  </div>
                </div>

                {/* Team Card */}
                <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                        2. Team Roster
                      </span>
                      <button
                        onClick={() => setActivePane('step-2')}
                        className="text-[#166534] hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-[#141b2b] mt-1">{customTeam.length} Enrolled Members</h4>
                    <p className="text-[#707a6f] text-[11px] mt-0.5">Avg. rate ₹241.40/hr · 250 weekly capacity</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#e1e8fd] text-[#707a6f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#166534]">groups</span>
                    <span>2 Certified Supervisors available</span>
                  </div>
                </div>

                {/* Shifts Card */}
                <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                        3. Shifts Configured
                      </span>
                      <button
                        onClick={() => setActivePane('step-3')}
                        className="text-[#166534] hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-[#141b2b] mt-1">3 Daily Shifts</h4>
                    <p className="text-[#707a6f] text-[11px] mt-0.5">Morning (8h), Mid (8h), Evening (6h)</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#e1e8fd] text-[#707a6f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#166534]">timelapse</span>
                    <span>08:00 to 22:00 operating cycle</span>
                  </div>
                </div>

                {/* Staffing Card */}
                <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                        4. Staffing Requirements
                      </span>
                      <button
                        onClick={() => setActivePane('step-4')}
                        className="text-[#166534] hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-[#141b2b] mt-1">9 Daily Slots Needed</h4>
                    <p className="text-[#707a6f] text-[11px] mt-0.5">Morning: {morningNeeded} · Mid: {midNeeded} · Evening: {eveningNeeded}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#e1e8fd] text-[#707a6f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#166534]">policy</span>
                    <span>Max 40h/wk &amp; 12h rest rules enabled</span>
                  </div>
                </div>
              </div>

              {/* Massive High-Impact CTA Box */}
              <div className="mt-6 p-8 rounded-2xl bg-gradient-to-r from-[#166534] via-[#004c22] to-[#2d6a48] text-white text-center flex flex-col items-center justify-center shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b0f1c7] mb-1">
                  Instant Automated Optimization
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to solve your perfect roster?</h3>
                <p className="text-xs text-[#dce2f7] max-w-lg mb-6 leading-relaxed">
                  OptiShift will balance availability, labor regulations, rest intervals, and store budget in a single click.
                </p>
                <button
                  onClick={handleStartSolve}
                  className="px-8 py-3.5 rounded-xl bg-white text-[#166534] hover:bg-[#b0f1c7] transition-all font-bold text-sm shadow-md flex items-center gap-2 transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span>⚡ Build My Schedule</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-start border-t border-[#f1f3ff] mt-6">
                <button
                  onClick={() => setActivePane('step-4')}
                  className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Staffing</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE VIEW: SUCCESS & BENCHMARK */}
        {activePane === 'state-success' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Success Banner */}
            <div className="p-5 rounded-2xl bg-[#b0f1c7] text-[#004c22] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-[#166534]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#166534] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">check_circle</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#004c22]">Your Schedule is Ready!</h2>
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#166534] text-[10px] font-bold uppercase">
                      Solved in 1.4s
                    </span>
                  </div>
                  <p className="text-xs text-[#004c22]/90 mt-0.5">
                    {bizName} · Week of Oct 21 – Oct 27 · Zero compliance breaches
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-stretch md:self-auto">
                <button
                  onClick={() => setActivePane('step-5')}
                  className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-white text-[#141b2b] text-xs font-semibold hover:bg-[#f1f3ff] shadow-xs"
                >
                  Adjust &amp; Re-run
                </button>
                <button
                  onClick={() => setActiveScreen('schedule')}
                  className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#004c22] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  <span>View Full Schedule</span>
                </button>
              </div>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-white shadow-xs border border-[#e1e8fd]">
                <span className="text-[10px] uppercase font-bold text-[#707a6f]">Staffing Coverage</span>
                <div className="text-2xl font-bold text-[#166534] mt-1">100%</div>
                <div className="text-xs text-[#2d6a48] mt-1 font-medium">All 63 shift slots filled</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-xs border border-[#e1e8fd]">
                <span className="text-[10px] uppercase font-bold text-[#707a6f]">Total Staff Cost</span>
                <div className="text-2xl font-bold text-[#141b2b] mt-1 tabular-nums">₹39,450</div>
                <div className="text-xs text-[#166534] mt-1 font-bold">11.9% under budget</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-xs border border-[#e1e8fd]">
                <span className="text-[10px] uppercase font-bold text-[#707a6f]">Overtime Hours</span>
                <div className="text-2xl font-bold text-[#166534] mt-1">0 hrs</div>
                <div className="text-xs text-[#2d6a48] mt-1 font-medium">Zero overtime penalty</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-xs border border-[#e1e8fd]">
                <span className="text-[10px] uppercase font-bold text-[#707a6f]">Fairness Score</span>
                <div className="text-2xl font-bold text-[#141b2b] mt-1">94/100</div>
                <div className="text-xs text-[#2d6a48] mt-1 font-medium">Even weekend balance</div>
              </div>
            </div>

            {/* How this schedule compares: Benchmark Module */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e1e8fd]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#166534]">
                    Comparative Analysis
                  </span>
                  <h3 className="text-lg font-bold text-[#141b2b] mt-0.5">How this schedule compares</h3>
                  <p className="text-xs text-[#707a6f]">
                    Benchmarked against standard manual spreadsheet scheduling for this store profile.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-xl bg-[#b0f1c7] text-[#004c22] text-xs font-bold self-start">
                  ₹5,350 Net Weekly Savings
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Manual Method Card */}
                <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-[#141b2b]">Manual / Usual Method</span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#707a6f] text-[10px] border border-[#e1e8fd]">
                        Standard Spreadsheet
                      </span>
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Estimated Weekly Payroll:</span>
                        <span className="font-semibold text-[#141b2b]">₹44,800</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Coverage Consistency:</span>
                        <span className="font-semibold text-red-600">89% (7 empty gaps)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Unplanned Overtime:</span>
                        <span className="font-semibold text-red-600">14 extra hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Manager Time Spent:</span>
                        <span className="font-semibold text-[#141b2b]">~4.5 hours / week</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#e1e8fd] text-[11px] text-[#707a6f] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
                    <span>Frequent clopening fatigue risks</span>
                  </div>
                </div>

                {/* OptiShift Algorithmic Card */}
                <div className="p-4 rounded-xl bg-[#b0f1c7]/30 border-2 border-[#166534]/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-[#166534]">OptiShift AI Engine</span>
                      <span className="px-2 py-0.5 rounded bg-[#166534] text-white text-[10px] font-bold">
                        Optimized Output
                      </span>
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Final Weekly Payroll:</span>
                        <span className="font-bold text-[#166534]">₹39,450 (-11.9%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Coverage Consistency:</span>
                        <span className="font-bold text-[#166534]">100% (All shifts filled)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Unplanned Overtime:</span>
                        <span className="font-bold text-[#166534]">0 hrs (Strict enforcement)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#707a6f]">Manager Time Spent:</span>
                        <span className="font-bold text-[#166534]">1.4 seconds</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#b0f1c7] text-[11px] text-[#166534] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>100% compliance with rest &amp; labor rules</span>
                  </div>
                </div>
              </div>

              {/* Explainability Accordion */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] text-xs">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-[#141b2b]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#166534]">psychology</span>
                      <span>Why this schedule? (Explainability &amp; Reasoning)</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-3 pt-2 border-t border-[#e1e8fd] space-y-2 text-[#404940] leading-relaxed">
                    <p>
                      1. <strong className="text-[#141b2b]">Skill Verification:</strong> Every Morning shift has been assigned either Rohan Verma or Tanya Sen, satisfying the L2 Barista constraint.
                    </p>
                    <p>
                      2. <strong className="text-[#141b2b]">Zero Clopening Protection:</strong> Sneha Roy and David Lobo both have at least 15 hours between consecutive evening and morning appearances.
                    </p>
                    <p>
                      3. <strong className="text-[#141b2b]">Fair Weekend Load:</strong> Saturday and Sunday duties have been distributed symmetrically so no single team member worked both closing shifts.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* STATE VIEW: INFEASIBLE GUIDANCE */}
        {activePane === 'state-infeasible' && (
          <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e1e8fd]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">report_problem</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-600">
                    Schedule Conflict Detected
                  </span>
                  <h2 className="text-lg font-bold text-[#141b2b] mt-0.5">
                    We Couldn't Build This Schedule Yet
                  </h2>
                  <p className="text-xs text-[#707a6f] mt-1 leading-relaxed">
                    Your staffing requirements exceed the available hours or rest rules for your team on Friday evening.
                  </p>
                </div>
              </div>

              {/* Diagnostic Card */}
              <div className="mt-5 p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] text-xs">
                <h4 className="font-bold text-[#141b2b] mb-1">Root Cause Analysis</h4>
                <div className="p-3 rounded-lg bg-white border border-[#e1e8fd] space-y-1">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    <span>Friday Evening Shift (16:00 – 22:00):</span>
                  </div>
                  <p className="text-[#404940] pl-3">
                    Requires <strong className="text-[#141b2b]">4 staff members</strong>, but only <strong className="text-[#141b2b]">2 eligible members</strong> are available without violating the 12-hour rest rule before Saturday morning.
                  </p>
                </div>
              </div>

              {/* Actionable Paths */}
              <div className="mt-5 text-xs">
                <h4 className="font-bold text-[#141b2b] mb-2">How would you like to resolve this?</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEveningNeeded(3);
                      setActivePane('step-4');
                      setToastMessage('Adjusted Friday Evening required staff to 3.');
                    }}
                    className="w-full p-3.5 rounded-xl bg-[#f1f3ff] hover:bg-[#e1e8fd] border border-[#e1e8fd] transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#166534] text-[18px]">group_remove</span>
                      <div>
                        <div className="font-bold text-[#141b2b]">Option A: Reduce Friday Evening Staffing</div>
                        <div className="text-[#707a6f] text-[11px]">Adjust required staff from 4 to 3 members on Friday evening.</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#707a6f] text-[18px]">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePane('step-2');
                      setToastMessage('Select team members to expand Friday night availability.');
                    }}
                    className="w-full p-3.5 rounded-xl bg-[#f1f3ff] hover:bg-[#e1e8fd] border border-[#e1e8fd] transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#166534] text-[18px]">event_available</span>
                      <div>
                        <div className="font-bold text-[#141b2b]">Option B: Expand Team Availability</div>
                        <div className="text-[#707a6f] text-[11px]">Allow Rohan or Sneha to pick up Friday night shifts.</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#707a6f] text-[18px]">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePane('step-5');
                      setToastMessage('Relaxed rest turnaround to 10h for weekend rotation.');
                    }}
                    className="w-full p-3.5 rounded-xl bg-[#f1f3ff] hover:bg-[#e1e8fd] border border-[#e1e8fd] transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#707a6f] text-[18px]">rule_settings</span>
                      <div>
                        <div className="font-bold text-[#141b2b]">Option C: Relax Rest Gap for Weekend (10h)</div>
                        <div className="text-[#707a6f] text-[11px]">Permit a temporary 10-hour gap between Friday close and Saturday open.</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#707a6f] text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-[#f1f3ff] mt-6">
                <button
                  onClick={() => setActivePane('step-5')}
                  className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold"
                >
                  Return to Review
                </button>
                <button
                  onClick={() => setActivePane('step-4')}
                  className="px-5 py-2.5 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] text-xs font-bold shadow-xs"
                >
                  Adjust Staffing Needs →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Building Schedule Animation */}
      {showBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#293040]/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl flex flex-col border border-[#e1e8fd] animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#166534] text-[24px] animate-spin">
                  sync
                </span>
                <h3 className="font-bold text-base text-[#141b2b]">Building Your Schedule...</h3>
              </div>
            </div>
            <p className="text-xs text-[#707a6f] mb-6">
              OptiShift is evaluating combinations to create your most cost-effective and fair schedule.
            </p>

            <div className="space-y-3 mb-6 text-xs">
              <div className="flex items-center gap-2 text-[#141b2b]">
                <span className="material-symbols-outlined text-[#166534] text-[18px]">check_circle</span>
                <span className="font-semibold">Checking your team ({customTeam.length} members active)</span>
              </div>
              <div className="flex items-center gap-2 text-[#141b2b]">
                <span className="material-symbols-outlined text-[#166534] text-[18px]">check_circle</span>
                <span className="font-semibold">Checking when people can work</span>
              </div>
              <div className="flex items-center gap-2 text-[#141b2b]">
                <span className="material-symbols-outlined text-[#166534] text-[18px]">check_circle</span>
                <span className="font-semibold">Checking rest &amp; overtime rules</span>
              </div>
              <div className="flex items-center gap-2 text-[#166534] font-bold">
                <span className="w-4 h-4 rounded-full border-2 border-[#166534] border-t-transparent animate-spin inline-block"></span>
                <span>Building the best schedule...</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowBuildingModal(false);
                  setActivePane('state-success');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#004c22]"
              >
                Complete Build Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Modal: Add Staff Member to Custom Builder */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#293040]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#e1e8fd] text-xs">
            <h3 className="font-bold text-sm text-[#141b2b] mb-3">Add Custom Staff Member</h3>
            <form onSubmit={handleAddStaffMember} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  placeholder="e.g. Alok Sharma"
                  className="w-full h-8 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none border border-[#e1e8fd]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newStaffRole}
                    onChange={e => setNewStaffRole(e.target.value)}
                    placeholder="e.g. Barista"
                    className="w-full h-8 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none border border-[#e1e8fd]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hourly Pay (₹)</label>
                  <input
                    type="number"
                    required
                    value={newStaffPay}
                    onChange={e => setNewStaffPay(Number(e.target.value))}
                    className="w-full h-8 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none border border-[#e1e8fd]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Max Weekly Hours</label>
                <input
                  type="number"
                  value={newStaffHours}
                  onChange={e => setNewStaffHours(Number(e.target.value))}
                  className="w-full h-8 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none border border-[#e1e8fd]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#f1f3ff]">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#f1f3ff] text-[#141b2b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#166534] text-white font-bold"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
