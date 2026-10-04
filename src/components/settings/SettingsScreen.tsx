import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';

export const SettingsScreen: React.FC = () => {
  const {
    business,
    setBusiness,
    resetDemoData,
    setToastMessage
  } = useSchedule();

  const [bizName, setBizName] = useState(business.name);
  const [bizType, setBizType] = useState(business.type);
  const [bizLocation, setBizLocation] = useState(business.location);
  const [defaultHorizon, setDefaultHorizon] = useState(business.defaultHorizon);
  const [startOfWeek, setStartOfWeek] = useState(business.startOfWeek);
  const [highlightWeekends, setHighlightWeekends] = useState(business.highlightWeekends);
  const [timeFormat, setTimeFormat] = useState(business.timeFormat);
  const [email, setEmail] = useState(business.email);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Toggles for notifications
  const [notifyScheduleReady, setNotifyScheduleReady] = useState(true);
  const [notifyTimeOff, setNotifyTimeOff] = useState(true);
  const [notifyAttention, setNotifyAttention] = useState(true);

  const markDirty = () => setHasUnsavedChanges(true);

  const handleSave = () => {
    setBusiness(prev => ({
      ...prev,
      name: bizName,
      type: bizType,
      location: bizLocation,
      defaultHorizon,
      startOfWeek,
      highlightWeekends,
      timeFormat,
      email
    }));
    setHasUnsavedChanges(false);
    setToastMessage('Changes saved. Settings updated successfully.');
  };

  const handleDiscard = () => {
    setBizName(business.name);
    setBizType(business.type);
    setBizLocation(business.location);
    setDefaultHorizon(business.defaultHorizon);
    setStartOfWeek(business.startOfWeek);
    setHighlightWeekends(business.highlightWeekends);
    setTimeFormat(business.timeFormat);
    setEmail(business.email);
    setHasUnsavedChanges(false);
    setToastMessage('Changes discarded.');
  };

  const handleSimState = (state: string) => {
    if (state === 'default') {
      handleDiscard();
    } else if (state === 'toast') {
      setToastMessage('Changes saved! Your preferences have been synced.');
    } else if (state === 'unsaved') {
      setHasUnsavedChanges(true);
    } else if (state === 'resetModal') {
      setShowResetModal(true);
    } else if (state === 'notificationSent') {
      setToastMessage(`Test notification dispatched to ${email}.`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Simulator Toolbar */}
      <div className="w-full bg-white shadow-xs rounded-2xl p-4 mb-6 border border-[#e1e8fd] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#166534] text-[18px]">tune</span>
          <span className="text-xs text-[#141b2b] font-bold">Simulator State:</span>
          <span className="text-xs text-[#707a6f]">Click to test scenario previews</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => handleSimState('default')}
            className="px-3 py-1.5 rounded-lg font-semibold bg-[#b0f1c7] text-[#004c22]"
          >
            Default View
          </button>
          <button
            onClick={() => handleSimState('toast')}
            className="px-3 py-1.5 rounded-lg font-medium bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]"
          >
            Changes Saved (Toast)
          </button>
          <button
            onClick={() => handleSimState('unsaved')}
            className="px-3 py-1.5 rounded-lg font-medium bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]"
          >
            Unsaved Changes Prompt
          </button>
          <button
            onClick={() => handleSimState('resetModal')}
            className="px-3 py-1.5 rounded-lg font-medium bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]"
          >
            Reset Demo Data Modal
          </button>
          <button
            onClick={() => handleSimState('notificationSent')}
            className="px-3 py-1.5 rounded-lg font-medium bg-[#f1f3ff] text-[#404940] hover:bg-[#e1e8fd]"
          >
            Test Notification Sent
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-[#2d6a48] font-bold">
              Preferences &amp; Configuration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
            <span className="text-xs text-[#707a6f]">Auto-sync enabled</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">Settings</h1>
          <p className="text-sm text-[#707a6f] mt-0.5">
            Manage your business profile, roster rules, and OptiShift preferences.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white text-[#404940] hover:text-[#141b2b] text-xs font-semibold shadow-xs border border-[#e1e8fd] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#166534] text-white hover:bg-[#004c22] text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Settings Layout (Left summary / Right cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Anchors */}
        <div className="lg:col-span-3">
          <div className="sticky top-20 bg-white rounded-2xl p-4 shadow-xs border border-[#e1e8fd] flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-bold uppercase text-[#707a6f] px-2 py-1">
              Jump to category
            </span>
            <a
              href="#section-business"
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#141b2b] hover:bg-[#f1f3ff] font-semibold"
            >
              <span className="material-symbols-outlined text-[#166534] text-[18px]">storefront</span>
              <span>Business Profile</span>
            </a>
            <a
              href="#section-schedule"
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#404940] hover:bg-[#f1f3ff] font-medium"
            >
              <span className="material-symbols-outlined text-[#2d6a48] text-[18px]">calendar_month</span>
              <span>Schedule Preferences</span>
            </a>
            <a
              href="#section-notifications"
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#404940] hover:bg-[#f1f3ff] font-medium"
            >
              <span className="material-symbols-outlined text-[#2d6a48] text-[18px]">notifications_active</span>
              <span>Notifications</span>
            </a>
            <a
              href="#section-account"
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#404940] hover:bg-[#f1f3ff] font-medium"
            >
              <span className="material-symbols-outlined text-[#2d6a48] text-[18px]">person_pin</span>
              <span>Account &amp; Workspace</span>
            </a>
            <a
              href="#section-demo"
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">dataset</span>
              <span>Demo Environment</span>
            </a>

            {/* Store Snapshot Card */}
            <div className="mt-4 p-3 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse"></span>
                <span className="text-[11px] font-bold text-[#166534]">Algothon Live Instance</span>
              </div>
              <p className="text-[11px] text-[#404940] leading-relaxed">
                UrbanBrew Café has 8 team members scheduled across 14 peak shifts this week.
              </p>
            </div>
          </div>
        </div>

        {/* Right Settings Cards */}
        <div className="lg:col-span-9 flex flex-col gap-6 text-xs">
          {/* SECTION 1: BUSINESS PROFILE */}
          <section id="section-business" className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e8fd]">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-5 border-b border-[#f1f3ff]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#166534] text-[20px]">storefront</span>
                  <h2 className="font-bold text-base text-[#141b2b]">Business</h2>
                </div>
                <p className="text-[#707a6f] mt-0.5">Basic information about your business and operating footprint.</p>
              </div>
              <span className="mt-2 md:mt-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">verified</span> Verified Location
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#141b2b]">Business Name</label>
                <input
                  type="text"
                  value={bizName}
                  onChange={e => {
                    setBizName(e.target.value);
                    markDirty();
                  }}
                  className="h-9 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                />
                <span className="text-[10px] text-[#707a6f]">Displayed on employee rosters and notifications.</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#141b2b]">Business Type</label>
                <select
                  value={bizType}
                  onChange={e => {
                    setBizType(e.target.value);
                    markDirty();
                  }}
                  className="h-9 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                >
                  <option>Café &amp; Specialty Coffee</option>
                  <option>Casual &amp; Fine Dining Restaurant</option>
                  <option>Retail Store / Boutique</option>
                  <option>Salon &amp; Wellness</option>
                  <option>Healthcare &amp; Clinic</option>
                  <option>Warehouse &amp; Logistics</option>
                </select>
                <span className="text-[10px] text-[#707a6f]">Calibrates schedule templates to common footfall patterns.</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#141b2b]">Location / Outlet City</label>
                <input
                  type="text"
                  value={bizLocation}
                  onChange={e => {
                    setBizLocation(e.target.value);
                    markDirty();
                  }}
                  className="h-9 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                />
                <span className="text-[10px] text-[#707a6f]">Local labor jurisdiction: Maharashtra Shops &amp; Establishments.</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#141b2b]">Operating Currency</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value="₹ INR (Indian Rupee)"
                    className="w-full h-9 px-3 rounded-lg bg-[#f1f3ff] text-[#707a6f] cursor-not-allowed border border-[#e1e8fd]"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2 text-[#707a6f] text-sm">lock</span>
                </div>
                <span className="text-[10px] text-[#707a6f]">Fixed for this outlet region. Overtime estimates calculate in ₹ INR.</span>
              </div>
            </div>
          </section>

          {/* SECTION 2: SCHEDULE PREFERENCES */}
          <section id="section-schedule" className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e8fd]">
            <div className="pb-3 mb-5 border-b border-[#f1f3ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#166534] text-[20px]">calendar_month</span>
                <h2 className="font-bold text-base text-[#141b2b]">Schedule Preferences</h2>
              </div>
              <p className="text-[#707a6f] mt-0.5">Configure calendar view displays and formatting.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#141b2b]">Default Schedule Horizon</label>
                <select
                  value={defaultHorizon}
                  onChange={e => {
                    setDefaultHorizon(e.target.value as any);
                    markDirty();
                  }}
                  className="h-9 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                >
                  <option value="7">7 days (Weekly roster)</option>
                  <option value="14">14 days (Bi-weekly roster)</option>
                  <option value="30">30 days (Monthly planner)</option>
                </select>
                <span className="text-[10px] text-[#707a6f]">OptiShift generates full seven-day cycle assignments.</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#141b2b]">Start of Week</label>
                <select
                  value={startOfWeek}
                  onChange={e => {
                    setStartOfWeek(e.target.value as any);
                    markDirty();
                  }}
                  className="h-9 px-3 rounded-lg bg-[#f1f3ff] text-[#141b2b] focus:outline-none focus:bg-white border border-[#e1e8fd]"
                >
                  <option value="monday">Monday (Standard hospitality week)</option>
                  <option value="sunday">Sunday</option>
                </select>
                <span className="text-[10px] text-[#707a6f]">The timeline canvas begins on this day across all views.</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#f1f3ff]">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#166534]">weekend</span>
                  <div>
                    <span className="font-bold text-[#141b2b] block">Show weekends highlighted</span>
                    <span className="text-[10px] text-[#707a6f]">
                      Applies a tinted contrast column to Saturday and Sunday on the schedule canvas.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={highlightWeekends}
                  onChange={e => {
                    setHighlightWeekends(e.target.checked);
                    markDirty();
                  }}
                  className="w-4 h-4 accent-[#166534]"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#166534]">schedule</span>
                  <div>
                    <span className="font-bold text-[#141b2b] block">Time Format</span>
                    <span className="text-[10px] text-[#707a6f]">Format applied to shift pill headers and duration trackers.</span>
                  </div>
                </div>
                <div className="flex items-center bg-white p-1 rounded-xl border border-[#e1e8fd]">
                  <button
                    onClick={() => {
                      setTimeFormat('12h');
                      markDirty();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      timeFormat === '12h' ? 'bg-[#b0f1c7] text-[#004c22]' : 'text-[#707a6f]'
                    }`}
                  >
                    12-hour (9:00 AM)
                  </button>
                  <button
                    onClick={() => {
                      setTimeFormat('24h');
                      markDirty();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      timeFormat === '24h' ? 'bg-[#b0f1c7] text-[#004c22]' : 'text-[#707a6f]'
                    }`}
                  >
                    24-hour (09:00)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: NOTIFICATIONS */}
          <section id="section-notifications" className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e8fd]">
            <div className="pb-3 mb-5 border-b border-[#f1f3ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#166534] text-[20px]">notifications_active</span>
                <h2 className="font-bold text-base text-[#141b2b]">Notifications</h2>
              </div>
              <p className="text-[#707a6f] mt-0.5">Choose when OptiShift alerts you to pending operational actions.</p>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#166534]">event_available</span>
                  <div>
                    <span className="font-bold text-[#141b2b] block">Schedule ready</span>
                    <span className="text-[10px] text-[#707a6f]">Let me know when an automated schedule has been built.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyScheduleReady}
                  onChange={e => setNotifyScheduleReady(e.target.checked)}
                  className="w-4 h-4 accent-[#166534]"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#166534]">beach_access</span>
                  <div>
                    <span className="font-bold text-[#141b2b] block">Time-off requests</span>
                    <span className="text-[10px] text-[#707a6f]">Let me know when a team member submits a leave request.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyTimeOff}
                  onChange={e => setNotifyTimeOff(e.target.checked)}
                  className="w-4 h-4 accent-[#166534]"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#166534]">notification_important</span>
                  <div>
                    <span className="font-bold text-[#141b2b] block">Schedule needs attention</span>
                    <span className="text-[10px] text-[#707a6f]">Alert me when a draft has an uncovered shift or rule conflict.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyAttention}
                  onChange={e => setNotifyAttention(e.target.checked)}
                  className="w-4 h-4 accent-[#166534]"
                />
              </div>
            </div>

            <h3 className="font-bold text-xs uppercase tracking-wider text-[#707a6f] mb-3">Delivery Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#141b2b] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">mail</span> Primary Email
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] font-bold">
                      Active
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      markDirty();
                    }}
                    className="w-full h-8 px-3 rounded-lg bg-white text-[#141b2b] border border-[#e1e8fd]"
                  />
                  <p className="text-[10px] text-[#707a6f] mt-1">Weekly summaries dispatched Sundays at 8 PM.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(`Verification test email sent to ${email}.`)}
                  className="self-start px-3 py-1.5 rounded-lg bg-white border border-[#e1e8fd] text-xs font-semibold hover:bg-[#e1e8fd] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Send Test Notification</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#141b2b] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">chat</span> WhatsApp Broadcast
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#b0f1c7] text-[#004c22] font-bold">
                      Enabled
                    </span>
                  </div>
                  <p className="font-semibold text-[#141b2b] mt-1">Send weekly roster link upon publishing.</p>
                  <p className="text-[10px] text-[#707a6f] mt-0.5">Staff view shifts in 1 tap without downloading an app.</p>
                </div>
                <span className="text-[11px] text-[#166534] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>All 8 team member phones verified</span>
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 4: ACCOUNT */}
          <section id="section-account" className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e8fd]">
            <div className="pb-3 mb-5 border-b border-[#f1f3ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#166534] text-[20px]">person_pin</span>
                <h2 className="font-bold text-base text-[#141b2b]">Account</h2>
              </div>
              <p className="text-[#707a6f] mt-0.5">Your manager profile and current OptiShift environment status.</p>
            </div>

            <div className="bg-[#f1f3ff] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#e1e8fd]">
              <div className="flex items-center gap-3">
                <img
                  alt="Alex Morgan"
                  className="w-14 h-14 rounded-full object-cover shadow-xs ring-2 ring-[#b0f1c7]"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XRxQJLnYxCI1g-Y78NHJx3nS5df7-CAXGTAmcOp4WnpNbNPjgBZE3wg5NpuAIJfFYulYCSMAHRnwLFhM9AEV-qOaLctvLSEi7-87aYazI3XggBOXFBIn7k-FOgFXdW5me9gFO9i5bPBCGm0pdGq8UPSKBEAsMIFIhoCadKLiSxC_vgM6uyXIEwj68GQISr9JKuR0s7VLm2L7nYvL88HwVcH7OejBwRg3597x2TXImYc0KdgvAdc-O10Q"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#141b2b]">Alex Morgan</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#166534] text-white font-bold">
                      Owner
                    </span>
                  </div>
                  <span className="text-[#707a6f] block">{email}</span>
                  <span className="text-[11px] text-[#166534] font-medium flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">store</span>
                    <span>UrbanBrew Café · Mumbai Outlet</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1">
                <span className="text-[10px] text-[#707a6f] uppercase tracking-wider font-semibold">
                  Workspace Subscription
                </span>
                <span className="text-xs font-bold text-[#004c22] px-2.5 py-1 rounded-lg bg-[#b0f1c7]">
                  Algothon Demo Instance
                </span>
                <span className="text-[10px] text-[#707a6f]">Active through Algothon Presentation</span>
              </div>
            </div>
          </section>

          {/* SECTION 5: DEMO ENVIRONMENT & RESET */}
          <section id="section-demo" className="bg-white rounded-2xl p-6 shadow-xs border border-[#e1e8fd]">
            <div className="pb-3 mb-5 border-b border-[#f1f3ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[20px]">dataset</span>
                <h2 className="font-bold text-base text-[#141b2b]">Demo Environment &amp; Data</h2>
              </div>
              <p className="text-[#707a6f] mt-0.5">Control sample business data used during live scheduling demonstrations.</p>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 shrink-0 shadow-xs border border-red-200">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#141b2b]">Demo Mode Active</span>
                    <span className="px-2 py-0.2 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                      Reset Option Available
                    </span>
                  </div>
                  <p className="text-[#404940] mt-1 leading-relaxed">
                    Restores the original UrbanBrew Café dataset. Any custom employees or shift edits made during this session will be safely reverted to default presentation values.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(true)}
                className="shrink-0 h-9 px-4 rounded-xl bg-white hover:bg-red-600 hover:text-white text-red-700 font-bold transition-all shadow-xs border border-red-200 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span>Reset Demo Data</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#141b2b] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-400 text-[20px]">error</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">You have unsaved changes</span>
              <span className="text-[11px] text-[#bfc9bd]">Do you want to apply your new settings across OptiShift?</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004c22] text-white text-xs font-bold transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-[#293040]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e1e8fd] animate-in fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">restart_alt</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#141b2b]">Reset demo data?</h3>
                <span className="text-xs text-[#707a6f]">Restore presentation defaults</span>
              </div>
            </div>
            <p className="text-xs text-[#404940] mb-6 leading-relaxed">
              This will restore the original UrbanBrew Café dataset. 8 standard employees, initial hour caps, shift patterns, and default preferences will be reinjected.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetModal(false);
                  setHasUnsavedChanges(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
