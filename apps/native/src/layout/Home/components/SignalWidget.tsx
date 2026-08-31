import React, {ComponentProps, useEffect, useState} from 'react';
import {View, Text, Pressable, Platform} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import NetInfo, {NetInfoStateType, NetInfoState} from '@react-native-community/netinfo';
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

	const [networkState, setNetworkState] = useState<NetInfoState | null>(null);
	const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

	useEffect(() => {
		if (isWeb) return;

		const unsubscribeNet = NetInfo.addEventListener(state => {
			setNetworkState(state);
		});

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
			unsubscribeNet();
			locationSubscription?.remove();
		};
	}, [isWeb]);

	if (isWeb) {
		return (
			<Pressable
				disabled
				style={{
					...styles.tile,
					padding: 16,
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
					marginRight: 0,
					opacity: 0.5,
				}}
			>
				<View
					style={{
						width: 56,
						height: 56,
						borderRadius: 28,
						borderWidth: 1.5,
						borderColor: 'rgba(255,255,255,0.08)',
						backgroundColor: 'transparent',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<MaterialCommunityIcons name="signal-off" size={28} color="rgba(255,255,255,0.3)" />
				</View>

				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '700', marginTop: 8, textAlign: 'center'}}>
					Signal Status
				</Text>

				<Text style={{color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>Not Available on Web</Text>
			</Pressable>
		);
	}

	const getGpsSignalInfo = (accuracy: number | null): SignalStatus => {
		if (accuracy === null) {
			return {label: 'Searching...', icon: 'satellite-variant', color: 'rgba(255,255,255,0.6)'};
		}
		if (accuracy <= 10) {
			return {label: `±${Math.round(accuracy)}m (Strong)`, icon: 'satellite-uplink', color: '#22c55e'};
		}
		if (accuracy <= 35) {
			return {label: `±${Math.round(accuracy)}m (Moderate)`, icon: 'satellite-uplink', color: '#fbbf24'};
		}
		return {label: `±${Math.round(accuracy)}m (Weak)`, icon: 'signal-off', color: '#ff4d4d'};
	};

	const getCellSignalIcon = (): SignalStatus => {
		if (networkState?.type === NetInfoStateType.cellular) {
			const details = networkState.details as {cellularGeneration?: string; carrier?: string} | null;
			const gen = details?.cellularGeneration;
			const typeLabel = gen ? gen.toUpperCase() : 'CELL';

			return {
				label: typeLabel,
				icon: 'signal-cellular-3',
				color: '#22c55e',
			};
		}

		return {
			label: 'No Cell',
			icon: 'signal-cellular-outline',
			color: '#ff4d4d',
		};
	};

	const gpsInfo = getGpsSignalInfo(gpsAccuracy);
	const cellInfo = getCellSignalIcon();

	return (
		<Link href="/location/signal" asChild>
			<Pressable
				style={{
					...styles.tile,
					padding: 16,
					alignItems: 'center',
					justifyContent: 'space-between',
					flex: 1,
					marginRight: 0,
				}}
			>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%'}}>
					<View style={{alignItems: 'center'}}>
						<MaterialCommunityIcons name={cellInfo.icon} size={28} color={cellInfo.color} />
						<Text style={{color: '#ffffff', fontSize: 12, marginTop: 4, fontWeight: '700'}}>{cellInfo.label}</Text>
					</View>

					<View style={{width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)'}} />

					<View style={{alignItems: 'center'}}>
						<MaterialCommunityIcons name={gpsInfo.icon} size={28} color={gpsInfo.color} />
						<Text style={{color: '#ffffff', fontSize: 12, marginTop: 4, fontWeight: '700'}}>GPS</Text>
					</View>
				</View>

				<View style={{alignItems: 'center', marginTop: 10}}>
					<Text style={{color: '#ffffff', fontSize: 14, fontWeight: '700', textAlign: 'center'}}>Signal Status</Text>

					<Text style={{color: gpsInfo.color, fontSize: 12, marginTop: 2, fontWeight: '600'}}>{gpsInfo.label}</Text>
				</View>
			</Pressable>
		</Link>
	);
}
