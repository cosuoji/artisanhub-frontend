import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { Toaster } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import { HelmetProvider } from "react-helmet-async";


// 👇 PWA Service Worker registration
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
    <App />
    </HelmetProvider>
    <Toaster
      toastOptions={{
        style: {
          border: '1px solid #1E3A8A',
          padding: '9px',
          color: '#1F2937',
        },
        success: {
          iconTheme: {
            primary: '#FFD700',
            secondary: '#1F2937',
          },
        },
        error: {
          iconTheme: {
            primary: 'red',
            secondary: 'black',
          },
        },
      }}
    />
  </StrictMode>
);
