import React from 'react';
import {View, Text, Pressable, StyleSheet, Linking, Platform} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles as globalStyles} from '~/layout/Home/styles';

const ANDROID_PLAY_STORE_URL = 'market://details?id=org.northernexplorer.app';
const ANDROID_PLAY_STORE_WEB_URL = 'https://play.google.com/store/apps/details?id=org.northernexplorer.app';

export function isAndroidBrowser(): boolean {
	if (Platform.OS !== 'web') {
		return false;
	}

	if (typeof navigator === 'undefined' || !navigator.userAgent) {
		return false;
	}

	const ua = navigator.userAgent.toLowerCase();
	const isAndroid = /android/.test(ua);
	const isWebView = /wv/.test(ua);

	return isAndroid && !isWebView;
}

export function DownloadAppWidget() {
	if (!isAndroidBrowser()) {
		return null;
	}

	const handleDownload = async () => {
		try {
			await Linking.openURL(ANDROID_PLAY_STORE_URL);
		} catch {
			await Linking.openURL(ANDROID_PLAY_STORE_WEB_URL);
		}
	};

	return (
		<View style={globalStyles.sectionContainer}>
			<View style={[globalStyles.tile, styles.container]}>
				<View style={styles.inner}>
					<View style={styles.content}>
						<View style={styles.headerRow}>
							<MaterialCommunityIcons name="google-play" size={16} color="#00F0FF" style={styles.headerIcon} />
							<Text style={styles.title}>GET THE APP</Text>
						</View>
						<Text style={styles.description} numberOfLines={1}>
							Get the best experience with our Android app.
						</Text>
					</View>

					<Pressable
						style={({pressed}) => [styles.storeBadge, pressed && styles.badgePressed]}
						onPress={handleDownload}
						accessibilityRole="button"
						accessibilityLabel="Get it on Google Play"
					>
						<MaterialCommunityIcons name="google-play" size={20} color="#00F0FF" style={styles.badgeIcon} />
						<View style={styles.badgeTextContainer}>
							<Text style={styles.badgeSubtext}>GET IT ON</Text>
							<Text style={styles.badgeTitle}>Google Play</Text>
						</View>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
		borderColor: 'rgba(0, 240, 255, 0.2)',
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
		minWidth: 0, // Ensures text truncation works correctly in flexbox
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
	badgePressed: {
		opacity: 0.8,
		backgroundColor: '#1a1a1a',
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
