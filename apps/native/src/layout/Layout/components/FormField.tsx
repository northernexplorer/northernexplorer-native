import {Text, TextInput, View} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';

interface Props<T extends string> {
	fieldName: T;
	label: string;
	placeholder: string;
	updateField: (name: T, value: string) => void;
	error?: string;
	loading?: boolean;
	value?: string;
	secureTextEntry?: boolean;
}

export function FormField<T extends string>({fieldName, label, updateField, placeholder, error, loading, value, secureTextEntry = false}: Props<T>) {
	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={[styles.input, loading && styles.disabledInput]}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				value={value}
				onChangeText={val => updateField(fieldName, val)}
				editable={!loading}
			/>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
}

export const styles = StyleSheet.create({
	field: {
		gap: 6,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#333',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
		color: '#000',
	},
	disabledInput: {
		opacity: 0.5,
		backgroundColor: '#f5f5f5',
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 2,
	},
});
