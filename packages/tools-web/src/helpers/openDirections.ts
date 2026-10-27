import {Linking, Platform} from 'react-native';

export interface OpenDirectionsOptions {
	lat: number | string;
	lon: number | string;
	label?: string;
}

/**
 * Opens Apple Maps (on iOS) or Google Maps (on Android / Web / fallback)
 * to provide directions to the specified point of interest coordinates.
 */
export async function openDirections(
	latOrOptions: number | string | OpenDirectionsOptions,
	lonArg?: number | string,
	labelArg?: string,
): Promise<void> {
	let lat: number | string;
	let lon: number | string;
	let label: string | undefined;

	if (typeof latOrOptions === 'object') {
		lat = latOrOptions.lat;
		lon = latOrOptions.lon;
		label = latOrOptions.label;
	} else {
		lat = latOrOptions;
		lon = lonArg!;
		label = labelArg;
	}

	const parsedLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
	const parsedLon = typeof lon === 'number' ? lon : parseFloat(String(lon));

	if (isNaN(parsedLat) || isNaN(parsedLon)) {
		return;
	}

	const destination = `${parsedLat},${parsedLon}`;
	const encodedLabel = label ? encodeURIComponent(label) : '';

	// Determine platform-specific navigation URL
	let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

	if (Platform.OS === 'ios') {
		url = `maps://?daddr=${destination}${encodedLabel ? `&q=${encodedLabel}` : ''}`;
	} else if (Platform.OS === 'android') {
		url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
	}

	try {
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		} else {
			const fallbackUrl =
				Platform.OS === 'ios'
					? `https://maps.apple.com/?daddr=${destination}${encodedLabel ? `&q=${encodedLabel}` : ''}`
					: `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
			await Linking.openURL(fallbackUrl);
		}
	} catch {
		const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
		try {
			await Linking.openURL(fallbackUrl);
		} catch {
			// Fail silently if unable to open URL
		}
	}
}
