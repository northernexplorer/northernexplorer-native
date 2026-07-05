import { Platform } from 'react-native';

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
};
