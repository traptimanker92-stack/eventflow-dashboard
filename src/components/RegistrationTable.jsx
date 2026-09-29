import React, { useState, useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import { formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import {
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

export const RegistrationTable = () => {
  const {
    registrations,
    events,
    deleteRegistration,
    updateRegistrationStatus,
    setIsRegistrationModalOpen,
    openConfirmModal,
  } = useEventContext();

  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        reg.name.toLowerCase().includes(search.toLowerCase()) ||
        reg.email.toLowerCase().includes(search.toLowerCase()) ||
        reg.organization.toLowerCase().includes(search.toLowerCase()) ||
        (reg.phone && reg.phone.includes(search));

      const matchEvent = selectedEventId === 'All' || reg.eventId === selectedEventId;
      const matchStatus =
        selectedStatus === 'All' || reg.checkInStatus === selectedStatus;

      return matchSearch && matchEvent && matchStatus;
    });
  }, [registrations, search, selectedEventId, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage) || 1;
  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(start, start + itemsPerPage);
  }, [filteredRegistrations, currentPage, itemsPerPage]);

  const handleDelete = (reg) => {
    openConfirmModal({
      title: 'Remove Registration?',
      message: `Are you sure you want to remove the registration for "${reg.name}"? This will free up 1 slot in the event.`,
      confirmText: 'Remove Attendee',
      isDanger: true,
      onConfirm: () => deleteRegistration(reg.id),
    });
  };

  const handleExport = () => {
    const exportData = filteredRegistrations.map((r) => ({
      'Registration ID': r.id,
      'Participant Name': r.name,
      'Email': r.email,
      'Phone': r.phone,
      'Organization/College': r.organization,
      'Event Name': r.eventName,
      'Ticket Tier': r.ticketType || 'General',
      'Check-in Status': r.checkInStatus || 'Confirmed',
      'Registration Date': formatDate(r.registeredAt),
    }));
    exportToCSV(exportData, `eventflow-registrations-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search attendee name, email, organization..."
            className="w-full pl-10 pr-9 py-2 bg-gray-900/90 border border-gray-700/60 rounded-xl text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Event Filter */}
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-900 border border-gray-700/60 rounded-xl text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[180px] truncate"
          >
            <option value="All">All Events</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-900 border border-gray-700/60 rounded-xl text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-In">Checked-In</option>
            <option value="Attended">Attended</option>
          </select>

          {/* Export CSV Button */}
          <button
            onClick={handleExport}
            disabled={filteredRegistrations.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Add Participant Button */}
          <button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Attendee</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-gray-800/80 bg-[#111827]/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-900/90 border-b border-gray-800 text-gray-400 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Participant</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Contact</th>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Enrolled Event</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Pass Tier</th>
                <th className="py-3.5 px-4">Check-In</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-gray-600" />
                      <p className="text-sm font-semibold text-gray-300">
                        No registrations found matching your filters
                      </p>
                      <p className="text-xs text-gray-500">
                        Try resetting filters or registering a new attendee.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-indigo-500/[0.03] transition-colors"
                  >
                    {/* Participant Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={reg.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={reg.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-700/80 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-100">{reg.name}</p>
                          <p className="text-[11px] text-gray-400 md:hidden">{reg.email}</p>
                          <p className="text-[10px] text-gray-500">
                            Reg: {formatDate(reg.registeredAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="text-gray-300 font-medium">{reg.email}</div>
                      <div className="text-[11px] text-gray-500">{reg.phone || 'N/A'}</div>
                    </td>

                    {/* Organization */}
                    <td className="py-3.5 px-4 font-medium text-gray-300">
                      {reg.organization}
                    </td>

                    {/* Event */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-indigo-300 line-clamp-1">
                        {reg.eventName}
                      </span>
                    </td>

                    {/* Ticket Tier */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                        {reg.ticketType || 'General'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={reg.checkInStatus || 'Confirmed'}
                        onChange={(e) =>
                          updateRegistrationStatus(reg.id, e.target.value)
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none ${
                          reg.checkInStatus === 'Checked-In'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : reg.checkInStatus === 'Attended'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        <option value="Confirmed" className="bg-gray-900 text-gray-200">
                          Confirmed
                        </option>
                        <option value="Checked-In" className="bg-gray-900 text-gray-200">
                          Checked-In
                        </option>
                        <option value="Attended" className="bg-gray-900 text-gray-200">
                          Attended
                        </option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(reg)}
                        className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                        title="Delete Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="px-4 py-3 bg-gray-900/60 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            Showing <strong className="text-white">{filteredRegistrations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-white">
              {Math.min(currentPage * itemsPerPage, filteredRegistrations.length)}
            </strong>{' '}
            of <strong className="text-white">{filteredRegistrations.length}</strong> participants
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-semibold text-gray-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
