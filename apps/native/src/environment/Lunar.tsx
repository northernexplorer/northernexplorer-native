import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {Spinner} from '~/layout/Layout/components/Spinner';
import {getMoonIcon} from '~/environment/lib/getMoonIcon';

export function Lunar() {
	const lunar = useLunar();

	if (!lunar) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<Spinner />
				</View>
			</SafeAreaView>
		);
	}

	const icon = getMoonIcon(lunar);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.centerContainer}>
				{/* Expanded Moon Icon */}
				<View style={styles.iconWrapper}>
					<MaterialCommunityIcons name={icon} size={180} color="#0f172a" />
				</View>

				{/* Primary Phase Title */}
				<Text style={styles.phaseName}>{lunar.phase_name}</Text>

				{/* Main Illumination Readout */}
				<Text style={styles.illuminationText}>
					{Math.round(lunar.illumination_percentage)}% <Text style={styles.illuminationLabel}>Illuminated</Text>
				</Text>
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
	iconWrapper: {
		width: 220,
		height: 220,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 24,
	},
	phaseName: {
		color: '#0f172a',
		fontSize: 32,
		fontWeight: '800',
		textAlign: 'center',
		letterSpacing: -0.5,
	},
	illuminationText: {
		color: '#0284c7',
		fontSize: 24,
		fontWeight: '700',
		marginTop: 8,
		textAlign: 'center',
	},
	illuminationLabel: {
		color: '#64748b',
		fontSize: 18,
		fontWeight: '500',
	},
});
