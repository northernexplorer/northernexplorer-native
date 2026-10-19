import React from 'react';
import {View, Text, Pressable, StyleSheet, Linking, Platform} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles as globalStyles} from '~/layout/Home/styles';

type MobileOS = 'android' | 'ios' | null;

interface StoreConfig {
	nativeUrl: string;
	webUrl: string;
	iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
	badgeSubtext: string;
	badgeTitle: string;
	accessibilityLabel: string;
}

const STORE_CONFIG: Record<'android' | 'ios', StoreConfig> = {
	android: {
		nativeUrl: 'market://details?id=org.northernexplorer.app',
		webUrl: 'https://play.google.com/store/apps/details?id=org.northernexplorer.app',
		iconName: 'google-play',
		badgeSubtext: 'GET IT ON',
		badgeTitle: 'Google Play',
		accessibilityLabel: 'Get it on Google Play',
	},
	ios: {
		nativeUrl: 'itms-apps://apps.apple.com/app/id6742512039', //todo Replace the IOS store id when released
		webUrl: 'https://apps.apple.com/app/id6742512039',
		iconName: 'apple',
		badgeSubtext: 'DOWNLOAD ON THE',
		badgeTitle: 'App Store',
		accessibilityLabel: 'Download on the App Store',
	},
};

export function getMobileBrowserOS(): MobileOS {
	if (Platform.OS !== 'web') {
		return null;
	}

	if (typeof navigator === 'undefined' || !navigator.userAgent) {
		return null;
	}

	const ua = navigator.userAgent.toLowerCase();

	// Exclude embedded WebViews (e.g., custom app WebViews or in-app browsers)
	const isWebView = /wv|fbav|instagram/.test(ua);
	if (isWebView) {
		return null;
	}

	if (/android/.test(ua)) {
		return 'android';
	}

	// Detect iOS devices (iPhone, iPad, iPod, or iPad OS desktop emulation)
	const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
	if (isIOS) {
		return 'ios';
	}

	return null;
}

export function DownloadAppWidget() {
	const mobileOS = getMobileBrowserOS();

	if (!mobileOS) {
		return null;
	}

	const config = STORE_CONFIG[mobileOS];

	const handleDownload = async () => {
		try {
			await Linking.openURL(config.nativeUrl);
		} catch {
			await Linking.openURL(config.webUrl);
		}
	};

	return (
		<View style={globalStyles.sectionContainer}>
			<Pressable
				style={({pressed}) => [globalStyles.tile, styles.container, pressed && styles.cardPressed]}
				onPress={handleDownload}
				accessibilityRole="button"
				accessibilityLabel={config.accessibilityLabel}
			>
				<View style={styles.inner}>
					<View style={styles.content}>
						<View style={styles.headerRow}>
							<MaterialCommunityIcons name={config.iconName} size={16} color="#00F0FF" style={styles.headerIcon} />
							<Text style={styles.title}>GET THE APP</Text>
						</View>
						<Text style={styles.description} numberOfLines={1}>
							Get the best experience with our native app.
						</Text>
					</View>

					<View style={styles.storeBadge}>
						<MaterialCommunityIcons name={config.iconName} size={20} color="#00F0FF" style={styles.badgeIcon} />
						<View style={styles.badgeTextContainer}>
							<Text style={styles.badgeSubtext}>{config.badgeSubtext}</Text>
							<Text style={styles.badgeTitle}>{config.badgeTitle}</Text>
						</View>
					</View>
				</View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
		borderColor: 'rgba(0, 240, 255, 0.2)',
		overflow: 'hidden',
	},
	cardPressed: {
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
		borderColor: 'rgba(0, 240, 255, 0.4)',
	},
	inner: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	content: {
		flex: 1,
		minWidth: 0,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 2,
	},
	headerIcon: {
		marginRight: 6,
	},
	title: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: '600',
		letterSpacing: 0.3,
	},
	description: {
		color: 'rgba(255, 255, 255, 0.7)',
		fontSize: 12,
	},
	storeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#000000',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#333333',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
	badgeIcon: {
		marginRight: 8,
	},
	badgeTextContainer: {
		flexDirection: 'column',
	},
	badgeSubtext: {
		color: '#FFFFFF',
		fontSize: 8,
		fontWeight: '500',
		letterSpacing: 0.2,
		textTransform: 'uppercase',
	},
	badgeTitle: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
		letterSpacing: -0.3,
		lineHeight: 16,
	},
});
