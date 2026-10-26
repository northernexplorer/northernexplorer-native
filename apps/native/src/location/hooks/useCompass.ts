import {useState, useRef, useCallback} from 'react';
import {Platform, Animated, Easing} from 'react-native';
import * as Location from 'expo-location';
import {useFocusEffect} from 'expo-router';
import {getCardinalDirection} from '~/location/lib/getCardinalDirection';

const UPDATE_INTERVAL_MS = 300;

export function useCompass() {
	const [heading, setHeading] = useState<number>(0);
	// Initial default per platform to avoid flash of calibration state
	const [accuracy, setAccuracy] = useState<number>(Platform.OS === 'ios' ? 5 : 3);
	const [isAvailable, setIsAvailable] = useState<boolean>(true);

	const animatedDegrees = useRef(new Animated.Value(0)).current;
	const targetDegrees = useRef<number>(0);

	// Platform-specific accuracy evaluation:
	// - iOS: accuracy is error margin in degrees (0..360, negative if invalid)
	// - Android: accuracy is integer enum (0 = Unreliable, 1 = Low, 2 = Medium, 3 = High)
	const needsCalibration = Platform.OS === 'ios' ? accuracy > 20 || accuracy < 0 : accuracy === 0;

	useFocusEffect(
		useCallback(() => {
			let subscription: Location.LocationSubscription | null = null;
			let mounted = true;
			let throttleTimer: ReturnType<typeof setTimeout> | null = null;
			let lastUpdateTime = 0;
			let latestHeadingData: Location.LocationHeadingObject | null = null;

			const updateHeading = (headingData: Location.LocationHeadingObject) => {
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
					duration: UPDATE_INTERVAL_MS,
					easing: Easing.out(Easing.quad),
					useNativeDriver: true,
				}).start();
			};

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

					latestHeadingData = headingData;
					const now = Date.now();
					const timeSinceLastUpdate = now - lastUpdateTime;

					if (timeSinceLastUpdate >= UPDATE_INTERVAL_MS) {
						if (throttleTimer) {
							clearTimeout(throttleTimer);
							throttleTimer = null;
						}
						lastUpdateTime = now;
						updateHeading(headingData);
					} else if (!throttleTimer) {
						throttleTimer = setTimeout(() => {
							if (!mounted) return;
							throttleTimer = null;
							lastUpdateTime = Date.now();
							if (latestHeadingData) {
								updateHeading(latestHeadingData);
							}
						}, UPDATE_INTERVAL_MS - timeSinceLastUpdate);
					}
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
				if (throttleTimer) {
					clearTimeout(throttleTimer);
				}
				subscription?.remove();
			};
		}, []),
	);

	const rotate = animatedDegrees.interpolate({
		inputRange: [0, 360],
		outputRange: ['0deg', '360deg'],
	});

	const cardinal = getCardinalDirection(heading);

	return {
		heading,
		cardinal,
		rotate,
		isAvailable,
		needsCalibration,
	};
}
