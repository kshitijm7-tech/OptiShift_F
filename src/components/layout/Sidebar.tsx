import React from 'react';
import { NavScreen, useSchedule } from '../../context/ScheduleContext';

interface NavItem {
  id: NavScreen;
  label: string;
  sublabel: string;
  icon: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    sublabel: "Today's summary",
    icon: 'dashboard'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    sublabel: 'See who works when',
    icon: 'calendar_today'
  },
  {
    id: 'my-team',
    label: 'My Team',
    sublabel: 'Staff & work limits',
    icon: 'group'
  },
  {
    id: 'time-off',
    label: 'Time Off',
    sublabel: 'Vacation & requests',
    icon: 'beach_access',
    badge: 1
  },
  {
    id: 'rules',
    label: 'Rules',
    sublabel: 'Shift & hour limits',
    icon: 'tune'
  },
  {
    id: 'settings',
    label: 'Settings',
    sublabel: 'Store & preferences',
    icon: 'settings'
  }
];

export const Sidebar: React.FC = () => {
  const { activeScreen, setActiveScreen, leaveRequests, operatingMode, setShowModePickerModal } = useSchedule();
  const pendingCount = leaveRequests.filter(l => l.status === 'pending').length;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between border-r border-[#e9edff]">
      <div className="flex flex-col">
        {/* Brand header */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[#f1f3ff]">
          <div className="w-9 h-9 rounded-lg bg-[#166534] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <span className="material-symbols-outlined text-[22px]">timer</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[17px] text-[#141b2b] tracking-tight leading-none">
              OptiShift
            </span>
            <span className="text-[11px] text-[#404940] font-medium tracking-wide mt-0.5">
              Algorithmic Scheduler
            </span>
          </div>
        </div>

        {/* Mode Quick Tag */}
        <div className="px-3 pt-3">
          <div 
            onClick={() => setShowModePickerModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] cursor-pointer transition-colors flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse"></span>
              <span className="font-semibold text-[#141b2b]">
                {operatingMode === 'demo' ? 'Demo: UrbanBrew' : 'Custom Builder'}
              </span>
            </div>
            <span className="text-[11px] text-[#166534] font-semibold hover:underline">
              Switch ⇄
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="px-3 py-3">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(item => {
              const isActive = activeScreen === item.id;
              const badgeNum = item.id === 'time-off' ? pendingCount : item.badge;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-[#b0f1c7] text-[#004c22] font-semibold shadow-xs'
                      : 'text-[#404940] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-[#004c22]' : 'text-[#707a6f]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[13px] leading-tight font-medium text-inherit">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[#707a6f] truncate">
                      {item.sublabel}
                    </span>
                  </div>
                  {badgeNum !== undefined && badgeNum > 0 && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-[#004c22] text-white'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {badgeNum}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Help & Support Widget */}
      <div className="p-3">
        <div className="bg-[#f1f3ff] p-3.5 rounded-xl flex flex-col gap-1.5 border border-[#e1e8fd]">
          <div className="flex items-center gap-1.5 text-[#166534]">
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
            <span className="text-xs font-semibold text-[#141b2b]">Algothon Guide</span>
          </div>
          <p className="text-[11px] text-[#404940] leading-relaxed">
            OptiShift converts availability & leave into MILP constraints to eliminate manual trial-and-error.
          </p>
          <button
            onClick={() => setActiveScreen('rules')}
            className="text-[11px] text-[#166534] font-semibold hover:underline inline-block mt-0.5 text-left"
          >
            Inspect solver constraints →
          </button>
        </div>
      </div>
    </aside>
  );
};
