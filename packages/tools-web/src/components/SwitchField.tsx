import React from 'react';
import {StyleSheet, Switch, Text, View, ViewStyle} from 'react-native';

interface Props<T extends string> {
	fieldName: T;
	label?: string;
	description?: string;
	value?: boolean;
	updateField: (name: T, value: boolean) => void;
	error?: string;
	loading?: boolean;
	style?: ViewStyle;
}

export function SwitchField<T extends string>({fieldName, label, description, value = false, updateField, error, loading = false, style}: Props<T>) {
	return (
		<View style={[styles.field, style]}>
			<View style={styles.row}>
				<View style={styles.textContainer}>
					{label ? <Text style={styles.label}>{label}</Text> : null}
					{description ? <Text style={styles.description}>{description}</Text> : null}
				</View>

				<Switch
					value={value}
					onValueChange={val => updateField(fieldName, val)}
					disabled={loading}
					trackColor={{false: 'rgba(255, 255, 255, 0.16)', true: 'rgba(0, 136, 204, 0.35)'}}
					thumbColor={value ? '#0088cc' : '#94a3b8'}
					// @ts-expect-error Prop gets passed through, TS is wrong
					activeThumbColor="#0088cc"
					ios_backgroundColor="rgba(255, 255, 255, 0.16)"
				/>
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	field: {
		gap: 4,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	textContainer: {
		flex: 1,
		gap: 2,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#EEE',
	},
	description: {
		fontSize: 13,
		color: 'rgba(255, 255, 255, 0.6)',
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 2,
	},
});
