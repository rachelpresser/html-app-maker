import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.anaesthesiapro',
  appName: 'AnaesthesiaPro',
  webDir: 'dist/client',
  // Offline build: loads bundled web files from dist/client.
  // To re-enable hot-reload during dev, uncomment the `server` block below.
  // server: {
  //   url: 'https://60364d6c-9fa7-470b-bf68-cc1072e4af76.lovableproject.com?forceHideBadge=true',
  //   cleartext: true,
  // },
  ios: {
    contentInset: 'always',
    backgroundColor: '#070b14',
  },
};

export default config;
