import React from 'react';
import { useEventContext } from '../context/EventContext';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    events,
    registrations,
    setIsEventModalOpen,
    setEditingEvent,
  } = useEventContext();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'events',
      label: 'Events',
      icon: CalendarDays,
      badge: events.length,
    },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: Users,
      badge: registrations.length,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      badge: null,
    },
  ];

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0E1322] border-r border-gray-800/80 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 gap-3.5 border-b border-gray-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-500 p-0.5 shadow-glow-brand flex items-center justify-center">
          <div className="w-full h-full bg-gray-950/60 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-white">
              Event<span className="text-gradient">Flow</span>
            </span>
            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
              PRO
            </span>
          </div>
          <p className="text-[11px] font-medium text-gray-400 leading-none mt-0.5">
            Enterprise Event Hub
          </p>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 pt-5 pb-2">
        <button
          onClick={handleCreateEvent}
          className="w-full group flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-fuchsia-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-gray-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live System Summary Card in Sidebar Footer */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/90">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-400 font-medium">System Status</span>
          <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live & Synced
          </span>
        </div>
        <div className="text-[11px] text-gray-400 leading-relaxed">
          LocalStorage engine synced. No server latency.
        </div>
      </div>
    </aside>
  );
};
