import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';

export const WhatChangedModal: React.FC = () => {
  const { showWhatChangedModal, setShowWhatChangedModal, changelog } = useSchedule();

  if (!showWhatChangedModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#293040]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e1e8fd]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b0f1c7] text-[#004c22] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">published_with_changes</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#141b2b]">See What Changed</h3>
              <p className="text-xs text-[#707a6f]">Optimal schedule rebalancing explanation</p>
            </div>
          </div>
          <button
            aria-label="Close modal"
            onClick={() => setShowWhatChangedModal(false)}
            className="text-[#707a6f] hover:text-[#141b2b] p-1.5 rounded-lg hover:bg-[#f1f3ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Explainability Content */}
        <div className="bg-[#f1f3ff] p-4 rounded-xl flex flex-col gap-3 border border-[#e1e8fd]">
          <span className="text-xs font-bold text-[#141b2b] uppercase tracking-wider">
            Schedule updated because:
          </span>
          <ul className="flex flex-col gap-3 text-xs text-[#404940] leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">event_busy</span>
              <span><strong>Priya Sharma</strong> is taking Friday off (Approved Personal leave).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#166534] shrink-0 mt-0.5">swap_horiz</span>
              <span><strong>Aisha Khan</strong> was moved to Friday morning so customer rush (8:30–11 AM) is fully covered.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#2d6a48] shrink-0 mt-0.5">bedtime</span>
              <span>Everyone still has at least <strong>14 hours of rest</strong> between consecutive shifts (no clopening).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#166534] shrink-0 mt-0.5">savings</span>
              <span>Zero extra hours or overtime added (Staff cost stayed strictly at <strong>₹42,680</strong>).</span>
            </li>
          </ul>
        </div>

        {/* Dynamic Changelog Tags */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-[#707a6f] uppercase tracking-wider block">
            Recent Optimization Events
          </span>
          {changelog.map(item => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg bg-white border border-[#e1e8fd] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#f1f3ff] font-semibold text-[#141b2b]">
                  {item.dayText}
                </span>
                <span className="text-[#404940]">
                  <span className="line-through text-[#707a6f]">{item.prevPerson}</span> → <strong className="text-[#166534]">{item.newPerson}</strong>
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22]">
                {item.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e1e8fd]">
          <button
            onClick={() => setShowWhatChangedModal(false)}
            className="px-4 py-2 rounded-lg bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e1e8fd] text-xs font-semibold transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 rounded-lg bg-[#166534] text-white hover:bg-[#004c22] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
