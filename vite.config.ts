import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built site opens from a file server, a subpath on
// GitHub Pages, or a laptop with no network — all three are real delivery
// targets for this project.
export default defineConfig({
  base: './',
  plugins: [react()],
  // Dev only, and only ever an upgrade. The live-audit section renders a
  // bundled fixture with no network at all; this proxy is what lets the same
  // section additionally run against a real corpus while a run server happens
  // to be up. Nothing in the production build reaches for it — if it did, the
  // offline delivery promise above would be false.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  // The same proxy for `vite preview`, which is a separate server with its own
  // config and inherits nothing from `server`. Without this, `npm run stage`
  // serves a page with a search bar whose every request 404s — the failure
  // looks like a broken product rather than a missing three lines, and it only
  // appears when someone opens it from a phone.
  preview: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    // The font stays a real file rather than a base64 blob in the CSS. Inlined
    // it would block the stylesheet on 64KB of encoded binary, and the whole
    // point of a local font here is that it arrives fast and never over the
    // network.
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        specimen: resolve(import.meta.dirname, 'specimen.html'),
      },
    },
  },
})
