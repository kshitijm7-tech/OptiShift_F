import React from 'react';
import { LeaveRequest } from '../../types';

interface ApproveLeaveModalProps {
  isOpen: boolean;
  request: LeaveRequest | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApproveLeaveModal: React.FC<ApproveLeaveModalProps> = ({
  isOpen,
  request,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#293040]/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#e1e8fd] p-6">
        <div className="w-12 h-12 rounded-xl bg-[#b0f1c7] text-[#004c22] flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[24px]">verified</span>
        </div>
        <h3 className="font-bold text-lg text-[#141b2b]">
          Approve Time Off for {request.employeeName}?
        </h3>
        <p className="text-xs text-[#404940] mt-1 leading-relaxed">
          {request.dateStr}. {request.employeeName} is currently assigned to <strong>{request.scheduledShift || 'Morning Shift'}</strong>.
        </p>

        {/* AI Solver Recommendation Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#f1f3ff] space-y-2 text-[#141b2b] text-xs border border-[#e1e8fd]">
          <div className="flex items-center justify-between">
            <span className="text-[#707a6f]">Recommended Replacement:</span>
            <span className="font-bold text-[#166534]">
              {request.recommendedReplacement || 'Aisha Khan (Head Barista)'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#707a6f]">Weekly hours impact:</span>
            <span className="font-semibold">32h → 40h (Zero Overtime)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#707a6f]">Skills match:</span>
            <span className="font-bold text-[#166534]">100% Certified</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#004c22] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Approve &amp; Reassign Shift
          </button>
        </div>
      </div>
    </div>
  );
};
