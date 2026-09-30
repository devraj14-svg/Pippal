import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update checking & offline support
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Dispatches custom event so App component can show a sleek update banner
      window.dispatchEvent(new CustomEvent('pwa:need-refresh'));
    },
    onOfflineReady() {
      console.log('[PipPal PWA] Offline cache primed. App is ready for offline usage.');
      window.dispatchEvent(new CustomEvent('pwa:offline-ready'));
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

