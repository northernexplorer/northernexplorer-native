import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';

interface Props<T extends string> {
	fieldName: T;
	label: string;
	value?: Date;
	updateField: (name: T, value: Date) => void;
	error?: string;
	loading?: boolean;
}

export function DateField<T extends string>({fieldName, label, value, updateField, error, loading}: Props<T>) {
	const [showPicker, setShowPicker] = useState(false);

	const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
		if (Platform.OS === 'android') {
			setShowPicker(false);
		}
		if (selectedDate) {
			updateField(fieldName, selectedDate);
		}
	};

	const formattedDate = value ? value.toLocaleDateString() : 'Select date';

	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>

			<TouchableOpacity
				style={[styles.inputContainer, loading && styles.disabledInput]}
				onPress={() => !loading && setShowPicker(true)}
				disabled={loading}
				activeOpacity={0.7}
			>
				<Text style={[styles.dateText, !value && styles.placeholderText]}>{formattedDate}</Text>
			</TouchableOpacity>

			{showPicker && (
				<DateTimePicker
					value={value || new Date()}
					mode="date"
					display={Platform.OS === 'ios' ? 'inline' : 'default'}
					onChange={handleChange}
				/>
			)}

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
	inputContainer: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		backgroundColor: '#fefefe',
		paddingHorizontal: 14,
		paddingVertical: 12,
		justifyContent: 'center',
	},
	dateText: {
		fontSize: 16,
		color: '#000',
	},
	placeholderText: {
		color: '#888888',
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
