import {modelName, osName} from 'expo-device';
import {Platform} from 'react-native';

function getBrowserName() {
	if (Platform.OS !== 'web' || typeof navigator === 'undefined') {
		return null;
	}

	const ua = navigator.userAgent;

	if (ua.includes('Chrome')) return 'Chrome';
	if (ua.includes('Firefox')) return 'Firefox';
	if (ua.includes('Safari')) return 'Safari';
	if (ua.includes('Edg')) return 'Edge';
}

function getWebOS() {
	if (Platform.OS !== 'web' || typeof navigator === 'undefined') {
		return null;
	}

	const ua = navigator.userAgent;

	if (ua.includes('Windows')) return 'Windows';
	if (ua.includes('Mac OS')) return 'macOS';
	if (ua.includes('Android')) return 'Android';
	if (ua.includes('iPhone')) return 'iOS';
	if (ua.includes('Linux')) return 'Linux';

	return 'Unknown';
}

export function useDeviceInfo() {
	return {
		osName: osName || getWebOS() || 'Unknown',
		clientName: modelName || getBrowserName() || 'Unknown',
		platform: Platform.OS,
	};
}
