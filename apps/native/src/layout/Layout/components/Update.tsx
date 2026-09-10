import React from 'react';
import {View, Text, StyleSheet, Platform, Linking, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const IOS_APP_STORE_URL = 'https://apps.apple.com/app/idorg.northernexplorer.app';
const ANDROID_PLAY_STORE_URL = 'market://details?id=org.northernexplorer.app';
const ANDROID_PLAY_STORE_WEB_URL = 'https://play.google.com/store/apps/details?id=org.northernexplorer.app';

export function Update() {
	const handleOpenStore = async (targetPlatform: 'ios' | 'android') => {
		const storeUrl = targetPlatform === 'ios' ? IOS_APP_STORE_URL : ANDROID_PLAY_STORE_URL;

		const supported = await Linking.canOpenURL(storeUrl);
		if (supported) {
			await Linking.openURL(storeUrl);
		} else if (targetPlatform === 'android') {
			await Linking.openURL(ANDROID_PLAY_STORE_WEB_URL);
		} else {
			await Linking.openURL(IOS_APP_STORE_URL);
		}
	};

	const isIos = Platform.OS === 'ios';
	const isAndroid = Platform.OS === 'android';
	const isWeb = Platform.OS === 'web';

	return (
		<View style={styles.container}>
			<View style={styles.iconBadge}>
				<MaterialCommunityIcons name="download" size={32} color="#d9d9d9" />
			</View>

			<Text style={styles.title}>Update Required</Text>
			<Text style={styles.subtitle}>An update is required. Check your app store to update now!</Text>

			{/* Store Buttons Wrapper */}
			<View style={styles.buttonContainer}>
				{(isIos || isWeb) && (
					<Pressable style={({pressed}) => [styles.storeBadge, pressed && styles.badgePressed]} onPress={() => handleOpenStore('ios')}>
						<MaterialCommunityIcons name="apple" size={26} color="#FFFFFF" style={styles.badgeIcon} />
						<View style={styles.badgeTextContainer}>
							<Text style={styles.badgeSubtext}>Download on the</Text>
							<Text style={styles.badgeTitle}>App Store</Text>
						</View>
					</Pressable>
				)}

				{(isAndroid || isWeb) && (
					<Pressable style={({pressed}) => [styles.storeBadge, pressed && styles.badgePressed]} onPress={() => handleOpenStore('android')}>
						<MaterialCommunityIcons name="google-play" size={24} color="#00F0FF" style={styles.badgeIcon} />
						<View style={styles.badgeTextContainer}>
							<Text style={styles.badgeSubtext}>GET IT ON</Text>
							<Text style={styles.badgeTitle}>Google Play</Text>
						</View>
					</Pressable>
				)}
			</View>
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
	buttonContainer: {
		flexDirection: 'column',
		gap: 12,
		alignItems: 'center',
	},
	storeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#000000',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#333333',
		minWidth: 170,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	badgePressed: {
		opacity: 0.8,
		backgroundColor: '#1a1a1a',
	},
	badgeIcon: {
		marginRight: 10,
	},
	badgeTextContainer: {
		flexDirection: 'column',
	},
	badgeSubtext: {
		color: '#FFFFFF',
		fontSize: 9,
		fontWeight: '500',
		letterSpacing: 0.2,
		textTransform: 'uppercase',
	},
	badgeTitle: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
		letterSpacing: -0.3,
		lineHeight: 18,
	},
});
