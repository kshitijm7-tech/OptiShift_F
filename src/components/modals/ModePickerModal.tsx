import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';

export const ModePickerModal: React.FC = () => {
  const {
    showModePickerModal,
    setShowModePickerModal,
    operatingMode,
    setOperatingMode,
    setActiveScreen,
    resetDemoData,
    setToastMessage
  } = useSchedule();

  if (!showModePickerModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#293040]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-[#e1e8fd]">
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e8fd] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b0f1c7] text-[#004c22] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">layers</span>
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#141b2b]">Choose OptiShift Mode</h3>
              <p className="text-xs text-[#707a6f]">Optimized for 2-person Algothon evaluation</p>
            </div>
          </div>
          <button
            onClick={() => setShowModePickerModal(false)}
            className="text-[#707a6f] hover:text-[#141b2b] p-1 rounded-lg hover:bg-[#f1f3ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Option 1: Demo Mode */}
          <div
            onClick={() => {
              setOperatingMode('demo');
              resetDemoData();
              setActiveScreen('overview');
              setShowModePickerModal(false);
              setToastMessage('Switched to Mode 1: UrbanBrew Café Demo.');
            }}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              operatingMode === 'demo'
                ? 'border-[#166534] bg-[#b0f1c7]/20 shadow-sm'
                : 'border-[#e1e8fd] hover:border-[#166534]/50 bg-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#141b2b]">Mode 1 — 🚀 Explore Demo</span>
                {operatingMode === 'demo' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#166534] text-white text-[10px] font-bold uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#404940] mt-1 leading-relaxed">
                Preloaded realistic dataset: <strong>UrbanBrew Café — Mumbai</strong>. 8 employees, 7 days, 3 shift types, approved leaves, and verified 11.7% cost savings benchmark.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#166534] font-semibold">
                <span>Instant Ready</span> · <span>Zero Configuration Required</span>
              </div>
            </div>
          </div>

          {/* Option 2: Custom Mode */}
          <div
            onClick={() => {
              setOperatingMode('custom');
              setActiveScreen('custom-builder');
              setShowModePickerModal(false);
              setToastMessage('Switched to Mode 2: Custom Problem Builder.');
            }}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              operatingMode === 'custom'
                ? 'border-[#166534] bg-[#b0f1c7]/20 shadow-sm'
                : 'border-[#e1e8fd] hover:border-[#166534]/50 bg-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#2d6a48] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">handyman</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#141b2b]">Mode 2 — 🛠 Custom Builder</span>
                {operatingMode === 'custom' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#166534] text-white text-[10px] font-bold uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#404940] mt-1 leading-relaxed">
                Judges can define their own scheduling problem: enter custom business name, employees, wage rates, shifts, and staffing constraints to run the optimizer live.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#2d6a48] font-semibold">
                <span>5-Step Guided Wizard</span> · <span>Real MILP Solver</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#e1e8fd] flex justify-end">
          <button
            onClick={() => setShowModePickerModal(false)}
            className="px-4 py-2 rounded-lg bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e1e8fd] text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
