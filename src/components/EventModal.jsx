import React, { useState, useEffect } from 'react';
import { useEventContext } from '../context/EventContext';
import { X, Calendar, Clock, MapPin, User, Users, AlignLeft, Sparkles, Tag } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

export const EventModal = () => {
  const {
    isEventModalOpen,
    setIsEventModalOpen,
    editingEvent,
    setEditingEvent,
    addEvent,
    updateEvent,
  } = useEventContext();

  const isEditing = Boolean(editingEvent);

  const initialFormState = {
    name: '',
    category: 'Engineering',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 04:00 PM',
    venue: '',
    speaker: '',
    speakerRole: '',
    capacity: 100,
    registrationsCount: 0,
    status: 'Upcoming',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name || '',
        category: editingEvent.category || 'Engineering',
        date: editingEvent.date || new Date().toISOString().split('T')[0],
        time: editingEvent.time || '',
        venue: editingEvent.venue || '',
        speaker: editingEvent.speaker || '',
        speakerRole: editingEvent.speakerRole || '',
        capacity: editingEvent.capacity ?? 100,
        registrationsCount: editingEvent.registrationsCount ?? 0,
        status: editingEvent.status || 'Upcoming',
        description: editingEvent.description || '',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [editingEvent, isEventModalOpen]);

  if (!isEventModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Event name is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.time.trim()) errs.time = 'Time schedule is required';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required';
    if (!formData.speaker.trim()) errs.speaker = 'Primary speaker is required';
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be greater than 0';
    }
    if (Number(formData.registrationsCount) < 0) {
      errs.registrationsCount = 'Registrations cannot be negative';
    }
    if (Number(formData.registrationsCount) > Number(formData.capacity)) {
      errs.registrationsCount = 'Registrations cannot exceed capacity';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please provide an event description';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }

    handleClose();
  };

  const handleClose = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-6 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/80 bg-gray-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Event Details' : 'Create New Event'}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditing ? 'Update event parameters and limits' : 'Publish a new tech summit or workshop'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Event Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Next-Gen Cloud Architecture Summit"
              className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.name ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-900/90 border border-gray-700/80 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-900/90 border border-gray-700/80 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Event Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.date ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
                }`}
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Time Schedule *
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 10:00 AM - 04:00 PM"
                className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.time ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
                }`}
              />
              {errors.time && <p className="text-xs text-rose-400 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Venue Location *
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Auditorium Alpha / Virtual Zoom Room"
              className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.venue ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
              }`}
            />
            {errors.venue && <p className="text-xs text-rose-400 mt-1">{errors.venue}</p>}
          </div>

          {/* Speaker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-fuchsia-400" />
              Speaker & Keynote Lead *
            </label>
            <input
              type="text"
              value={formData.speaker}
              onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              placeholder="e.g. Dr. Jane Doe (AI Director)"
              className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.speaker ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
              }`}
            />
            {errors.speaker && <p className="text-xs text-rose-400 mt-1">{errors.speaker}</p>}
          </div>

          {/* Capacity & Registered Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Total Capacity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.capacity ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
                }`}
              />
              {errors.capacity && <p className="text-xs text-rose-400 mt-1">{errors.capacity}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Current Registered Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.registrationsCount}
                onChange={(e) =>
                  setFormData({ ...formData, registrationsCount: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.registrationsCount
                    ? 'border-rose-500'
                    : 'border-gray-700/80 focus:border-indigo-500'
                }`}
              />
              {errors.registrationsCount && (
                <p className="text-xs text-rose-400 mt-1">{errors.registrationsCount}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
              Event Overview & Agenda *
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline what participants will learn, topics covered, prerequisites..."
              className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none ${
                errors.description ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl border border-gray-700 bg-gray-800/80 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              {isEditing ? 'Save Changes' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
