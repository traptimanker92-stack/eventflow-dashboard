import React, { useState, useEffect } from 'react';
import { useEventContext } from '../context/EventContext';
import { X, User, Mail, Phone, Building2, Ticket, Sparkles, Calendar } from 'lucide-react';

export const RegistrationModal = () => {
  const {
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
    preselectedEventId,
    setPreselectedEventId,
    events,
    addRegistration,
  } = useEventContext();

  const [formData, setFormData] = useState({
    eventId: '',
    name: '',
    email: '',
    phone: '',
    organization: '',
    ticketType: 'General Access',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isRegistrationModalOpen) {
      // Pick first available upcoming/ongoing event if none preselected
      const defaultEventId =
        preselectedEventId ||
        events.find((e) => e.status !== 'Completed' && e.registrationsCount < e.capacity)?.id ||
        events[0]?.id ||
        '';

      setFormData({
        eventId: defaultEventId,
        name: '',
        email: '',
        phone: '',
        organization: '',
        ticketType: 'General Access',
      });
      setErrors({});
    }
  }, [isRegistrationModalOpen, preselectedEventId, events]);

  if (!isRegistrationModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.eventId) errs.eventId = 'Please select a target event';
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Contact number is required';
    if (!formData.organization.trim()) {
      errs.organization = 'Organization / Company is required';
    }

    // Check capacity
    const targetEvent = events.find((e) => e.id === formData.eventId);
    if (targetEvent && targetEvent.registrationsCount >= targetEvent.capacity) {
      errs.eventId = 'This event is completely full';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = addRegistration(formData);
    if (res) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsRegistrationModalOpen(false);
    setPreselectedEventId(null);
  };

  const selectedEventObj = events.find((e) => e.id === formData.eventId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-6 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/80 bg-gray-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Register Participant</h2>
              <p className="text-xs text-gray-400">Add an attendee to an active summit</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Event Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Target Event *
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                errors.eventId ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
              }`}
            >
              {events.map((evt) => {
                const isFull = evt.registrationsCount >= evt.capacity;
                return (
                  <option key={evt.id} value={evt.id} disabled={isFull}>
                    {evt.name} ({evt.registrationsCount}/{evt.capacity} registered) {isFull ? '[SOLD OUT]' : ''}
                  </option>
                );
              })}
            </select>
            {errors.eventId && <p className="text-xs text-rose-400 mt-1">{errors.eventId}</p>}
          </div>

          {/* Participant Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Participant Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jordan Matthews"
              className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.name ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jordan@company.com"
                className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.email ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.phone ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Organization & Ticket Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Organization / Company *
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Apex Innovations"
                className={`w-full px-4 py-2.5 bg-gray-900/90 border rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.organization ? 'border-rose-500' : 'border-gray-700/80 focus:border-indigo-500'
                }`}
              />
              {errors.organization && (
                <p className="text-xs text-rose-400 mt-1">{errors.organization}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                Pass Tier
              </label>
              <select
                value={formData.ticketType}
                onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-900/90 border border-gray-700/80 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="General Access">General Access</option>
                <option value="VIP Attendee">VIP Attendee</option>
                <option value="Hacker Pass">Hacker Pass</option>
                <option value="Student Pass">Student Pass</option>
              </select>
            </div>
          </div>

          {/* Actions */}
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
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
