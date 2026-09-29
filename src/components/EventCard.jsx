import React from 'react';
import { useEventContext } from '../context/EventContext';
import { ProgressBar } from './ProgressBar';
import { getStatusColor, formatDate, formatRelativeTime } from '../utils/formatters';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  Sparkles,
} from 'lucide-react';

export const EventCard = ({ event }) => {
  const {
    setSelectedEventForDetails,
    setEditingEvent,
    setIsEventModalOpen,
    setIsRegistrationModalOpen,
    setPreselectedEventId,
    openConfirmModal,
    deleteEvent,
  } = useEventContext();

  const statusStyle = getStatusColor(event.status);
  const isFull = event.registrationsCount >= event.capacity;

  const handleDetails = () => {
    setSelectedEventForDetails(event);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    openConfirmModal({
      title: 'Delete Event?',
      message: `Are you sure you want to delete "${event.name}"? This will permanently remove all associated registrations.`,
      confirmText: 'Yes, Delete Event',
      isDanger: true,
      onConfirm: () => deleteEvent(event.id),
    });
  };

  const handleRegister = (e) => {
    e.stopPropagation();
    setPreselectedEventId(event.id);
    setIsRegistrationModalOpen(true);
  };

  return (
    <div
      onClick={handleDetails}
      className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_12px_35px_rgba(99,102,241,0.18)] hover:-translate-y-1 cursor-pointer relative"
    >
      {/* Top Gradient Banner strip */}
      <div className={`h-2.5 w-full bg-gradient-to-r ${event.bannerColor || 'from-indigo-600 to-fuchsia-600'}`} />

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Header: Category & Status */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              {event.category || 'Tech Event'}
            </span>
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              <span>{event.status}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-3">
            {event.name}
          </h3>

          {/* Key metadata */}
          <div className="space-y-2 text-xs text-gray-300 mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{formatDate(event.date)}</span>
              <span className="text-gray-400 font-normal">
                ({formatRelativeTime(event.date)})
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-fuchsia-400 shrink-0" />
              <span className="truncate font-medium">{event.speaker}</span>
            </div>
          </div>
        </div>

        {/* Progress bar section */}
        <div className="pt-3 border-t border-gray-800/80">
          <ProgressBar
            current={event.registrationsCount}
            max={event.capacity}
            size="md"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-800/60">
            {/* Quick Register / Full Badge */}
            {event.status !== 'Completed' ? (
              <button
                type="button"
                disabled={isFull}
                onClick={handleRegister}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isFull
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                    : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isFull ? 'Sold Out' : 'Register'}</span>
              </button>
            ) : (
              <span className="text-[11px] font-semibold text-gray-400 bg-gray-800/60 px-2.5 py-1 rounded-lg border border-gray-700/50">
                Concluded
              </span>
            )}

            {/* Quick Action Icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDetails}
                title="View Full Details"
                className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleEdit}
                title="Edit Event"
                className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDelete}
                title="Delete Event"
                className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
