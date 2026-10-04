import React from 'react';
import { Employee } from '../../types';

interface MemberDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
  onRemove: (emp: Employee) => void;
}

export const MemberDrawer: React.FC<MemberDrawerProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
  onRemove
}) => {
  if (!isOpen || !employee) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#293040]/40 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-[#e1e8fd] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 bg-white flex items-start justify-between border-b border-[#f1f3ff]">
          <div className="flex items-center gap-3">
            {employee.avatarUrl ? (
              <img
                src={employee.avatarUrl}
                alt={employee.name}
                className="w-12 h-12 rounded-full object-cover shadow-xs ring-2 ring-[#e1e8fd]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#e1e8fd] text-[#141b2b] flex items-center justify-center font-bold text-base">
                {employee.initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-[#141b2b]">{employee.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-[10px] font-bold">
                  {employee.status === 'active' ? 'Active' : 'On Leave'}
                </span>
              </div>
              <span className="text-xs text-[#707a6f]">
                {employee.role} · {employee.isFullTime ? 'Full-time Staff' : 'Part-time Staff'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="px-6 py-2.5 bg-[#f1f3ff] flex items-center justify-between gap-3 border-b border-[#e1e8fd]">
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 py-1.5 px-3 rounded-lg bg-white hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold shadow-xs border border-[#e1e8fd] transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>Edit Details</span>
          </button>
          <button
            onClick={() => onRemove(employee)}
            className="py-1.5 px-3 rounded-lg hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">delete</span>
            <span>Remove</span>
          </button>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Section 1: Work & Pay */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#707a6f] font-bold">
                Work &amp; Pay Details
              </span>
              <span className="text-xs text-[#166534] font-semibold">UrbanBrew Café</span>
            </div>
            <div className="bg-[#f1f3ff] rounded-xl p-4 grid grid-cols-2 gap-3.5 border border-[#e1e8fd]">
              <div>
                <span className="text-[11px] text-[#707a6f] block">Primary Role</span>
                <span className="text-xs font-bold text-[#141b2b] mt-0.5 block">{employee.role}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#707a6f] block">Hourly Pay Rate</span>
                <span className="text-xs font-bold text-[#141b2b] mt-0.5 block tabular-nums">
                  ₹{employee.hourlyRate} / hour
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#707a6f] block">Weekly Hours Cap</span>
                <span className="text-xs font-bold text-[#141b2b] mt-0.5 block">
                  {employee.maxWeeklyHours} hrs / week
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#707a6f] block">Target Scheduled</span>
                <span className="text-xs font-bold text-[#166534] mt-0.5 block">
                  {employee.assignedHours} hrs (This week)
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-[#e1e8fd]">
                <span className="text-[11px] text-[#707a6f] block mb-1.5 font-medium">Registered Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-white text-[#141b2b] text-[11px] font-medium border border-[#e1e8fd] shadow-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Weekly Availability */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#707a6f] font-bold">
                Weekly Availability
              </span>
              <span className="text-xs text-[#707a6f]">Default Pattern</span>
            </div>
            <div className="bg-white rounded-xl border border-[#e1e8fd] shadow-xs overflow-hidden divide-y divide-[#f1f3ff] text-xs">
              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-[#f1f3ff]/40">
                <span className="font-semibold text-[#141b2b] w-24">Monday</span>
                <span className="text-[#404940]">9:00 AM – 6:00 PM</span>
                <span className="px-2 py-0.5 rounded bg-[#b0f1c7] text-[#004c22] font-semibold text-[10px]">
                  Morning / Mid
                </span>
              </div>
              <div className="p-2.5 px-3 flex items-center justify-between bg-[#f1f3ff]/40">
                <span className="font-semibold text-[#707a6f] w-24">Tuesday</span>
                <span className="text-[#707a6f]">Day Off (Recurring)</span>
                <span className="px-2 py-0.5 rounded bg-[#e1e8fd] text-[#707a6f] text-[10px]">
                  Unavailable
                </span>
              </div>
              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-[#f1f3ff]/40">
                <span className="font-semibold text-[#141b2b] w-24">Wednesday</span>
                <span className="text-[#404940]">15:00 – 23:30</span>
                <span className="px-2 py-0.5 rounded bg-[#b0f1c7] text-[#004c22] font-semibold text-[10px]">
                  Evening Shift
                </span>
              </div>
              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-[#f1f3ff]/40">
                <span className="font-semibold text-[#141b2b] w-24">Thursday</span>
                <span className="text-[#404940]">9:00 AM – 6:00 PM</span>
                <span className="px-2 py-0.5 rounded bg-[#b0f1c7] text-[#004c22] font-semibold text-[10px]">
                  Mid Shift
                </span>
              </div>
              <div className="p-2.5 px-3 flex items-center justify-between bg-amber-50">
                <span className="font-semibold text-[#141b2b] w-24">Friday</span>
                <span className="text-amber-800 font-medium">Approved Leave (Personal)</span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                  On Leave
                </span>
              </div>
              <div className="p-2.5 px-3 flex items-center justify-between hover:bg-[#f1f3ff]/40">
                <span className="font-semibold text-[#141b2b] w-24">Saturday</span>
                <span className="text-[#404940]">9:00 AM – 6:00 PM</span>
                <span className="px-2 py-0.5 rounded bg-[#b0f1c7] text-[#004c22] font-semibold text-[10px]">
                  Mid Shift
                </span>
              </div>
              <div className="p-2.5 px-3 flex items-center justify-between bg-[#f1f3ff]/40">
                <span className="font-semibold text-[#707a6f] w-24">Sunday</span>
                <span className="text-[#707a6f]">Day Off</span>
                <span className="px-2 py-0.5 rounded bg-[#e1e8fd] text-[#707a6f] text-[10px]">
                  Unavailable
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Upcoming Time Off */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#707a6f] font-bold">
                Upcoming Time Off
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#f1f3ff] text-[#141b2b] font-semibold">
                1 Scheduled
              </span>
            </div>
            <div className="bg-[#f1f3ff] rounded-xl p-3.5 flex items-center justify-between border border-[#e1e8fd]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#166534] text-[22px]">event_busy</span>
                <div>
                  <span className="text-xs font-bold text-[#141b2b] block">Fri, 18 Oct 2024</span>
                  <span className="text-[11px] text-[#707a6f]">Personal Leave (1 Full Day)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-[10px] font-bold">
                Approved
              </span>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="p-3.5 rounded-xl bg-white border border-[#e1e8fd] shadow-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#166534] text-[18px] mt-0.5">verified_user</span>
            <p className="text-[11px] text-[#404940] leading-relaxed">
              OptiShift automatically respects these hours and time-off bookings when generating weekly schedules.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
