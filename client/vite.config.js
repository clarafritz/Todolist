
/* -----------------------------------------
vite.config.js -> Configuration de Vite
----------------------------------------- */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Configuration des plugins utilisés par Vite
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ]
});
