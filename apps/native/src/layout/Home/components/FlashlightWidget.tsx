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
					padding: 6,
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '100%',
					opacity: 0.5,
				}}
			>
				<MaterialCommunityIcons name="flashlight-off" size={22} color="rgba(255,255,255,0.3)" />

				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', marginTop: 2, textAlign: 'center'}} numberOfLines={1}>
					N/A
				</Text>
			</Pressable>
		);
	}

	return (
		<Pressable
			onPress={handleToggle}
			style={{
				...styles.tile,
				padding: 6,
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				backgroundColor: torchOn ? 'rgba(250, 204, 21, 0.08)' : styles.tile.backgroundColor,
				borderColor: torchOn ? 'rgba(250, 204, 21, 0.25)' : styles.tile.borderColor,
			}}
		>
			{permission?.granted && (
				<View style={{position: 'absolute', width: 0, height: 0, overflow: 'hidden'}} pointerEvents="none">
					<CameraView style={{width: 1, height: 1}} enableTorch={torchOn} facing="back" />
				</View>
			)}

			<MaterialCommunityIcons name={torchOn ? 'flashlight' : 'flashlight-off'} size={22} color={torchOn ? '#facc15' : '#ffffff'} />

			<Text
				style={{color: torchOn ? '#facc15' : '#ffffff', fontSize: 10, fontWeight: '800', marginTop: 2, textAlign: 'center'}}
				numberOfLines={1}
			>
				{torchOn ? 'ON' : 'OFF'}
			</Text>
		</Pressable>
	);
}
