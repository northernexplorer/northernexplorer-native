import React, {useState, useEffect} from 'react';
import {View, Text, Platform, Pressable, StyleSheet} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from '~/layout/Home/styles';

export function FlashlightWidget() {
	const [torchOn, setTorchOn] = useState<boolean>(false);
	const [isAvailable, setIsAvailable] = useState<boolean>(true);
	const [permission, requestPermission] = useCameraPermissions();

	useEffect(() => {
		// Web browsers cannot toggle hardware torches
		if (Platform.OS === 'web') {
			setIsAvailable(false);
			return;
		}

		// On native iOS and Android, physical hardware is present
		setIsAvailable(true);
	}, []);

	const handleToggle = async () => {
		if (!permission?.granted) {
			const res = await requestPermission();
			if (!res.granted) return;
		}
		setTorchOn(prev => !prev);
	};

	if (!isAvailable || (permission && !permission.granted && permission.canAskAgain === false)) {
		return (
			<Pressable
				style={StyleSheet.flatten([
					styles.tile,
					{
						padding: 16,
						alignItems: 'center',
						justifyContent: 'center',
						flex: 1,
						marginRight: 0,
					},
				])}
			>
				<MaterialCommunityIcons name="flashlight-off" size={48} color="rgba(255,255,255,0.4)" />
				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 8, textAlign: 'center'}}>
					Flashlight Unavailable
				</Text>
			</Pressable>
		);
	}

	return (
		<Pressable
			onPress={handleToggle}
			style={({pressed}) =>
				StyleSheet.flatten([
					styles.tile,
					{
						padding: 16,
						alignItems: 'center',
						justifyContent: 'center',
						flex: 1,
						marginRight: 0,
						opacity: pressed ? 0.8 : 1,
					},
				])
			}
		>
			{/* Zero-size wrapper keeps CameraView mounted without affecting layout */}
			{permission?.granted && (
				<View style={{position: 'absolute', width: 0, height: 0, overflow: 'hidden'}} pointerEvents="none">
					<CameraView style={{width: 1, height: 1}} enableTorch={torchOn} facing="back" />
				</View>
			)}

			<View
				style={{
					width: 56,
					height: 56,
					borderRadius: 28,
					borderWidth: 1.5,
					borderColor: torchOn ? '#f59e0b' : 'rgba(255,255,255,0.15)',
					backgroundColor: torchOn ? '#f59e0b' : 'transparent',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<MaterialCommunityIcons name={torchOn ? 'flashlight' : 'flashlight-off'} size={28} color={torchOn ? '#0f172a' : '#ffffff'} />
			</View>

			<Text style={{color: '#ffffff', fontSize: 14, fontWeight: '700', marginTop: 8, textAlign: 'center'}}>
				Flashlight
			</Text>

			<Text style={{color: torchOn ? '#f59e0b' : 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>
				{torchOn ? 'On' : 'Off'}
			</Text>
		</Pressable>
	);
}