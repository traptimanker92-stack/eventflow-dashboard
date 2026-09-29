import React, { useState, useRef, useEffect } from 'react';
import { useEventContext } from '../context/EventContext';
import {
  Search,
  Bell,
  Plus,
  Menu,
  Sparkles,
  Calendar,
  CheckCircle2,
  Users,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export const Navbar = ({ onOpenMobileMenu }) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsEventModalOpen,
    setEditingEvent,
    events,
    registrations,
    setSelectedEventForDetails,
  } = useEventContext();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles = {
    dashboard: 'Executive Dashboard',
    events: 'Event Directory & Operations',
    registrations: 'Attendee & Registration Database',
    analytics: 'Performance & Growth Analytics',
    settings: 'System Preferences & Data Controls',
  };

  // Recent 4 activity notifications derived from data
  const recentActivities = [
    {
      id: 'act-1',
      title: 'High Attendance Alert',
      desc: `${events.filter(e => (e.registrationsCount/e.capacity) > 0.85).length} events have reached over 85% capacity.`,
      icon: Users,
      color: 'text-amber-400 bg-amber-500/10',
      time: '10m ago',
    },
    {
      id: 'act-2',
      title: 'New Registrations',
      desc: `${registrations.length} total participants enrolled across active summits.`,
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10',
      time: '1h ago',
    },
    {
      id: 'act-3',
      title: 'Upcoming Schedules',
      desc: `${events.filter(e => e.status === 'Upcoming').length} upcoming events ready for broadcast.`,
      icon: Calendar,
      color: 'text-indigo-400 bg-indigo-500/10',
      time: '3h ago',
    },
  ];

  return (
    <header className="h-20 bg-[#0E1322]/80 backdrop-blur-xl border-b border-gray-800/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{pageTitles[activeTab] || 'EventFlow'}</span>
          </h1>
          <p className="hidden sm:block text-xs text-gray-400 font-medium mt-0.5">
            Real-time event lifecycle management & analytics
          </p>
        </div>
      </div>

      {/* Center/Right: Search, Add Action, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Global Search */}
        <div className="relative hidden md:block w-52 lg:w-72">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search events, speakers, venues..."
              className="w-full pl-10 pr-8 py-2 bg-gray-900/90 border border-gray-800 rounded-xl text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-gray-400 hover:text-gray-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Button: Quick Add Event */}
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsEventModalOpen(true);
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-700 transition-all relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#0E1322] animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-dropdown shadow-2xl p-4 animate-slide-down z-50">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                    Activity & Alerts
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {recentActivities.length} New
                </span>
              </div>

              <div className="divide-y divide-gray-800/60 my-1">
                {recentActivities.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      className="py-3 px-1.5 flex items-start gap-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${act.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-white truncate">
                            {act.title}
                          </p>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {act.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gray-800 flex justify-center">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setActiveTab('events');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View All Events & Activity →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1.5 sm:pl-2 border-l border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-0.5 shadow-md shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Profile"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-white leading-none">Alex Morgan</p>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
              Event Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
