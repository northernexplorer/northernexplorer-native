import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

interface TextAreaProps<T extends string> {
	fieldName: T;
	label: string;
	placeholder: string;
	updateField: (name: T, value: string) => void;
	value?: string;
	error?: string;
	loading?: boolean;
	numberOfLines?: number;
}

export function TextAreaField<T extends string>({
	fieldName,
	label,
	placeholder,
	updateField,
	value,
	error,
	loading,
	numberOfLines = 4,
}: TextAreaProps<T>) {
	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={[styles.input, loading && styles.disabledInput]}
				placeholder={placeholder}
				value={value}
				onChangeText={val => updateField(fieldName, val)}
				editable={!loading}
				placeholderTextColor="#888888"
				multiline
				numberOfLines={numberOfLines}
				textAlignVertical="top"
			/>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
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
		backgroundColor: '#fefefe',
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
		color: '#000',
		minHeight: 100,
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
