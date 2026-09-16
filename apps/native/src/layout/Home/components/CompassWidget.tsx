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
					<MaterialCommunityIcons name="compass-off-outline" size={18} color="rgba(255,255,255,0.3)" />
				</View>

				<Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', marginTop: 4, textAlign: 'center'}} numberOfLines={1}>
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
				<View style={{width: 38, height: 38, alignItems: 'center', justifyContent: 'center'}}>
					{/* Fixed Top North Indicator Marker */}
					<View
						style={{
							position: 'absolute',
							top: -1,
							width: 0,
							height: 0,
							borderLeftWidth: 3,
							borderRightWidth: 3,
							borderBottomWidth: 4,
							borderLeftColor: 'transparent',
							borderRightColor: 'transparent',
							borderBottomColor: '#38BDF8',
							zIndex: 10,
						}}
					/>

					{/* Outer Dial Circle */}
					<View
						style={{
							width: 36,
							height: 36,
							borderRadius: 18,
							borderWidth: 1,
							borderColor: 'rgba(255,255,255,0.15)',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{/* Rotating Needle Container */}
						<Animated.View
							style={{
								width: 30,
								height: 30,
								alignItems: 'center',
								justifyContent: 'center',
								transform: [{rotate}],
							}}
						>
							{/* North Needle Point */}
							<View
								style={{
									position: 'absolute',
									top: 2,
									width: 0,
									height: 0,
									borderLeftWidth: 4,
									borderRightWidth: 4,
									borderBottomWidth: 11,
									borderLeftColor: 'transparent',
									borderRightColor: 'transparent',
									borderBottomColor: '#ef4444',
								}}
							/>

							{/* South Needle Point */}
							<View
								style={{
									position: 'absolute',
									bottom: 2,
									width: 0,
									height: 0,
									borderLeftWidth: 4,
									borderRightWidth: 4,
									borderTopWidth: 11,
									borderLeftColor: 'transparent',
									borderRightColor: 'transparent',
									borderTopColor: 'rgba(255, 255, 255, 0.3)',
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
					</View>
				</View>

				{/* Heading & Cardinal Text */}
				<Text
					style={{
						color: '#ffffff',
						fontSize: 10,
						fontWeight: '800',
						marginTop: 4,
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
