import React from 'react';
import {View, Text, Pressable, StyleSheet, Linking, Platform, useWindowDimensions} from 'react-native';
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

	return /android/i.test(navigator.userAgent);
}

export function DownloadAppWidget() {
	const {width} = useWindowDimensions();
	const isMobile = width < 768;

	if (!isAndroidBrowser()) {
		return null;
	}

	const handleDownload = async () => {
		try {
			const supported = await Linking.canOpenURL(ANDROID_PLAY_STORE_URL);
			if (supported) {
				await Linking.openURL(ANDROID_PLAY_STORE_URL);
			} else {
				await Linking.openURL(ANDROID_PLAY_STORE_WEB_URL);
			}
		} catch {
			await Linking.openURL(ANDROID_PLAY_STORE_WEB_URL);
		}
	};

	return (
		<View style={globalStyles.sectionContainer}>
			<View style={[globalStyles.tile, styles.container]}>
				<View style={[styles.inner, isMobile && styles.innerMobile]}>
					<View style={styles.content}>
						<View style={styles.headerRow}>
							<MaterialCommunityIcons name="google-play" size={18} color="#00F0FF" style={styles.headerIcon} />
							<Text style={styles.title}>GET THE APP</Text>
						</View>
						<Text style={styles.description}>Get the best experience with our Android app.</Text>
					</View>

					<Pressable
						style={({pressed}) => [styles.storeBadge, pressed && styles.badgePressed]}
						onPress={handleDownload}
						accessibilityRole="button"
						accessibilityLabel="Get it on Google Play"
					>
						<MaterialCommunityIcons name="google-play" size={24} color="#00F0FF" style={styles.badgeIcon} />
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
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 16,
	},
	innerMobile: {
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	content: {
		flex: 1,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	headerIcon: {
		marginRight: 6,
	},
	title: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 4,
	},
	description: {
		color: 'rgba(255, 255, 255, 0.7)',
		fontSize: 13,
		lineHeight: 18,
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
		minWidth: 160,
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
