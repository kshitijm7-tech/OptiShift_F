import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Employee } from '../../types';
import { AddMemberModal } from './AddMemberModal';
import { MemberDrawer } from './MemberDrawer';
import { RemoveMemberModal } from './RemoveMemberModal';

export const MyTeamScreen: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    resetDemoData,
    setToastMessage
  } = useSchedule();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'active' | 'leave' | 'part-time' | 'full-time'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'hours' | 'pay'>('name');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showEmptyView, setShowEmptyView] = useState(false);

  // Modals & Drawer State
  const [selectedMember, setSelectedMember] = useState<Employee | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Employee | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Employee | null>(null);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(emp => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchSearch =
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.skills.some(s => s.toLowerCase().includes(q));

      if (!matchSearch) return false;

      // Category
      if (categoryFilter === 'active') return emp.status === 'active';
      if (categoryFilter === 'leave') return emp.status === 'on_leave';
      if (categoryFilter === 'part-time') return !emp.isFullTime;
      if (categoryFilter === 'full-time') return emp.isFullTime;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'hours') return b.maxWeeklyHours - a.maxWeeklyHours;
      if (sortBy === 'pay') return b.hourlyRate - a.hourlyRate;
      return 0;
    });

  const availableCount = employees.filter(e => e.status === 'active').length;
  const offTodayCount = employees.filter(e => e.status === 'on_leave').length;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Role,Type,Hourly Rate,Max Hours,Skills,Status']
        .concat(
          employees.map(
            e =>
              `"${e.name}","${e.role}","${e.isFullTime ? 'Full-time' : 'Part-time'}",₹${e.hourlyRate},${e.maxWeeklyHours},"${e.skills.join('; ')}",${e.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UrbanBrew_Team_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage('Exported team list as CSV.');
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Prototype Simulator Bar */}
      <div className="mb-6 p-2 rounded-xl bg-[#f1f3ff] flex flex-wrap items-center justify-between gap-2 shadow-xs border border-[#e1e8fd]">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-[#166534] text-[18px]">tune</span>
          <span className="text-xs text-[#404940] uppercase tracking-wider font-bold">
            Prototype Simulator:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setShowEmptyView(false);
              setToastMessage('Team Directory view active.');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              !showEmptyView
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            Team Directory (Default)
          </button>
          <button
            onClick={() => {
              setSelectedMember(employees[0]);
              setIsDrawerOpen(true);
            }}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all bg-white text-[#404940] hover:bg-[#e1e8fd]"
          >
            View Member Drawer
          </button>
          <button
            onClick={() => {
              setEditingMember(null);
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all bg-white text-[#404940] hover:bg-[#e1e8fd]"
          >
            Add Member Modal
          </button>
          <button
            onClick={() => setMemberToRemove(employees[0])}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all bg-white text-[#404940] hover:bg-[#e1e8fd]"
          >
            Remove Dialog
          </button>
          <button
            onClick={() => {
              setShowEmptyView(true);
              setToastMessage('Empty state simulated.');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              showEmptyView
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404940] hover:bg-[#e1e8fd]'
            }`}
          >
            First-Time Empty State
          </button>
        </div>
      </div>

      {/* Main Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">My Team</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-xs font-bold">
              Active Roster
            </span>
          </div>
          <p className="text-sm text-[#404940] mt-0.5">
            Add your team and tell us when and where they can work.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold shadow-xs border border-[#e1e8fd] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#707a6f]">file_download</span>
            <span>Export List</span>
          </button>
          <button
            onClick={() => {
              setEditingMember(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#004c22] shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Count Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#b0f1c7] text-[#004c22] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#141b2b] tabular-nums">{employees.length}</span>
                <span className="text-xs text-[#707a6f] font-medium">people enrolled</span>
              </div>
              <p className="text-xs text-[#707a6f]">UrbanBrew Café · Core Staff</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#e1e8fd] hidden sm:block"></div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#166534]"></span>
                <span className="text-xs font-bold text-[#141b2b]">{availableCount} Available</span>
              </div>
              <span className="text-[11px] text-[#707a6f]">Ready for today</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2d6a48]"></span>
                <span className="text-xs font-bold text-[#141b2b]">{offTodayCount} Off Today</span>
              </div>
              <span className="text-[11px] text-[#707a6f]">Rest day or leave</span>
            </div>
          </div>
        </div>

        {/* Explainability / Why we ask for this */}
        <div className="lg:col-span-6 bg-[#f1f3ff] rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#b0f1c7] text-[#004c22] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#141b2b]">Why we ask for this:</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#e1e8fd] text-[#404940] font-semibold">
                Algorithmic Balance
              </span>
            </div>
            <p className="text-xs text-[#404940] mt-1 leading-relaxed">
              OptiShift cross-references individual skill levels, weekly maximum hours, and explicit shift preferences to automatically generate compliant, conflict-free shift rosters in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Conditional View: Directory or First-Time Empty */}
      {showEmptyView ? (
        <div className="bg-white rounded-2xl shadow-xs border border-[#e1e8fd] p-12 text-center max-w-xl mx-auto my-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#f1f3ff] text-[#166534] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[36px]">group_add</span>
          </div>
          <h2 className="text-lg font-bold text-[#141b2b] mb-1">Add your first team member</h2>
          <p className="text-xs text-[#404940] max-w-md mx-auto mb-6 leading-relaxed">
            Add the people who work at your business so OptiShift can build a schedule for you. You can configure their work hours, skills, availability, and weekly limits anytime.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingMember(null);
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#166534] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#004c22]"
            >
              + Add Team Member
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setShowEmptyView(false);
              }}
              className="px-4 py-2.5 bg-[#f1f3ff] text-[#141b2b] rounded-xl text-xs font-semibold hover:bg-[#e1e8fd]"
            >
              Load Sample Café Roster
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e1e8fd] mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#707a6f] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your team by name, role, or skill..."
                className="w-full h-9 pl-9 pr-3 bg-[#f1f3ff] rounded-lg text-xs text-[#141b2b] placeholder:text-[#707a6f] focus:outline-none focus:bg-white border border-[#e1e8fd]"
              />
            </div>

            {/* Category Filter Pills & Sort */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-[#f1f3ff] text-xs">
                {(
                  [
                    { id: 'all', label: `All (${employees.length})` },
                    { id: 'active', label: `Active (${availableCount})` },
                    { id: 'leave', label: `On Leave (${offTodayCount})` },
                    { id: 'part-time', label: `Part-time (${employees.filter(e => !e.isFullTime).length})` },
                    { id: 'full-time', label: `Full-time (${employees.filter(e => e.isFullTime).length})` }
                  ] as const
                ).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      categoryFilter === cat.id
                        ? 'font-bold bg-white text-[#141b2b] shadow-xs'
                        : 'text-[#404940] hover:text-[#141b2b]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-[#f1f3ff] hover:bg-[#e1e8fd] text-xs font-semibold text-[#141b2b] border border-[#e1e8fd]"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#707a6f]">sort</span>
                  <span>
                    Sort: {sortBy === 'name' ? 'Name (A-Z)' : sortBy === 'hours' ? 'Target Hours' : 'Hourly Pay'}
                  </span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white shadow-xl border border-[#e1e8fd] py-1 z-30 text-xs">
                    <button
                      onClick={() => {
                        setSortBy('name');
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-[#141b2b] hover:bg-[#f1f3ff] flex items-center justify-between"
                    >
                      <span>Name (A-Z)</span>
                      {sortBy === 'name' && <span className="material-symbols-outlined text-sm text-[#166534]">check</span>}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('hours');
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-[#141b2b] hover:bg-[#f1f3ff] flex items-center justify-between"
                    >
                      <span>Target Hours (High-Low)</span>
                      {sortBy === 'hours' && <span className="material-symbols-outlined text-sm text-[#166534]">check</span>}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('pay');
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-[#141b2b] hover:bg-[#f1f3ff] flex items-center justify-between"
                    >
                      <span>Hourly Pay (High-Low)</span>
                      {sortBy === 'pay' && <span className="material-symbols-outlined text-sm text-[#166534]">check</span>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Roster Data Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#e1e8fd] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f1f3ff] text-[#707a6f] uppercase font-bold text-[10px] tracking-wider border-b border-[#e1e8fd]">
                    <th className="py-3 px-5">Person</th>
                    <th className="py-3 px-3">Skills</th>
                    <th className="py-3 px-3">Weekly Availability</th>
                    <th className="py-3 px-3 text-right">Hourly Rate</th>
                    <th className="py-3 px-3">Assigned / Max Hours</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3ff]">
                  {filteredEmployees.map(emp => {
                    const pct = Math.min(100, Math.round((emp.assignedHours / emp.maxWeeklyHours) * 100));

                    return (
                      <tr
                        key={emp.id}
                        onClick={() => {
                          setSelectedMember(emp);
                          setIsDrawerOpen(true);
                        }}
                        className="hover:bg-[#f1f3ff]/50 transition-colors cursor-pointer group"
                      >
                        {/* Person Column */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              {emp.avatarUrl ? (
                                <img
                                  src={emp.avatarUrl}
                                  alt={emp.name}
                                  className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-[#e1e8fd]"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-[#e1e8fd] text-[#141b2b] flex items-center justify-center font-bold text-xs">
                                  {emp.initials}
                                </div>
                              )}
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                                  emp.status === 'active' ? 'bg-[#166534]' : 'bg-amber-500'
                                }`}
                              ></span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#141b2b] group-hover:text-[#166534] transition-colors truncate">
                                  {emp.name}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#f1f3ff] text-[#707a6f]">
                                  {emp.isFullTime ? 'Full-time' : 'Part-time'}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#707a6f] block truncate">{emp.role}</span>
                            </div>
                          </div>
                        </td>

                        {/* Skills Column */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1 max-w-[210px]">
                            {emp.skills.slice(0, 2).map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full bg-[#f1f3ff] text-[#404940] text-[10px] font-medium border border-[#e1e8fd]"
                              >
                                {s}
                              </span>
                            ))}
                            {emp.skills.length > 2 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#f1f3ff] text-[#707a6f] text-[10px]">
                                +{emp.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Weekly Availability */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#141b2b]">
                              {emp.dayAvailability[0] === 'off' && emp.dayAvailability[6] === 'off' ? 'Tue–Sat' : 'Mon–Fri'}
                            </span>
                            <span className="text-[11px] text-[#707a6f] truncate">{emp.availabilityDesc}</span>
                          </div>
                        </td>

                        {/* Hourly Rate */}
                        <td className="py-3.5 px-3 text-right tabular-nums">
                          <span className="font-bold text-[#141b2b]">₹{emp.hourlyRate}</span>
                          <span className="text-[10px] text-[#707a6f]">/hr</span>
                        </td>

                        {/* Assigned / Max Hours Progress */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col gap-1 w-28">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-bold text-[#141b2b]">{emp.assignedHours} hrs</span>
                              <span className="text-[#707a6f]">/ {emp.maxWeeklyHours}h</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#f1f3ff] overflow-hidden border border-[#e1e8fd]">
                              <div
                                className="bg-[#166534] h-full rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          {emp.status === 'active' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              On Leave (Fri)
                            </span>
                          )}
                        </td>

                        {/* Row Action Menu */}
                        <td
                          className="py-3.5 px-5 text-right relative"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setOpenRowMenuId(prev => (prev === emp.id ? null : emp.id))
                            }
                            className="p-1 rounded-lg text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff]"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                          </button>

                          {openRowMenuId === emp.id && (
                            <div className="absolute right-6 top-10 w-36 rounded-xl bg-white shadow-xl border border-[#e1e8fd] py-1 z-30 text-left text-xs animate-in fade-in">
                              <button
                                onClick={() => {
                                  setSelectedMember(emp);
                                  setIsDrawerOpen(true);
                                  setOpenRowMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-[#141b2b] hover:bg-[#f1f3ff] flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm text-[#707a6f]">visibility</span>
                                <span>View details</span>
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMember(emp);
                                  setIsAddModalOpen(true);
                                  setOpenRowMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-[#141b2b] hover:bg-[#f1f3ff] flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm text-[#707a6f]">edit</span>
                                <span>Edit member</span>
                              </button>
                              <button
                                onClick={() => {
                                  setMemberToRemove(emp);
                                  setOpenRowMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm text-red-600">delete</span>
                                <span>Remove</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Capacity Footer */}
            <div className="px-5 py-3 bg-[#f1f3ff]/60 border-t border-[#e1e8fd] flex flex-col sm:flex-row items-center justify-between gap-2 text-[#707a6f] text-xs">
              <div className="flex items-center gap-2">
                <span>Showing {filteredEmployees.length} of {employees.length} team members</span>
                <span>·</span>
                <span>
                  Total Weekly Capacity: <strong>283.5 / 298 hrs</strong> (95.1% scheduled)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#166534]"></span> Optimal capacity load
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Leave booked
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Details Drawer */}
      <MemberDrawer
        employee={selectedMember}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={emp => {
          setIsDrawerOpen(false);
          setEditingMember(emp);
          setIsAddModalOpen(true);
        }}
        onRemove={emp => {
          setIsDrawerOpen(false);
          setMemberToRemove(emp);
        }}
      />

      {/* Add / Edit Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        initialData={editingMember}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMember(null);
        }}
        onSave={data => {
          if (editingMember) {
            updateEmployee(editingMember.id, data);
          } else {
            addEmployee(data);
          }
        }}
      />

      {/* Remove Confirmation Dialog */}
      <RemoveMemberModal
        isOpen={!!memberToRemove}
        employee={memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={id => {
          removeEmployee(id);
          setMemberToRemove(null);
        }}
      />
    </div>
  );
};
