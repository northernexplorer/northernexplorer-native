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
					<MaterialCommunityIcons name="compass-off-outline" size={28} color="rgba(255,255,255,0.3)" />
				</View>

				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '700', marginTop: 8, textAlign: 'center'}}>Compass</Text>

				<Text style={{color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>Unavailable</Text>
			</Pressable>
		);
	}

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
				<View style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center'}}>
					<View
						style={{
							position: 'absolute',
							top: -2,
							width: 0,
							height: 0,
							borderLeftWidth: 4,
							borderRightWidth: 4,
							borderBottomWidth: 6,
							borderLeftColor: 'transparent',
							borderRightColor: 'transparent',
							borderBottomColor: '#ffffff',
							zIndex: 10,
						}}
					/>

					<View
						style={{
							width: 56,
							height: 56,
							borderRadius: 28,
							borderWidth: 1.5,
							borderColor: 'rgba(255,255,255,0.15)',
							alignItems: 'center',
						}}
					>
						<Animated.View
							style={{
								width: 48,
								height: 48,
								alignItems: 'center',
								justifyContent: 'center',
								transform: [{rotate}],
							}}
						>
							<View
								style={{
									position: 'absolute',
									top: 4,
									width: 0,
									height: 0,
									borderLeftWidth: 6,
									borderRightWidth: 6,
									borderBottomWidth: 18,
									borderLeftColor: 'transparent',
									borderRightColor: 'transparent',
									borderBottomColor: '#ef4444',
								}}
							/>

							<View
								style={{
									position: 'absolute',
									bottom: 4,
									width: 0,
									height: 0,
									borderLeftWidth: 6,
									borderRightWidth: 6,
									borderTopWidth: 18,
									borderLeftColor: 'transparent',
									borderRightColor: 'transparent',
									borderTopColor: 'rgba(255, 255, 255, 0.3)',
								}}
							/>

							<View
								style={{
									width: 6,
									height: 6,
									borderRadius: 3,
									backgroundColor: '#ffffff',
									zIndex: 5,
								}}
							/>
						</Animated.View>
					</View>
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
