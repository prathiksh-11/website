import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import App from './App.tsx';
import { AdminApp } from './admin/AdminApp';
import About from './components/About';
import CareersPage from './components/CareersPage';
import Contact from './components/Contact';
import DownloadPage from './components/DownloadPage';
import LocationsPage from './components/LocationsPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import AccountDeletionPolicy from './components/AccountDeletionPolicy';
import './index.css';

const ADMIN_PREFIXES = [
  '/login',
  '/dashboard',
  '/customers',
  '/trainers',
  '/branches',
  '/subscriptions',
  '/sessions',
  '/events',
  '/reports',
  '/transactions',
  '/notifications',
  '/settings',
  '/profile',
  '/unauthorized',
];

const isAdminPath = (pathname: string) =>
  ADMIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

/** Pick website vs admin without nesting routers (avoids redirect loops). */
const RootSwitcher = () => {
  const { pathname } = useLocation();

  if (isAdminPath(pathname)) {
    return <AdminApp />;
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/locations" element={<LocationsPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/download" element={<DownloadPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/account-deletion" element={<AccountDeletionPolicy />} />
      <Route path="/delete-account" element={<Navigate to="/account-deletion" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <RootSwitcher />
    </BrowserRouter>
  </StrictMode>,
);
