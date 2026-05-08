import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rachelpresser.anaesthesiapro',
  appName: 'AnaesthesiaPro',
  webDir: 'dist/client',
  ios: {
    contentInset: 'always',
    backgroundColor: '#070b14',
  },
};

export default config;
