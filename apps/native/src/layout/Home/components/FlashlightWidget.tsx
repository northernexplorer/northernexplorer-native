import React, {useState, useEffect} from 'react';
import {View, Text, Platform, Pressable, StyleSheet} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {styles} from '~/layout/Home/styles';

export function FlashlightWidget() {
	const [isAvailable, setIsAvailable] = useState<boolean>(true);
	const [permission] = useCameraPermissions();

	useEffect(() => {
		const checkHardware = async () => {
			if (Platform.OS === 'web') {
				setIsAvailable(false);
				return;
			}

			if (CameraView.isAvailableAsync) {
				const available = await CameraView.isAvailableAsync();
				setIsAvailable(available);
			}
		};

		checkHardware();
	}, []);

	if (!isAvailable || (permission && !permission.granted && permission.canAskAgain === false)) {
		return (
			<Link href="/location/flashlight" asChild>
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
					<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 8, textAlign: 'center'}}>Flashlight Unavailable</Text>
				</Pressable>
			</Link>
		);
	}

	return (
		<Link href="/location/flashlight" asChild>
			<Pressable
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
				<View style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center'}}>
					<View
						style={{
							width: 56,
							height: 56,
							borderRadius: 28,
							borderWidth: 1.5,
							borderColor: 'rgba(255,255,255,0.15)',
							backgroundColor: 'transparent',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<MaterialCommunityIcons name="flashlight" size={28} color="#ffffff" />
					</View>
				</View>

				<Text style={{color: '#ffffff', fontSize: 14, fontWeight: '700', marginTop: 8, textAlign: 'center'}}>Open</Text>

				<Text style={{color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>Flashlight</Text>
			</Pressable>
		</Link>
	);
}
