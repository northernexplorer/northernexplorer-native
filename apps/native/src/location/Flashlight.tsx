import React, {useState, useEffect} from 'react';
import {View, Text, Platform, StyleSheet, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ProFeatureOnly, Spinner} from '@northernexplorer/tools';
import {useApiFetch} from '~/core/useApiFetch';

export function Flashlight() {
	const [torchOn, setTorchOn] = useState<boolean>(false);
	const [isAvailable, setIsAvailable] = useState<boolean>(true);
	const [permission, requestPermission] = useCameraPermissions();

	const {data: permissionData, loading} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});

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

	const handleToggle = async () => {
		if (!permission?.granted) {
			const res = await requestPermission();
			if (!res.granted) return;
		}
		setTorchOn(prev => !prev);
	};

	const canUseFlashlight = !!permissionData?.navigation.useCompass; // Uses same navigation subscription guard

	if (loading) return <Spinner />;
	if (!canUseFlashlight) return <ProFeatureOnly />;

	if (!isAvailable || (permission && !permission.granted && permission.canAskAgain === false)) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<MaterialCommunityIcons name="flashlight-off" size={72} color="#94a3b8" />
					<Text style={styles.unavailableTitle}>Flashlight Unavailable</Text>
					<Text style={styles.unavailableSubtext}>Camera flash hardware is unavailable or permissions were not granted.</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.centerContainer}>
				{/* Hidden CameraView driving torch hardware */}
				{permission?.granted && <CameraView style={styles.hiddenCamera} enableTorch={torchOn} facing="back" />}

				{/* Flashlight Housing */}
				<View style={styles.flashlightContainer}>
					<View style={styles.outerRing}>
						<Pressable
							onPress={handleToggle}
							style={({pressed}) => [styles.buttonContainer, torchOn && styles.buttonContainerOn, pressed && styles.pressed]}
						>
							<MaterialCommunityIcons
								name={torchOn ? 'flashlight' : 'flashlight-off'}
								size={72}
								color={torchOn ? '#0f172a' : '#64748b'}
							/>
						</Pressable>
					</View>
				</View>

				{/* State Readout */}
				<Text style={styles.stateReadout}>
					Flashlight <Text style={[styles.stateText, torchOn && styles.stateTextOn]}>{torchOn ? 'ON' : 'OFF'}</Text>
				</Text>

				{/* Status Section */}
				<View style={styles.statusSection}>
					<View style={styles.statusBadge}>
						<View style={[styles.activeDot, torchOn && styles.activeDotOn]} />
						<Text style={styles.statusText}>{torchOn ? 'Torch Active' : 'Torch Standby'}</Text>
					</View>
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
	hiddenCamera: {
		width: 0,
		height: 0,
		position: 'absolute',
	},
	flashlightContainer: {
		width: 260,
		height: 260,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
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
	buttonContainer: {
		width: 180,
		height: 180,
		borderRadius: 90,
		borderWidth: 2,
		borderColor: 'rgba(15, 23, 42, 0.12)',
		backgroundColor: 'rgba(15, 23, 42, 0.04)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonContainerOn: {
		backgroundColor: '#f59e0b',
		borderColor: '#f59e0b',
	},
	pressed: {
		opacity: 0.85,
	},
	stateReadout: {
		color: '#0f172a',
		fontSize: 42,
		fontWeight: '800',
		letterSpacing: -1,
		textAlign: 'center',
		marginTop: 8,
	},
	stateText: {
		color: '#64748b',
		fontWeight: '600',
	},
	stateTextOn: {
		color: '#f59e0b',
		fontWeight: '800',
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
		backgroundColor: '#64748b',
	},
	activeDotOn: {
		backgroundColor: '#f59e0b',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#cbd5e1',
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
