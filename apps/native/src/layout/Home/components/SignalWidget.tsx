import React, {ComponentProps, useEffect, useState} from 'react';
import {View, Text, Pressable, Platform} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import {Link} from 'expo-router';
import {styles} from '~/layout/Home/styles';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SignalStatus {
	label: string;
	icon: IconName;
	color: string;
}

export function SignalWidget() {
	const isWeb = Platform.OS === 'web';

	const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

	useEffect(() => {
		if (isWeb) return;

		let locationSubscription: Location.LocationSubscription | null = null;

		(async () => {
			const {status} = await Location.requestForegroundPermissionsAsync();
			if (status === 'granted') {
				locationSubscription = await Location.watchPositionAsync(
					{
						accuracy: Location.Accuracy.High,
						timeInterval: 4000,
						distanceInterval: 1,
					},
					loc => {
						setGpsAccuracy(loc.coords.accuracy);
					},
				);
			}
		})();

		return () => {
			locationSubscription?.remove();
		};
	}, [isWeb]);

	if (isWeb) {
		return (
			<Pressable
				disabled
				style={{
					...styles.tile,
					padding: 6,
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '100%',
					opacity: 0.5,
				}}
			>
				<View
					style={{
						width: 36,
						height: 36,
						borderRadius: 18,
						borderWidth: 1,
						borderColor: 'rgba(255,255,255,0.08)',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<MaterialCommunityIcons name="signal-off" size={18} color="rgba(255,255,255,0.3)" />
				</View>

				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', marginTop: 4, textAlign: 'center'}} numberOfLines={1}>
					N/A
				</Text>
			</Pressable>
		);
	}

	const getGpsSignalInfo = (accuracy: number | null): SignalStatus => {
		if (accuracy === null) {
			return {label: 'SEARCH', icon: 'satellite-variant', color: 'rgba(255,255,255,0.6)'};
		}
		if (accuracy <= 10) {
			return {label: `±${Math.round(accuracy)}m`, icon: 'satellite-uplink', color: '#22c55e'};
		}
		if (accuracy <= 35) {
			return {label: `±${Math.round(accuracy)}m`, icon: 'satellite-uplink', color: '#fbbf24'};
		}
		return {label: `±${Math.round(accuracy)}m`, icon: 'signal-off', color: '#ff4d4d'};
	};

	const gpsInfo = getGpsSignalInfo(gpsAccuracy);

	return (
		<Link href="/location/signal" asChild>
			<Pressable
				style={{
					...styles.tile,
					padding: 6,
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '100%',
				}}
			>
				<View
					style={{
						width: 36,
						height: 36,
						borderRadius: 18,
						borderWidth: 1,
						borderColor: 'rgba(255,255,255,0.15)',
						backgroundColor: 'transparent',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<MaterialCommunityIcons name={gpsInfo.icon} size={18} color={gpsInfo.color} />
				</View>

				<Text
					style={{
						color: '#ffffff',
						fontSize: 10,
						fontWeight: '800',
						marginTop: 4,
						textAlign: 'center',
					}}
					numberOfLines={1}
				>
					{gpsInfo.label}
				</Text>
			</Pressable>
		</Link>
	);
}
