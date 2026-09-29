import React from 'react';
import { useEventContext } from '../context/EventContext';
import { RegistrationTable } from '../components/RegistrationTable';
import { StatCard } from '../components/StatCard';
import { Users, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const Registrations = () => {
  const { registrations, events } = useEventContext();

  const total = registrations.length;
  const confirmed = registrations.filter((r) => r.checkInStatus === 'Confirmed').length;
  const checkedIn = registrations.filter((r) => r.checkInStatus === 'Checked-In').length;
  const attended = registrations.filter((r) => r.checkInStatus === 'Attended').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Attendee Directory & Check-in
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Search, filter, manage status, and export participant records across all conferences
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registrations"
          value={total}
          subtitle={`Across ${events.length} events`}
          icon={Users}
          colorScheme="indigo"
        />
        <StatCard
          title="Confirmed"
          value={confirmed}
          subtitle={`${total > 0 ? Math.round((confirmed / total) * 100) : 0}% of all tickets`}
          icon={CheckCircle2}
          colorScheme="cyan"
        />
        <StatCard
          title="Checked-In Today"
          value={checkedIn}
          subtitle="Active on premises"
          icon={UserCheck}
          colorScheme="emerald"
        />
        <StatCard
          title="Completed / Attended"
          value={attended}
          subtitle="Past summit attendees"
          icon={ShieldCheck}
          colorScheme="fuchsia"
        />
      </div>

      {/* Main Registration Table Component */}
      <RegistrationTable />
    </div>
  );
};
