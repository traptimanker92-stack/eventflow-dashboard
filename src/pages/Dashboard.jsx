import React from 'react';
import { useEventContext } from '../context/EventContext';
import { StatCard } from '../components/StatCard';
import { EventCard } from '../components/EventCard';
import { ProgressBar } from '../components/ProgressBar';
import { formatDate } from '../utils/formatters';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Users,
  Activity,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export const Dashboard = () => {
  const {
    events,
    registrations,
    setActiveTab,
    setIsEventModalOpen,
    setEditingEvent,
    setSelectedEventForDetails,
  } = useEventContext();

  // Compute Dashboard Metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => e.status === 'Upcoming');
  const ongoingEvents = events.filter((e) => e.status === 'Ongoing');
  const completedEvents = events.filter((e) => e.status === 'Completed');

  const totalRegistrations = registrations.length;
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const totalRegisteredInEvents = events.reduce((sum, e) => sum + (e.registrationsCount || 0), 0);
  const overallUtilizationRate =
    totalCapacity > 0 ? Math.round((totalRegisteredInEvents / totalCapacity) * 100) : 0;

  // Next upcoming summit (most urgent)
  const sortedUpcoming = [...upcomingEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const nextUrgentEvent = sortedUpcoming[0];

  // Recent 4 registrations
  const recentRegistrations = [...registrations].slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-[#111827] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Event Operations Control Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Manage, Scale & Analyze High-Impact Events
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Track real-time registrations, manage venue capacities, organize speakers, and monitor attendee engagement across all scheduled technology summits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsEventModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-200 font-semibold text-xs sm:text-sm transition-all"
            >
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Events"
          value={totalEvents}
          subtitle={`${upcomingEvents.length} upcoming • ${ongoingEvents.length} active`}
          icon={CalendarDays}
          trend="+12%"
          trendPositive={true}
          colorScheme="indigo"
          onClick={() => setActiveTab('events')}
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          subtitle="Scheduled for launch"
          icon={Clock}
          trend="+8%"
          trendPositive={true}
          colorScheme="cyan"
          onClick={() => setActiveTab('events')}
        />
        <StatCard
          title="Ongoing Live Events"
          value={ongoingEvents.length}
          subtitle="Currently active in session"
          icon={Activity}
          colorScheme="emerald"
          onClick={() => setActiveTab('events')}
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrations}
          subtitle={`${overallUtilizationRate}% aggregate seat fill`}
          icon={Users}
          trend="+24%"
          trendPositive={true}
          colorScheme="fuchsia"
          onClick={() => setActiveTab('registrations')}
        />
      </div>

      {/* Urgent Next Event Feature & Capacity Utilization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Urgent Spotlight Card (2 cols) */}
        {nextUrgentEvent && (
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 relative overflow-hidden border border-indigo-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Featured Next Summit
                </span>
              </div>
              <span className="text-xs font-bold text-gray-400">
                Starts in {formatDate(nextUrgentEvent.date)}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {nextUrgentEvent.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                {nextUrgentEvent.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Speaker</p>
                  <p className="text-xs font-bold text-white truncate">{nextUrgentEvent.speaker}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Venue</p>
                  <p className="text-xs font-bold text-white truncate">{nextUrgentEvent.venue}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Registrations</p>
                  <p className="text-xs font-bold text-indigo-400">
                    {nextUrgentEvent.registrationsCount} / {nextUrgentEvent.capacity}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <ProgressBar
                  current={nextUrgentEvent.registrationsCount}
                  max={nextUrgentEvent.capacity}
                  size="sm"
                  showLabel={false}
                />
              </div>
              <button
                onClick={() => setSelectedEventForDetails(nextUrgentEvent)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <span>View Full Agenda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Aggregate Capacity & Status breakdown (1 col) */}
        <div className="glass-card rounded-3xl p-6 border border-gray-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">
                Aggregate Capacity
              </h3>
              <span className="text-xs font-extrabold text-indigo-400">
                {overallUtilizationRate}%
              </span>
            </div>

            <div className="mb-4">
              <ProgressBar current={totalRegisteredInEvents} max={totalCapacity} size="lg" />
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/80 border border-gray-800">
                <span className="text-gray-400">Total Available Slots</span>
                <span className="font-bold text-white">{totalCapacity} seats</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/80 border border-gray-800">
                <span className="text-gray-400">Claimed Registrations</span>
                <span className="font-bold text-emerald-400">{totalRegisteredInEvents} seats</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/80 border border-gray-800">
                <span className="text-gray-400">Available Remaining</span>
                <span className="font-bold text-indigo-400">
                  {Math.max(0, totalCapacity - totalRegisteredInEvents)} seats
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('registrations')}
            className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-700 bg-gray-800/60 hover:bg-gray-800 text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            <span>Manage Attendee List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upcoming Events Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Upcoming & Active Events
            </h3>
            <p className="text-xs text-gray-400">
              Active technology workshops, keynote tracks, and summits
            </p>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Recent Registrations Table Snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Recent Registrations
            </h3>
            <p className="text-xs text-gray-400">
              Latest participants enrolled in upcoming sessions
            </p>
          </div>
          <button
            onClick={() => setActiveTab('registrations')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            <span>View All ({registrations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl border border-gray-800/80 bg-[#111827]/90 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-900/90 border-b border-gray-800 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Enrolled Event</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white flex items-center gap-2.5">
                      <img
                        src={reg.avatar}
                        alt={reg.name}
                        className="w-7 h-7 rounded-full object-cover border border-gray-700"
                      />
                      <span>{reg.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{reg.organization}</td>
                    <td className="py-3 px-4 text-indigo-300 font-medium">{reg.eventName}</td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(reg.registeredAt)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {reg.checkInStatus || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
