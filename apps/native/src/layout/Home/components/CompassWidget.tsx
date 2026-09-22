import React from 'react';
import {View, Text, Animated, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {styles} from '~/layout/Home/styles';
import {useCompass} from '~/location/hooks/useCompass';

export function CompassWidget() {
	const {heading, cardinal, rotate, isAvailable, needsCalibration} = useCompass();

	if (!isAvailable) {
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
				<MaterialCommunityIcons name="compass-off-outline" size={22} color="rgba(255,255,255,0.3)" />

				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', marginTop: 2, textAlign: 'center'}} numberOfLines={1}>
					N/A
				</Text>
			</Pressable>
		);
	}

	return (
		<Link href="/location/compass" asChild>
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
				{/* Rotating Needle Container */}
				<Animated.View
					style={{
						width: 24,
						height: 24,
						alignItems: 'center',
						justifyContent: 'center',
						transform: [{rotate}],
					}}
				>
					{/* North Needle Point */}
					<View
						style={{
							position: 'absolute',
							top: 0,
							width: 0,
							height: 0,
							borderLeftWidth: 4,
							borderRightWidth: 4,
							borderBottomWidth: 10,
							borderLeftColor: 'transparent',
							borderRightColor: 'transparent',
							borderBottomColor: '#ef4444',
						}}
					/>

					{/* South Needle Point */}
					<View
						style={{
							position: 'absolute',
							bottom: 0,
							width: 0,
							height: 0,
							borderLeftWidth: 4,
							borderRightWidth: 4,
							borderTopWidth: 10,
							borderLeftColor: 'transparent',
							borderRightColor: 'transparent',
							borderTopColor: 'rgba(255, 255, 255, 0.4)',
						}}
					/>

					{/* Center Pin */}
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: '#ffffff',
							zIndex: 5,
						}}
					/>
				</Animated.View>

				{/* Heading & Cardinal Text */}
				<Text
					style={{
						color: '#ffffff',
						fontSize: 10,
						fontWeight: '800',
						marginTop: 2,
						textAlign: 'center',
						letterSpacing: -0.2,
					}}
					numberOfLines={1}
				>
					{heading}° {cardinal}
				</Text>

				{/* Calibration Indicator */}
				{needsCalibration && (
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: '#f59e0b',
							marginTop: 2,
						}}
					/>
				)}
			</Pressable>
		</Link>
	);
}
