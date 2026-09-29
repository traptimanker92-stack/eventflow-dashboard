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
  X,
} from 'lucide-react';

export const MobileNav = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    events,
    registrations,
    setIsEventModalOpen,
    setEditingEvent,
  } = useEventContext();

  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'events', label: 'Events', icon: CalendarDays, badge: events.length },
    { id: 'registrations', label: 'Registrations', icon: Users, badge: registrations.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: null },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    onClose();
  };

  const handleCreateNew = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85%] bg-[#0E1322] border-r border-gray-800 h-full flex flex-col p-5 shadow-2xl z-10 animate-slide-up">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-gray-950/60 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Event<span className="text-gradient">Flow</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800/80 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Event Quick Button */}
        <div className="py-4">
          <button
            onClick={handleCreateNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-indigo-500/30 text-indigo-300'
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

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-800 text-center text-[11px] text-gray-400">
          EventFlow Dashboard v2.0 • Offline Ready
        </div>
      </div>
    </div>
  );
};
