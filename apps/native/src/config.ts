import {Platform} from 'react-native';

function getServerUrl(): string {
	const webUrl = process.env.EXPO_PUBLIC_SERVER_URL_WEB?.trim();
	const appUrl = process.env.EXPO_PUBLIC_SERVER_URL_APP?.trim();

	if (Platform.OS === 'web') {
		return webUrl || 'https://api.northernexplorer.org';
	}

	return appUrl || 'https://api.northernexplorer.org';
}

export const config = {
	SERVER_URL: getServerUrl(),
	EXPO_PUBLIC_REVENUE_IOS_KEY: process.env.EXPO_PUBLIC_REVENUE_IOS_KEY,
	EXPO_PUBLIC_REVENUE_ANDROID_KEY: process.env.EXPO_PUBLIC_REVENUE_ANDROID_KEY,
	REVENUE_CAT_GOOGLE_KEY: process.env.REVENUE_CAT_GOOGLE_KEY || 'goog_wbEWAJKThumlQYKsqvyOlyGVVnB',
};
