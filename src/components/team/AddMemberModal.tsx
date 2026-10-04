import React, { useState } from 'react';
import { Employee } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Employee, 'id' | 'assignedHours' | 'initials' | 'status'>) => void;
  initialData?: Employee | null;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate || 250);
  const [maxHours, setMaxHours] = useState(initialData?.maxWeeklyHours || 40);
  const [isFullTime, setIsFullTime] = useState(initialData?.isFullTime ?? true);
  const [skills, setSkills] = useState<string[]>(initialData?.skills || ['Coffee Specialist', 'Counter POS']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [availabilityDesc, setAvailabilityDesc] = useState('Mon–Fri 9:00 AM – 6:00 PM');

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    onSave({
      name: name.trim(),
      role: role.trim(),
      isFullTime,
      hourlyRate: Number(hourlyRate) || 240,
      maxWeeklyHours: Number(maxHours) || 40,
      skills: skills.length > 0 ? skills : ['General Operations'],
      availabilityDesc,
      dayAvailability: {
        0: 'morning',
        1: 'morning',
        2: 'any',
        3: 'any',
        4: 'morning',
        5: 'off',
        6: 'off'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#293040]/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-[#e1e8fd]">
        {/* Modal Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#f1f3ff]">
          <div>
            <h2 className="font-bold text-base text-[#141b2b]">
              {initialData ? `Edit ${initialData.name}` : 'Add Team Member'}
            </h2>
            <p className="text-xs text-[#707a6f]">Add the basic details needed to build their schedule.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#707a6f] hover:text-[#141b2b] hover:bg-[#f1f3ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex flex-col gap-5 text-xs">
          {/* Step 1: Basic Details */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#707a6f] font-bold block mb-2">
              Step 1: Basic Details
            </span>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#141b2b] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full h-9 px-3 bg-[#f1f3ff] rounded-lg text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#141b2b] mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Senior Barista"
                    className="w-full h-9 px-3 bg-[#f1f3ff] rounded-lg text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#141b2b] mb-1">Employment Type</label>
                  <select
                    value={isFullTime ? 'full' : 'part'}
                    onChange={e => setIsFullTime(e.target.value === 'full')}
                    className="w-full h-9 px-3 bg-[#f1f3ff] rounded-lg text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                  >
                    <option value="full">Full-time Staff</option>
                    <option value="part">Part-time Staff</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Work & Scheduling Details */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#707a6f] font-bold block mb-2">
              Step 2: Work &amp; Scheduling Details
            </span>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#141b2b] mb-1">Skills &amp; Capabilities</label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#f1f3ff] rounded-lg border border-[#e1e8fd] min-h-[42px]">
                  {skills.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#141b2b] font-medium border border-[#e1e8fd] shadow-xs"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(i)}
                        className="text-[#707a6f] hover:text-red-600 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 ml-1">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={e => setNewSkillInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="+ add skill..."
                      className="h-6 px-2 text-[11px] bg-white rounded border border-[#e1e8fd] focus:outline-none w-24"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-2 py-0.5 rounded bg-[#b0f1c7] text-[#004c22] font-bold text-[10px]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#141b2b] mb-1">Hourly Pay (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#707a6f]">₹</span>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={e => setHourlyRate(Number(e.target.value))}
                      className="w-full h-9 pl-7 pr-3 bg-[#f1f3ff] rounded-lg text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[#141b2b] mb-1">Max Hours / Week</label>
                  <input
                    type="number"
                    value={maxHours}
                    onChange={e => setMaxHours(Number(e.target.value))}
                    className="w-full h-9 px-3 bg-[#f1f3ff] rounded-lg text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Weekly Availability */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#707a6f] font-bold block mb-2">
              Step 3: Weekly Availability
            </span>
            <div className="bg-[#f1f3ff] rounded-xl p-2.5 space-y-1.5 border border-[#e1e8fd]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <div
                  key={day}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e1e8fd] shadow-xs"
                >
                  <span className="font-semibold text-[#141b2b] w-12">{day}</span>
                  <div className="flex items-center gap-2">
                    <select className="h-6 text-[11px] bg-[#f1f3ff] rounded px-2 text-[#141b2b] focus:outline-none border border-[#e1e8fd]">
                      <option>Any Time (Flexible)</option>
                      <option>Morning (7:00 – 15:30)</option>
                      <option>Evening (15:00 – 23:30)</option>
                    </select>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#b0f1c7] text-[#004c22]">
                      Available
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e1e8fd] shadow-xs">
                <span className="font-semibold text-[#141b2b] w-20">Sat &amp; Sun</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e1e8fd] text-[#707a6f]">
                  Available on Rotation
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f1f3ff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#166534] text-white hover:bg-[#004c22] font-semibold shadow-xs"
            >
              Save to My Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
