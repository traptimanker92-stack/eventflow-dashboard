import React, { useState } from 'react';
import { useEventContext } from './context/EventContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { EventModal } from './components/EventModal';
import { EventDetailsModal } from './components/EventDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';

import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Registrations } from './pages/Registrations';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

export function App() {
  const { activeTab } = useEventContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <Events />;
      case 'registrations':
        return <Registrations />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-100 overflow-hidden font-sans">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Mobile Off-canvas Navigation Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <EventModal />
      <EventDetailsModal />
      <RegistrationModal />
      <ConfirmModal />
      <Toast />
    </div>
  );
}

export default App;
