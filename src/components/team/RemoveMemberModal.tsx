import React from 'react';
import { Employee } from '../../types';

interface RemoveMemberModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onConfirm: (empId: string) => void;
}

export const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({
  isOpen,
  employee,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#293040]/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 border border-[#e1e8fd]">
        <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[24px]">person_remove</span>
        </div>
        <h3 className="font-bold text-lg text-[#141b2b] mb-1">
          Remove {employee.name} from team?
        </h3>
        <p className="text-xs text-[#404940] mb-6 leading-relaxed">
          This person will no longer be included when OptiShift automatically builds future schedules. Existing published schedules will not be changed automatically.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold transition-colors"
          >
            Keep Person
          </button>
          <button
            onClick={() => onConfirm(employee.id)}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-semibold shadow-xs transition-colors"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
};
