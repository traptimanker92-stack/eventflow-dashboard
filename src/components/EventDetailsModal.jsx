import React, { useState } from 'react';
import { useEventContext } from '../context/EventContext';
import { ProgressBar } from './ProgressBar';
import { getStatusColor, formatDate, formatRelativeTime } from '../utils/formatters';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Tag,
  Edit2,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const EventDetailsModal = () => {
  const {
    selectedEventForDetails,
    setSelectedEventForDetails,
    registrations,
    setEditingEvent,
    setIsEventModalOpen,
    setIsRegistrationModalOpen,
    setPreselectedEventId,
    openConfirmModal,
    deleteEvent,
    deleteRegistration,
    updateRegistrationStatus,
  } = useEventContext();

  const [rosterSearch, setRosterSearch] = useState('');

  if (!selectedEventForDetails) return null;

  const event = selectedEventForDetails;
  const statusStyle = getStatusColor(event.status);
  const isFull = event.registrationsCount >= event.capacity;

  // Filter attendees for this specific event
  const attendees = registrations.filter(
    (reg) =>
      reg.eventId === event.id &&
      (reg.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        reg.email.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        reg.organization.toLowerCase().includes(rosterSearch.toLowerCase()))
  );

  const handleEdit = () => {
    setSelectedEventForDetails(null);
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDelete = () => {
    openConfirmModal({
      title: 'Delete Event?',
      message: `Are you sure you want to delete "${event.name}"? This will also remove all ${attendees.length} registered attendees.`,
      confirmText: 'Yes, Delete',
      isDanger: true,
      onConfirm: () => {
        deleteEvent(event.id);
        setSelectedEventForDetails(null);
      },
    });
  };

  const handleAddParticipant = () => {
    setPreselectedEventId(event.id);
    setIsRegistrationModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="w-full max-w-4xl bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-4 relative animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header with Gradient */}
        <div className={`h-28 sm:h-36 w-full bg-gradient-to-r ${event.bannerColor || 'from-indigo-600 to-fuchsia-600'} relative p-6 flex items-start justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
              {event.category || 'Tech Event'}
            </span>
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg border backdrop-blur-md ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
              <span>{event.status}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedEventForDetails(null)}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Main Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {event.name}
              </h2>
              <p className="text-xs text-indigo-400 font-medium mt-1">
                Event ID: {event.id} • Created {formatDate(event.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {event.status !== 'Completed' && (
                <button
                  type="button"
                  disabled={isFull}
                  onClick={handleAddParticipant}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
                    isFull
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isFull ? 'Capacity Reached' : 'Add Attendee'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleEdit}
                className="p-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-amber-400 transition-colors"
                title="Edit Event"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-rose-400 transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800/80">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase mb-1">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <p className="text-sm font-bold text-white">{formatDate(event.date)}</p>
              <p className="text-xs text-gray-400">{formatRelativeTime(event.date)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800/80">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase mb-1">
                <Clock className="w-4 h-4" />
                <span>Schedule</span>
              </div>
              <p className="text-sm font-bold text-white">{event.time}</p>
              <p className="text-xs text-gray-400">Standard Conference Time</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800/80">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase mb-1">
                <MapPin className="w-4 h-4" />
                <span>Venue</span>
              </div>
              <p className="text-sm font-bold text-white truncate">{event.venue}</p>
              <p className="text-xs text-gray-400">Official Location</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800/80">
              <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-semibold uppercase mb-1">
                <User className="w-4 h-4" />
                <span>Keynote Lead</span>
              </div>
              <p className="text-sm font-bold text-white truncate">{event.speaker}</p>
              <p className="text-xs text-gray-400 truncate">{event.speakerRole || 'Featured Expert'}</p>
            </div>
          </div>

          {/* Capacity Utilization */}
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Seat Allotment & Registration Status
              </span>
              <span className="text-xs font-semibold text-gray-400">
                {event.capacity - event.registrationsCount} seats remaining
              </span>
            </div>
            <ProgressBar current={event.registrationsCount} max={event.capacity} size="lg" />
          </div>

          {/* Description & Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              About this Event
            </h4>
            <div className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/80 text-sm text-gray-300 leading-relaxed">
              {event.description}
            </div>
          </div>

          {/* Associated Registrations Roster */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">
                  Registered Attendees ({attendees.length})
                </h4>
              </div>

              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search attendee by name, email..."
                className="px-3.5 py-1.5 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {attendees.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-gray-900/30 border border-gray-800 text-xs text-gray-400">
                No participants registered for this event yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-800 border border-gray-800 rounded-2xl bg-gray-900/40 overflow-hidden">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-700 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{attendee.name}</p>
                        <p className="text-[11px] text-gray-400">{attendee.email} • {attendee.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <select
                        value={attendee.checkInStatus || 'Confirmed'}
                        onChange={(e) => updateRegistrationStatus(attendee.id, e.target.value)}
                        className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-[11px] font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked-In">Checked-In</option>
                        <option value="Attended">Attended</option>
                      </select>

                      <button
                        onClick={() => deleteRegistration(attendee.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Remove Participant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
