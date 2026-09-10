import React from 'react';
import {View, Text, StyleSheet, Platform, Linking, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

// Replace these with your actual App Store ID and Play Store package name
const IOS_APP_STORE_URL = 'https://apps.apple.com/app/idorg.northernexplorer.app';
const ANDROID_PLAY_STORE_URL = 'market://details?id=org.northernexplorer.app';
const ANDROID_PLAY_STORE_WEB_URL = 'https://play.google.com/store/apps/details?id=org.northernexplorer.app';

export function Update() {
	const handleUpdate = async () => {
		const storeUrl = Platform.select({
			ios: IOS_APP_STORE_URL,
			android: ANDROID_PLAY_STORE_URL,
		});

		if (!storeUrl) return;

		try {
			const supported = await Linking.canOpenURL(storeUrl);
			if (supported) {
				await Linking.openURL(storeUrl);
			} else if (Platform.OS === 'android') {
				// Fall back to browser link on Android if market:// scheme isn't supported
				await Linking.openURL(ANDROID_PLAY_STORE_WEB_URL);
			}
		} catch (error) {
			console.error('Failed to open store link:', error);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.iconBadge}>
				<MaterialCommunityIcons name="download" size={32} color="#d9d9d9" />
			</View>

			<Text style={styles.title}>Update Required</Text>
			<Text style={styles.subtitle}>An update is required. Check your app store to update now!</Text>

			<View style={styles.pill}>
				<View style={styles.statusDot} />
				<Text style={styles.pillText}>Version out of date</Text>
			</View>

			<TouchableOpacity style={styles.button} onPress={handleUpdate} activeOpacity={0.8}>
				<Text style={styles.buttonText}>{Platform.OS === 'ios' ? 'Open App Store' : 'Open Play Store'}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	iconBadge: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '#1a1a1a',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#333',
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
		marginBottom: 20,
	},
	pill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1a1a1a',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#334155',
		marginBottom: 24,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#f59e0b',
		marginRight: 8,
	},
	pillText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#cbd5e1',
	},
	button: {
		backgroundColor: '#2563eb',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
	},
});
