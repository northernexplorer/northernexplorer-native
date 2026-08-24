import React, {useState, useEffect} from 'react';
import {View, Text, Platform, Pressable} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from '~/layout/Home/styles';

export function FlashlightWidget() {
	const [torchOn, setTorchOn] = useState<boolean>(false);
	const [isAvailable, setIsAvailable] = useState<boolean>(true);
	const [permission, requestPermission] = useCameraPermissions();

	useEffect(() => {
		if (Platform.OS === 'web') {
			setIsAvailable(false);
			return;
		}
		setIsAvailable(true);
	}, []);

	const handleToggle = async () => {
		if (!permission?.granted) {
			const res = await requestPermission();
			if (!res.granted) return;
		}
		setTorchOn(prev => !prev);
	};

	const isDisabled = !isAvailable || (permission && !permission.granted && permission.canAskAgain === false);

	if (isDisabled) {
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
					<MaterialCommunityIcons name="flashlight-off" size={28} color="rgba(255,255,255,0.3)" />
				</View>

				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', marginTop: 8, textAlign: 'center'}}>Flashlight</Text>

				<Text style={{color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>Unavailable</Text>
			</Pressable>
		);
	}

	return (
		<Pressable
			onPress={handleToggle}
			style={{
				...styles.tile,
				padding: 16,
				alignItems: 'center',
				justifyContent: 'center',
				flex: 1,
				marginRight: 0,
				backgroundColor: torchOn ? 'rgba(250, 204, 21, 0.08)' : styles.tile.backgroundColor,
				borderColor: torchOn ? 'rgba(250, 204, 21, 0.25)' : styles.tile.borderColor,
			}}
		>
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
					borderColor: torchOn ? '#facc15' : 'rgba(255,255,255,0.15)',
					backgroundColor: torchOn ? 'rgba(250, 204, 21, 0.22)' : 'transparent',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<MaterialCommunityIcons name={torchOn ? 'flashlight' : 'flashlight-off'} size={28} color={torchOn ? '#facc15' : '#ffffff'} />
			</View>

			<Text style={{color: '#ffffff', fontSize: 12, fontWeight: '700', marginTop: 8, textAlign: 'center'}}>Flashlight</Text>

			<Text style={{color: torchOn ? '#facc15' : 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '600'}}>
				{torchOn ? 'On' : 'Off'}
			</Text>
		</Pressable>
	);
}
