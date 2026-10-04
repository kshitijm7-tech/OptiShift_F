import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';

export const Header: React.FC = () => {
  const {
    business,
    operatingMode,
    setShowModePickerModal,
    triggerReoptimize,
    isOptimizing,
    setToastMessage
  } = useSchedule();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#e1e8fd] shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-6">
      {/* Left: Store Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowModePickerModal(true)}
          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#e1e8fd] shadow-xs hover:bg-[#f1f3ff] transition-all text-left group"
        >
          <span className="material-symbols-outlined text-[#166534] text-[18px]">
            storefront
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#141b2b] leading-tight group-hover:text-[#166534] transition-colors">
              {business.name}
            </span>
            <span className="text-[10px] text-[#707a6f] leading-none">
              {business.location}
            </span>
          </div>
          <span className="material-symbols-outlined text-[#707a6f] text-sm ml-1">
            expand_more
          </span>
        </button>

        {/* Operating Mode Indicator */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e9edff] text-[#2d6a48] text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#166534] animate-pulse"></span>
          {operatingMode === 'demo' ? 'Mode 1: Demo Showcase' : 'Mode 2: Custom Optimization'}
        </span>
      </div>

      {/* Right: Quick actions & profile */}
      <div className="flex items-center gap-4">
        {/* Quick solve button */}
        <button
          onClick={triggerReoptimize}
          disabled={isOptimizing}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004c22] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-60"
        >
          <span className={`material-symbols-outlined text-[16px] ${isOptimizing ? 'animate-spin' : ''}`}>
            {isOptimizing ? 'sync' : 'auto_fix_high'}
          </span>
          <span>{isOptimizing ? 'Optimizing...' : 'Run Solver'}</span>
        </button>

        {/* Switch Mode Button */}
        <button
          onClick={() => setShowModePickerModal(true)}
          className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#e1e8fd] text-xs font-medium text-[#404940] hover:text-[#141b2b] hover:bg-[#f1f3ff] transition-all"
        >
          <span className="material-symbols-outlined text-[16px] text-[#2d6a48]">swap_horiz</span>
          <span>{operatingMode === 'demo' ? 'Create Custom' : 'Load Demo'}</span>
        </button>

        {/* Notification Bell */}
        <button
          aria-label="Notifications"
          onClick={() => setToastMessage('You have 2 pending leave requests requiring review.')}
          className="relative p-1.5 rounded-xl text-[#404940] hover:text-[#141b2b] hover:bg-[#f1f3ff] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#e1e8fd]">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-[#141b2b] leading-tight">Alex Morgan</div>
            <div className="text-[10px] text-[#707a6f] leading-none">Store Owner</div>
          </div>
          <img
            alt="Alex Morgan profile avatar"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#bfc9bd]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1ULF42LAEkd7qJAhWNMQvd6lBfSI80KBFsa1ORr5JI9iTIxaCMUOI_8qT6LJstTtIKci00RYPNBY6h5LNxyBxoX-AMFGdlrvUjEgvyy8JI2ccr2MwoJjW_gTMBsH1JAYellkVy1YWJfXDNGq7ab40g8xt-eT3BQ5aoDeZiFiSi79PUbZO8gqvpn5n344hj31WCRFjquV9W_yDyhobMZ-mxwQI44LhjyvP9RDSUEdOO0p5BqNll1n3mwkQ"
          />
        </div>
      </div>
    </header>
  );
};
