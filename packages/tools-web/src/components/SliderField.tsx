import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';

type SliderFieldProps = {
	label: string;
	minimumValue: number;
	maximumValue: number;
	step: number;
	value: number;
	onValueChange: (value: number) => void;
	getDisplayLabel?: (value: number) => string;
};

export function SliderField({label, minimumValue, maximumValue, step, value, onValueChange, getDisplayLabel}: SliderFieldProps) {
	const displayVal = getDisplayLabel ? getDisplayLabel(value) : String(value);

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.label}>{label}</Text>
				<Text style={styles.valueText}>{displayVal}</Text>
			</View>
			<Slider
				style={styles.slider}
				minimumValue={minimumValue}
				maximumValue={maximumValue}
				step={step}
				value={value}
				onValueChange={onValueChange}
				minimumTrackTintColor="#0088cc"
				thumbTintColor="#0088cc"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 4,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 2,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#EEE',
	},
	valueText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#0088cc',
	},
	slider: {
		width: '100%',
		height: 36,
	},
});
