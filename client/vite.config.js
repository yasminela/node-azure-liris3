import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer React et ReactDOM
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Séparer les librairies UI
          'ui-vendor': ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
          // Séparer les librairies de graphiques
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          // Séparer les autres dépendances
          'utils-vendor': ['axios', 'react-hook-form']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Augmenter la limite à 1000 kB si nécessaire
    sourcemap: false // Désactiver les sourcemaps en production
  }
});