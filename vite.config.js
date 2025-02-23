import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vite.dev/config/
//export default defineConfig(({ mode }) => {
  export default defineConfig({

    base: '/soft/', // <-- Aggiungi questa riga per il base path in produzione
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src') // Definisce l'alias '@' come cartella 'src'
      }
    },
  
/*
  return {
    base: '/soft/', // <-- Aggiungi questa riga per il base path in produzione
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src') // Definisce l'alias '@' come cartella 'src'
      }
    },
    
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL, // Usa la variabile d'ambiente corretta
          changeOrigin: true,
          secure: true
        }
      }
    }
  };*/
});