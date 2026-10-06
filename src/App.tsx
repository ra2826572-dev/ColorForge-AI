/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {activeTab === 'landing' ? (
        <>
          <Navbar isLanding={true} />
          <main className="flex-1">
            <LandingPage />
          </main>
        </>
      ) : (
        <Dashboard />
      )}

      {/* Global Modals & Notifications */}
      <AuthModal />
      <ExportModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
