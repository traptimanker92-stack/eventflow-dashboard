import React, { useState, useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import { EventCard } from '../components/EventCard';
import { SearchFilter } from '../components/SearchFilter';
import { ProgressBar } from '../components/ProgressBar';
import { getStatusColor, formatDate } from '../utils/formatters';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Eye,
  UserPlus,
  Calendar,
  Clock,
  MapPin,
  User,
} from 'lucide-react';

export const Events = () => {
  const {
    events,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    setIsEventModalOpen,
    setEditingEvent,
    setSelectedEventForDetails,
    setIsRegistrationModalOpen,
    setPreselectedEventId,
    openConfirmModal,
    deleteEvent,
  } = useEventContext();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filter events based on search query, status, and category
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        event.name.toLowerCase().includes(q) ||
        event.speaker.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        (event.description && event.description.toLowerCase().includes(q));

      const matchStatus =
        statusFilter === 'All' ||
        event.status.toLowerCase() === statusFilter.toLowerCase();

      const matchCategory =
        categoryFilter === 'All' ||
        (event.category && event.category.toLowerCase() === categoryFilter.toLowerCase());

      return matchSearch && matchStatus && matchCategory;
    });
  }, [events, searchQuery, statusFilter, categoryFilter]);

  const handleCreate = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEdit = (evt) => {
    setEditingEvent(evt);
    setIsEventModalOpen(true);
  };

  const handleDelete = (evt) => {
    openConfirmModal({
      title: 'Delete Event?',
      message: `Are you sure you want to delete "${evt.name}"? This action cannot be undone.`,
      confirmText: 'Delete Event',
      isDanger: true,
      onConfirm: () => deleteEvent(evt.id),
    });
  };

  const handleQuickRegister = (evt) => {
    setPreselectedEventId(evt.id);
    setIsRegistrationModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Events Directory
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Browse, manage, filter, and create upcoming technical conferences and summits
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        selectedCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        placeholder="Filter events by name, speaker, or venue..."
      />

      {/* Content Rendering: Grid View vs Table View */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#111827]/80 border border-gray-800 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Events Found</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            No events match your current search query or filter criteria. Try clearing your filters or creating a new event.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setCategoryFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 border border-gray-700 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md transition-colors"
            >
              Add Event
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-gray-800/80 bg-[#111827]/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-900/90 border-b border-gray-800 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Date & Time</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Venue</th>
                  <th className="py-3.5 px-4">Speaker</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredEvents.map((evt) => {
                  const statusStyle = getStatusColor(evt.status);
                  const isFull = evt.registrationsCount >= evt.capacity;
                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-indigo-500/[0.03] transition-colors cursor-pointer"
                      onClick={() => setSelectedEventForDetails(evt)}
                    >
                      {/* Event Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 mr-2">
                          {evt.category}
                        </span>
                        <p className="font-bold text-white text-sm mt-1 line-clamp-1">{evt.name}</p>
                        <p className="text-[11px] text-gray-400 line-clamp-1 md:hidden">
                          {formatDate(evt.date)} • {evt.time}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="text-gray-200 font-semibold">{formatDate(evt.date)}</div>
                        <div className="text-[11px] text-gray-400">{evt.time}</div>
                      </td>

                      {/* Venue */}
                      <td className="py-3.5 px-4 hidden lg:table-cell font-medium text-gray-300 max-w-[180px] truncate">
                        {evt.venue}
                      </td>

                      {/* Speaker */}
                      <td className="py-3.5 px-4 text-gray-200 font-medium max-w-[160px] truncate">
                        {evt.speaker}
                      </td>

                      {/* Capacity Progress */}
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <ProgressBar
                          current={evt.registrationsCount}
                          max={evt.capacity}
                          size="sm"
                        />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {evt.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {evt.status !== 'Completed' && (
                            <button
                              disabled={isFull}
                              onClick={() => handleQuickRegister(evt)}
                              className={`p-1.5 rounded-lg text-xs font-semibold ${
                                isFull
                                  ? 'text-gray-600 cursor-not-allowed'
                                  : 'text-indigo-400 hover:bg-indigo-500/20'
                              }`}
                              title="Add Participant"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedEventForDetails(evt)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(evt)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-gray-800"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(evt)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
