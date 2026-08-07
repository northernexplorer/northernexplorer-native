import React, {useState, useRef, useCallback} from 'react';
import {View, Text, Platform, Animated, Easing, StyleSheet} from 'react-native';
import * as Location from 'expo-location';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useFocusEffect} from 'expo-router';
import {ProFeatureOnly, Spinner} from '@northernexplorer/tools';
import {getCardinalDirection} from '~/location/lib/getCardinalDirection';
import {useApiFetch} from '~/core/useApiFetch';

export function Compass() {
	const [heading, setHeading] = useState<number>(0);
	const [accuracy, setAccuracy] = useState<number>(3); // 3 = High, 1 = Low
	const [isAvailable, setIsAvailable] = useState<boolean>(true);

	const animatedDegrees = useRef(new Animated.Value(0)).current;
	const targetDegrees = useRef<number>(0);

	const {data: permissionData, loading} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});

	const needsCalibration = accuracy <= 1;

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
	const canUseCompass = !!permissionData?.navigation.useCompass;

	if (loading) return <Spinner />;
	if (!canUseCompass) return <ProFeatureOnly />;

	if (!isAvailable) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<MaterialCommunityIcons name="compass-off-outline" size={72} color="#94a3b8" />
					<Text style={styles.unavailableTitle}>Compass Unavailable</Text>
					<Text style={styles.unavailableSubtext}>Sensors are unavailable or location permissions were not granted.</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.centerContainer}>
				{/* Compass Housing */}
				<View style={styles.compassContainer}>
					<View style={styles.topHeadingPointer} />

					<View style={styles.outerRing}>
						<Animated.View style={[styles.dialContainer, {transform: [{rotate}]}]}>
							<Text style={[styles.cardinalLabel, styles.northLabel]}>N</Text>
							<Text style={[styles.cardinalLabel, styles.eastLabel]}>E</Text>
							<Text style={[styles.cardinalLabel, styles.southLabel]}>S</Text>
							<Text style={[styles.cardinalLabel, styles.westLabel]}>W</Text>

							<View style={[styles.needleTipNorth, {borderBottomColor: '#ef4444'}]} />
							<View style={styles.needleTipSouth} />
							<View style={styles.centerPivot} />
						</Animated.View>
					</View>
				</View>

				{/* Heading Display */}
				<Text style={styles.headingReadout}>
					{heading}° <Text style={styles.cardinalText}>{cardinal}</Text>
				</Text>

				{/* Calibration & Status Section */}
				<View style={styles.statusSection}>
					{needsCalibration ? (
						<View style={styles.calibrationPill}>
							<View style={styles.calibrationInfo}>
								<View style={styles.warningDot} />
								<Text style={styles.calibrationText}>
									Wave device in a <Text style={styles.boldText}>figure-8</Text>
								</Text>
							</View>

							<View style={styles.animationStage}>
								<MaterialCommunityIcons name="cellphone" size={16} color="#f59e0b" />
							</View>
						</View>
					) : (
						<View style={styles.statusBadge}>
							<View style={styles.activeDot} />
							<Text style={styles.statusText}>Heading Accurate</Text>
						</View>
					)}
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
		borderColor: 'rgba(15, 23, 42, 0.08)',
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
		marginTop: 8,
	},
	cardinalText: {
		color: '#0284c7',
		fontWeight: '600',
	},
	statusSection: {
		marginTop: 16,
		minHeight: 36,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		backgroundColor: '#1a1a1a',
		borderWidth: 1,
		borderColor: '#334155',
	},
	activeDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#10b981',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#cbd5e1',
	},
	calibrationPill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingLeft: 12,
		paddingRight: 6,
		paddingVertical: 5,
		borderRadius: 20,
		backgroundColor: '#1a1a1a',
		borderWidth: 1,
		borderColor: '#334155',
	},
	calibrationInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	warningDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#f59e0b',
	},
	calibrationText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#cbd5e1',
	},
	boldText: {
		fontWeight: '700',
		color: '#f59e0b',
	},
	animationStage: {
		width: 28,
		height: 22,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.06)',
		borderRadius: 11,
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
