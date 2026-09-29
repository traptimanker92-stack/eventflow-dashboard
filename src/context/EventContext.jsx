import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from '../data/initialData';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';
import confetti from 'canvas-confetti';

const EventContext = createContext();

const DEFAULT_SETTINGS = {
  appName: 'EventFlow',
  accentColor: 'indigo',
  tableRowsPerPage: 10,
  enableAnimations: true,
  notificationsEnabled: true,
  defaultView: 'grid',
};

export const EventProvider = ({ children }) => {
  // 1. Core State with LocalStorage sync
  const [events, setEvents] = useState(() => 
    getStoredData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS)
  );

  const [registrations, setRegistrations] = useState(() => 
    getStoredData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS)
  );

  const [settings, setSettings] = useState(() => 
    getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  // 2. Navigation & UI View State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // 3. Modals & Drawers State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null means adding, object means editing
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [preselectedEventId, setPreselectedEventId] = useState(null);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);

  // 4. Toasts & Confirmation dialog
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDanger: true,
    onConfirm: () => {},
  });

  // Persist whenever state updates
  useEffect(() => {
    setStoredData(STORAGE_KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.REGISTRATIONS, registrations);
  }, [registrations]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Toast helper
  const showToast = (title, message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Confirm dialog helper
  const openConfirmModal = ({ title, message, confirmText = 'Delete', isDanger = true, onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      isDanger,
      onConfirm: () => {
        onConfirm();
        closeConfirmModal();
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // CRUD for Events
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registrationsCount: Number(eventData.registrationsCount) || 0,
      capacity: Number(eventData.capacity) || 100,
      createdAt: new Date().toISOString(),
      tags: eventData.tags || ['Tech', 'Innovation'],
    };

    setEvents((prev) => [newEvent, ...prev]);
    showToast('Event Created Successfully', `"${newEvent.name}" is now live.`);
    
    // Celebration confetti
    if (settings.enableAnimations) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    return newEvent;
  };

  const updateEvent = (id, updatedFields) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const updated = {
            ...evt,
            ...updatedFields,
            capacity: Number(updatedFields.capacity) || evt.capacity,
            registrationsCount: Number(updatedFields.registrationsCount) ?? evt.registrationsCount,
          };
          return updated;
        }
        return evt;
      })
    );

    // If active details view is of this event, update it too
    if (selectedEventForDetails && selectedEventForDetails.id === id) {
      setSelectedEventForDetails((prev) => ({ ...prev, ...updatedFields }));
    }

    showToast('Event Updated', 'All changes have been saved.');
  };

  const deleteEvent = (id) => {
    const eventToDelete = events.find((e) => e.id === id);
    if (!eventToDelete) return;

    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    // Also remove or unlink associated registrations
    setRegistrations((prev) => prev.filter((reg) => reg.eventId !== id));

    if (selectedEventForDetails && selectedEventForDetails.id === id) {
      setSelectedEventForDetails(null);
    }

    showToast('Event Deleted', `"${eventToDelete.name}" and associated records were removed.`, 'info');
  };

  // CRUD for Registrations
  const addRegistration = (regData) => {
    const targetEvent = events.find((e) => e.id === regData.eventId);
    if (!targetEvent) {
      showToast('Error', 'Target event not found', 'error');
      return null;
    }

    if (targetEvent.registrationsCount >= targetEvent.capacity) {
      showToast('Capacity Full', `"${targetEvent.name}" has reached full capacity.`, 'warning');
      return null;
    }

    const newReg = {
      ...regData,
      id: `reg-${Date.now()}`,
      eventName: targetEvent.name,
      registeredAt: new Date().toISOString(),
      checkInStatus: 'Confirmed',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100&auto=format&fit=crop&q=80`,
    };

    setRegistrations((prev) => [newReg, ...prev]);

    // Increment count on event
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === targetEvent.id
          ? { ...evt, registrationsCount: evt.registrationsCount + 1 }
          : evt
      )
    );

    showToast('Registration Confirmed', `${newReg.name} is registered for "${targetEvent.name}".`);
    
    if (settings.enableAnimations) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }

    return newReg;
  };

  const deleteRegistration = (id) => {
    const reg = registrations.find((r) => r.id === id);
    if (!reg) return;

    setRegistrations((prev) => prev.filter((r) => r.id !== id));

    // Decrement event registration count
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === reg.eventId
          ? { ...evt, registrationsCount: Math.max(0, evt.registrationsCount - 1) }
          : evt
      )
    );

    showToast('Registration Cancelled', `Removed registration for ${reg.name}`, 'info');
  };

  const updateRegistrationStatus = (id, newStatus) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checkInStatus: newStatus } : r))
    );
    showToast('Status Updated', `Check-in status set to ${newStatus}.`);
  };

  // Reset demo data
  const resetToDemoData = () => {
    setEvents(INITIAL_EVENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setSettings(DEFAULT_SETTINGS);
    showToast('Data Reset', 'Restored pristine sample events and registrations.', 'info');
  };

  // Import JSON backup
  const importData = (imported) => {
    if (imported.events && Array.isArray(imported.events)) {
      setEvents(imported.events);
    }
    if (imported.registrations && Array.isArray(imported.registrations)) {
      setRegistrations(imported.registrations);
    }
    if (imported.settings) {
      setSettings((prev) => ({ ...prev, ...imported.settings }));
    }
    showToast('Import Successful', 'Database updated from backup file.');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        settings,
        setSettings,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        isEventModalOpen,
        setIsEventModalOpen,
        editingEvent,
        setEditingEvent,
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
        preselectedEventId,
        setPreselectedEventId,
        selectedEventForDetails,
        setSelectedEventForDetails,
        toasts,
        showToast,
        removeToast,
        confirmDialog,
        openConfirmModal,
        closeConfirmModal,
        addEvent,
        updateEvent,
        deleteEvent,
        addRegistration,
        deleteRegistration,
        updateRegistrationStatus,
        resetToDemoData,
        importData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
