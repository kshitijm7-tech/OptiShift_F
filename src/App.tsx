import React from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ModePickerModal } from './components/modals/ModePickerModal';
import { WhatChangedModal } from './components/modals/WhatChangedModal';
import { OverviewScreen } from './components/overview/OverviewScreen';
import { ScheduleScreen } from './components/schedule/ScheduleScreen';
import { MyTeamScreen } from './components/team/MyTeamScreen';
import { TimeOffScreen } from './components/timeoff/TimeOffScreen';
import { RulesScreen } from './components/rules/RulesScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { CustomBuilderScreen } from './components/custom/CustomBuilderScreen';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';

const MainAppContent: React.FC = () => {
  const { activeScreen, toastMessage, setToastMessage } = useSchedule();

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="pl-64">
        {/* Top Header */}
        <Header />

        {/* Viewport Content */}
        <main className="w-full pt-16 min-h-screen px-6 py-6 max-w-7xl mx-auto">
          {activeScreen === 'overview' && <OverviewScreen />}
          {activeScreen === 'schedule' && <ScheduleScreen />}
          {activeScreen === 'my-team' && <MyTeamScreen />}
          {activeScreen === 'time-off' && <TimeOffScreen />}
          {activeScreen === 'rules' && <RulesScreen />}
          {activeScreen === 'settings' && <SettingsScreen />}
          {activeScreen === 'custom-builder' && <CustomBuilderScreen />}
        </main>
      </div>

      {/* Global Modals */}
      <WhatChangedModal />
      <ModePickerModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 bg-[#141b2b] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom duration-200 border border-[#293040]">
          <div className="w-6 h-6 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-sm">check</span>
          </div>
          <span className="text-xs font-medium text-white">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ScheduleProvider>
      <MainAppContent />
    </ScheduleProvider>
  );
}
