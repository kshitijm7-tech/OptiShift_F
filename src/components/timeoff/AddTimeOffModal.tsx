import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { LeaveRequest } from '../../types';

interface AddTimeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTimeOffModal: React.FC<AddTimeOffModalProps> = ({ isOpen, onClose }) => {
  const { employees, addLeaveRequest, setToastMessage } = useSchedule();
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [startDate, setStartDate] = useState('2024-10-24');
  const [endDate, setEndDate] = useState('2024-10-24');
  const [duration, setDuration] = useState<'Full Day' | 'Morning' | 'Evening'>('Full Day');
  const [category, setCategory] = useState<LeaveRequest['category']>('Personal');
  const [reasonNote, setReasonNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];

    addLeaveRequest({
      employeeId: emp.id,
      employeeName: emp.name,
      employeeRole: emp.role,
      employeeAvatar: emp.avatarUrl,
      dateStr: `${startDate === endDate ? startDate : `${startDate} – ${endDate}`} · ${duration}`,
      dayIndex: 3, // Thursday
      duration,
      category,
      reasonNote: reasonNote.trim() || `${category} leave requested.`
    });

    setToastMessage(`Time off logged for ${emp.name}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#293040]/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#e1e8fd]">
        {/* Modal Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#f1f3ff] bg-[#f1f3ff]/50">
          <div>
            <h3 className="font-bold text-base text-[#141b2b]">Add Time Off</h3>
            <p className="text-xs text-[#707a6f]">
              Record approved absence or manual block-out for a team member
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#707a6f] hover:bg-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Staff Member Select */}
          <div>
            <label className="block font-semibold text-[#141b2b] mb-1">Team Member</label>
            <select
              value={selectedEmpId}
              onChange={e => setSelectedEmpId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#141b2b] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#141b2b] mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
              />
            </div>
          </div>

          {/* Day Part / Duration */}
          <div>
            <label className="block font-semibold text-[#141b2b] mb-1">Time of Day</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Full Day', 'Morning', 'Evening'] as const).map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`p-2 rounded-lg font-semibold text-center transition-all ${
                    duration === d
                      ? 'bg-[#166534] text-white shadow-xs'
                      : 'bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Category */}
          <div>
            <label className="block font-semibold text-[#141b2b] mb-1">Reason Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
            >
              <option value="Personal">Personal Leave</option>
              <option value="Sick / Medical">Sick / Medical</option>
              <option value="Vacation">Scheduled Vacation</option>
              <option value="Family">Family Emergency</option>
              <option value="Education / Exam">Exam / Academic</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-[#141b2b] mb-1">Notes (Optional)</label>
            <textarea
              rows={2}
              value={reasonNote}
              onChange={e => setReasonNote(e.target.value)}
              placeholder="Add context or notes for shift supervisors..."
              className="w-full p-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] placeholder:text-[#707a6f] focus:outline-none focus:bg-white border border-[#e1e8fd]"
            />
          </div>

          {/* Notice */}
          <div className="p-3 rounded-lg bg-[#f1f3ff] flex items-center gap-2 text-[#707a6f] text-[11px] border border-[#e1e8fd]">
            <span className="material-symbols-outlined text-[16px] text-[#166534]">info</span>
            <span>This will instantly become an unavailable constraint in the optimization engine.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f3ff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#166534] hover:bg-[#004c22] text-white font-semibold shadow-xs"
            >
              Save Time Off
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
