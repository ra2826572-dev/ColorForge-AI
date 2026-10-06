/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { LoginPage, SignUpPage, ForgotPasswordPage } from './components/AuthPages';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { NotFoundPage } from './components/NotFoundPage';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';

const LandingRoute: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar isLanding={true} />
      <main className="flex-1">
        <LandingPage />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Route */}
          <Route path="/" element={<LandingRoute />} />

          {/* Public Auth Routes (Redirect to /dashboard if already logged in) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignUpPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPasswordPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="overview" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="layout-generator" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/layout-generator"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="layout-generator" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generator"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="generator" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/palette"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="palette" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="projects" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="history" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="profile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="pricing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzer"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="analyzer" />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Notifications & Modals */}
        <ExportModal />
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
