import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.anaesthesiapro',
  appName: 'AnaesthesiaPro',
  webDir: 'dist/client',
  // Hot-reload from the Lovable preview while developing on a real device.
  // For a true offline App Store build, comment out the `server` block,
  // run `npx vite build`, then `npx cap sync ios`.
  server: {
    url: 'https://60364d6c-9fa7-470b-bf68-cc1072e4af76.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#070b14',
  },
};

export default config;
