import React, {useState, useRef, useCallback} from 'react';
import {View, Text, Platform, Animated, Easing, StyleSheet} from 'react-native';
import * as Location from 'expo-location';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useFocusEffect} from 'expo-router';
import {getCardinalDirection} from '~/location/lib/getCardinalDirection';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {ProFeatureOnly} from '~/layout/Layout/components/ProFeatureOnly';

export function Compass() {
	const [heading, setHeading] = useState<number>(0);
	const [accuracy, setAccuracy] = useState<number>(3); // 3 = High accuracy, 1 = Low
	const [isAvailable, setIsAvailable] = useState<boolean>(true);
	const authentication = useAuthentication();

	const animatedDegrees = useRef(new Animated.Value(0)).current;
	const targetDegrees = useRef<number>(0);
	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {username: authentication?.username});

	useFocusEffect(
		useCallback(() => {
			let subscription: Location.LocationSubscription | null = null;
			let mounted = true;

			const setupFusedCompass = async () => {
				if (Platform.OS === 'web') {
					if (mounted) setIsAvailable(false);
					return;
				}

				const {status} = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					if (mounted) setIsAvailable(false);
					return;
				}

				const sub = await Location.watchHeadingAsync(headingData => {
					if (!mounted) return;

					const rawAngle = headingData.trueHeading >= 0 ? headingData.trueHeading : headingData.magHeading;
					const rounded = Math.round(rawAngle);

					setAccuracy(headingData.accuracy);
					setHeading(rounded);

					// Calculate shortest path for dial rotation (-heading)
					let delta = -rounded - targetDegrees.current;
					if (delta > 180) delta -= 360;
					if (delta < -180) delta += 360;

					targetDegrees.current += delta;

					Animated.timing(animatedDegrees, {
						toValue: targetDegrees.current,
						duration: 100,
						easing: Easing.out(Easing.quad),
						useNativeDriver: true,
					}).start();
				});

				if (!mounted) {
					sub.remove();
				} else {
					subscription = sub;
				}
			};

			setupFusedCompass();

			return () => {
				mounted = false;
				subscription?.remove();
			};
		}, []),
	);

	const rotate = animatedDegrees.interpolate({
		inputRange: [0, 360],
		outputRange: ['0deg', '360deg'],
	});

	const cardinal = getCardinalDirection(heading);
	const needsCalibration = accuracy <= 1;
	const canUseCompass = !!permissionData?.navigation.useCompass;

	if (!canUseCompass) return <ProFeatureOnly />;

	if (!isAvailable) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<MaterialCommunityIcons name="compass-off-outline" size={80} color="#94a3b8" />
					<Text style={styles.unavailableTitle}>Compass Unavailable</Text>
					<Text style={styles.unavailableSubtext}>Sensors are unavailable or location permissions were not granted.</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.centerContainer}>
				{/* Expanded Compass Dial Assembly */}
				<View style={styles.compassContainer}>
					{/* Fixed Top Pointer (Device Heading Marker) */}
					<View style={styles.topHeadingPointer} />

					{/* Outer Static Housing Ring */}
					<View style={styles.outerRing}>
						{/* Rotating Compass Dial Assembly */}
						<Animated.View style={[styles.dialContainer, {transform: [{rotate}]}]}>
							{/* Cardinal Labels on Dial Face */}
							<Text style={[styles.cardinalLabel, styles.northLabel]}>N</Text>
							<Text style={[styles.cardinalLabel, styles.eastLabel]}>E</Text>
							<Text style={[styles.cardinalLabel, styles.southLabel]}>S</Text>
							<Text style={[styles.cardinalLabel, styles.westLabel]}>W</Text>

							{/* North Pointer Tip (Red / Amber if calibrating) */}
							<View style={[styles.needleTipNorth, {borderBottomColor: needsCalibration ? '#d97706' : '#ef4444'}]} />

							{/* South Pointer Tip (Muted Silver) */}
							<View style={styles.needleTipSouth} />

							{/* Pivot Cap */}
							<View style={styles.centerPivot} />
						</Animated.View>
					</View>
				</View>

				{/* Primary Readout */}
				<Text style={styles.headingReadout}>
					{heading}° <Text style={styles.cardinalText}>{cardinal}</Text>
				</Text>

				{/* Status Line */}
				<View style={styles.statusBadge}>
					<Text style={[styles.statusText, {color: needsCalibration ? '#d97706' : '#64748b'}]}>
						{needsCalibration ? 'Calibration Required' : 'Heading'}
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	compassContainer: {
		width: 260,
		height: 260,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	topHeadingPointer: {
		position: 'absolute',
		top: -4,
		width: 0,
		height: 0,
		borderLeftWidth: 8,
		borderRightWidth: 8,
		borderBottomWidth: 12,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: '#0284c7',
		zIndex: 20,
	},
	outerRing: {
		width: 240,
		height: 240,
		borderRadius: 120,
		borderWidth: 2,
		borderColor: 'rgba(15, 23, 42, 0.15)',
		backgroundColor: 'rgba(15, 23, 42, 0.02)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	dialContainer: {
		width: 230,
		height: 230,
		borderRadius: 115,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	cardinalLabel: {
		position: 'absolute',
		fontSize: 14,
		fontWeight: '800',
		color: '#64748b',
	},
	northLabel: {
		top: 8,
		color: '#ef4444',
	},
	eastLabel: {
		right: 12,
	},
	southLabel: {
		bottom: 8,
	},
	westLabel: {
		left: 12,
	},
	needleTipNorth: {
		position: 'absolute',
		top: 32,
		width: 0,
		height: 0,
		borderLeftWidth: 12,
		borderRightWidth: 12,
		borderBottomWidth: 80,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
	},
	needleTipSouth: {
		position: 'absolute',
		bottom: 32,
		width: 0,
		height: 0,
		borderLeftWidth: 12,
		borderRightWidth: 12,
		borderTopWidth: 80,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#cbd5e1',
	},
	centerPivot: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#0f172a',
		borderWidth: 2,
		borderColor: '#ffffff',
		zIndex: 10,
	},
	headingReadout: {
		color: '#0f172a',
		fontSize: 52,
		fontWeight: '800',
		letterSpacing: -1,
		textAlign: 'center',
	},
	cardinalText: {
		color: '#0284c7',
		fontWeight: '600',
	},
	statusBadge: {
		marginTop: 8,
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 16,
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
	},
	statusText: {
		fontSize: 13,
		fontWeight: '600',
	},
	unavailableTitle: {
		color: '#0f172a',
		fontSize: 20,
		fontWeight: '700',
		marginTop: 16,
	},
	unavailableSubtext: {
		color: '#64748b',
		fontSize: 14,
		marginTop: 8,
		textAlign: 'center',
		maxWidth: 280,
	},
});
