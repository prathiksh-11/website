import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import About from './components/About';
import CareersPage from './components/CareersPage';
import Contact from './components/Contact';
import DownloadPage from './components/DownloadPage';
import LocationsPage from './components/LocationsPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import AccountDeletionPolicy from './components/AccountDeletionPolicy';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </StrictMode>
);
