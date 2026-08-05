import React, {useState, useRef, useCallback} from 'react';
import {View, Text, Platform, Animated, Easing, Pressable} from 'react-native';
import * as Location from 'expo-location';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link, useFocusEffect} from 'expo-router';
import {styles} from '~/layout/Home/styles';
import {getCardinalDirection} from '~/location/lib/getCardinalDirection';

export function CompassWidget() {
	const [heading, setHeading] = useState<number>(0);
	const [accuracy, setAccuracy] = useState<number>(3);
	const [isAvailable, setIsAvailable] = useState<boolean>(true);

	const animatedDegrees = useRef(new Animated.Value(0)).current;
	const targetDegrees = useRef<number>(0);

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

				// Safety check: If component unmounted while awaiting watchHeadingAsync
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

	if (!isAvailable) {
		return (
			<Link href="/location/compass" asChild>
				<Pressable
					style={{
						...styles.tile,
						padding: 16,
						alignItems: 'center',
						justifyContent: 'center',
						flex: 1,
						marginRight: 0,
					}}
				>
					<MaterialCommunityIcons name="compass-off-outline" size={48} color="rgba(255,255,255,0.4)" />
					<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 8, textAlign: 'center'}}>Compass Unavailable</Text>
				</Pressable>
			</Link>
		);
	}

	const cardinal = getCardinalDirection(heading);
	const needsCalibration = accuracy <= 1;

	return (
		<Link href="/location/compass" asChild>
			<Pressable
				style={{
					...styles.tile,
					padding: 16,
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
					marginRight: 0,
				}}
			>
				<View style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center'}}>
					<View
						style={{
							position: 'absolute',
							top: -2,
							width: 0,
							height: 0,
							borderLeftWidth: 4,
							borderRightWidth: 4,
							borderBottomWidth: 6,
							borderLeftColor: 'transparent',
							borderRightColor: 'transparent',
							borderBottomColor: '#ffffff',
							zIndex: 10,
						}}
					/>

					<View
						style={{
							width: 56,
							height: 56,
							borderRadius: 28,
							borderWidth: 1.5,
							borderColor: 'rgba(255,255,255,0.15)',
							alignItems: 'center',
						}}
					>
						<Animated.View
							style={{
								width: 48,
								height: 48,
								alignItems: 'center',
								justifyContent: 'center',
								transform: [{rotate}],
							}}
						>
							<View
								style={{
									position: 'absolute',
									top: 4,
									width: 0,
									height: 0,
									borderLeftWidth: 6,
									borderRightWidth: 6,
									borderBottomWidth: 18,
									borderLeftColor: 'transparent',
									borderRightColor: 'transparent',
									borderBottomColor: needsCalibration ? '#f59e0b' : '#ef4444',
								}}
							/>

							<View
								style={{
									position: 'absolute',
									bottom: 4,
									width: 0,
									height: 0,
									borderLeftWidth: 6,
									borderRightWidth: 6,
									borderTopWidth: 18,
									borderLeftColor: 'transparent',
									borderRightColor: 'transparent',
									borderTopColor: 'rgba(255, 255, 255, 0.3)',
								}}
							/>

							<View
								style={{
									width: 6,
									height: 6,
									borderRadius: 3,
									backgroundColor: '#ffffff',
									zIndex: 5,
								}}
							/>
						</Animated.View>
					</View>
				</View>

				<Text style={{color: '#ffffff', fontSize: 14, fontWeight: '700', marginTop: 8, textAlign: 'center'}}>
					{heading}° {cardinal}
				</Text>

				<Text style={{color: needsCalibration ? '#f59e0b' : 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>
					{needsCalibration ? 'Calibration Required' : 'Heading'}
				</Text>
			</Pressable>
		</Link>
	);
}
