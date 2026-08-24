import React, {useState, useEffect} from 'react';
import {View, Text, Platform, Pressable, StyleSheet} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles as globalStyles} from '~/layout/Home/styles';

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
			<View style={[globalStyles.tile, localStyles.container, localStyles.disabledContainer]}>
				<View style={localStyles.disabledIconWrapper}>
					<MaterialCommunityIcons name="flashlight-off" size={26} color="rgba(255, 255, 255, 0.25)" />
				</View>
				<Text style={localStyles.disabledTitle}>Flashlight</Text>
				<Text style={localStyles.disabledSubtitle}>Unavailable</Text>
			</View>
		);
	}

	return (
		<Pressable
			onPress={handleToggle}
			style={({pressed}) => [
				globalStyles.tile,
				localStyles.container,
				torchOn ? localStyles.activeTile : localStyles.inactiveTile,
				pressed && {opacity: 0.8},
			]}
		>
			{permission?.granted && (
				<View style={localStyles.hiddenCamera} pointerEvents="none">
					<CameraView style={{width: 1, height: 1}} enableTorch={torchOn} facing="back" />
				</View>
			)}

			{/* Flat Circle Icon Container */}
			<View style={[localStyles.iconWrapper, torchOn ? localStyles.activeIconWrapper : localStyles.inactiveIconWrapper]}>
				<MaterialCommunityIcons
					name={torchOn ? 'flashlight' : 'flashlight-off'}
					size={26}
					color={torchOn ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'}
				/>
			</View>

			<Text style={[localStyles.title, torchOn && localStyles.activeTitle]}>Flashlight</Text>

			{/* Status Pill Indicator */}
			<View style={[localStyles.statusBadge, torchOn ? localStyles.activeBadge : localStyles.inactiveBadge]}>
				<View style={[localStyles.dot, torchOn ? localStyles.activeDot : localStyles.inactiveDot]} />
				<Text style={[localStyles.statusText, torchOn ? localStyles.activeStatusText : localStyles.inactiveStatusText]}>
					{torchOn ? 'On' : 'Off'}
				</Text>
			</View>
		</Pressable>
	);
}

const localStyles = StyleSheet.create({
	container: {
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		borderRadius: 20,
		marginRight: 0,
	},
	hiddenCamera: {
		position: 'absolute',
		width: 0,
		height: 0,
		overflow: 'hidden',
	},

	// Tile background states
	inactiveTile: {
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.08)',
	},
	activeTile: {
		backgroundColor: 'rgba(250, 204, 21, 0.08)',
		borderWidth: 1,
		borderColor: 'rgba(250, 204, 21, 0.25)',
	},

	// Icon Wrapper (Pure Flat Style)
	iconWrapper: {
		width: 52,
		height: 52,
		borderRadius: 26,
		alignItems: 'center',
		justifyContent: 'center',
	},
	inactiveIconWrapper: {
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.12)',
	},
	activeIconWrapper: {
		backgroundColor: 'rgba(250, 204, 21, 0.22)',
		borderWidth: 0,
	},

	// Typography
	title: {
		color: '#E2E8F0',
		fontSize: 14,
		fontWeight: '700',
		marginTop: 10,
		textAlign: 'center',
	},
	activeTitle: {
		color: '#FFFFFF',
	},

	// Status Badge
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 12,
		marginTop: 4,
	},
	activeBadge: {
		backgroundColor: 'rgba(250, 204, 21, 0.15)',
	},
	inactiveBadge: {
		backgroundColor: 'transparent',
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginRight: 5,
	},
	activeDot: {
		backgroundColor: '#FACC15',
	},
	inactiveDot: {
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
	},
	activeStatusText: {
		color: '#FACC15',
	},
	inactiveStatusText: {
		color: 'rgba(255, 255, 255, 0.4)',
	},

	// Disabled State
	disabledContainer: {
		opacity: 0.4,
		backgroundColor: 'rgba(255, 255, 255, 0.02)',
	},
	disabledIconWrapper: {
		width: 52,
		height: 52,
		borderRadius: 26,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.08)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	disabledTitle: {
		color: 'rgba(255, 255, 255, 0.4)',
		fontSize: 14,
		fontWeight: '700',
		marginTop: 10,
	},
	disabledSubtitle: {
		color: 'rgba(255, 255, 255, 0.25)',
		fontSize: 11,
		marginTop: 2,
		fontWeight: '500',
	},
});
