import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Platform, Animated, Easing, Pressable} from 'react-native';
import * as Location from 'expo-location';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {styles} from '~/layout/Home/styles';
import {getCardinalDirection} from '~/location/lib/getCardinalDirection';

export function CompassWidget() {
	const [heading, setHeading] = useState<number>(0);
	const [accuracy, setAccuracy] = useState<number>(3); // 3 = High accuracy, 1 = Low
	const [isAvailable, setIsAvailable] = useState<boolean>(true);

	const animatedDegrees = useRef(new Animated.Value(0)).current;
	const targetDegrees = useRef<number>(0);

	useEffect(() => {
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

			subscription = await Location.watchHeadingAsync(headingData => {
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
		};

		setupFusedCompass();

		return () => {
			mounted = false;
			subscription?.remove();
		};
	}, []);

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
				<View style={{width: 56, height: 56, alignItems: 'center', justifyContent: 'center'}}>
					<Animated.View style={{transform: [{rotate}]}}>
						<MaterialCommunityIcons name="compass-outline" size={54} color={needsCalibration ? '#f59e0b' : '#ffffff'} />
					</Animated.View>
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
