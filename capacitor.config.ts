import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lacomanda.app',
  appName: 'La Comanda',
  webDir: 'www',
  bundledWebRuntime: false,
  "plugins": {
    "PushNotifications": {
			"presentationOptions": [
				"badge",
				"sound",
				"alert"
			]
		}
  }
};

export default config;
