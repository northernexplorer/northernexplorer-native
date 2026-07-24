import {Text, TextInput, TouchableOpacity, TextInputProps, View} from 'react-native';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface Props<T extends string> {
	fieldName: T;
	label: string;
	placeholder: string;
	updateField: (name: T, value: string) => void;
	error?: string;
	loading?: boolean;
	value?: string;
	secureTextEntry?: boolean;
	autoComplete?: TextInputProps['autoComplete'];
	textContentType?: TextInputProps['textContentType'];
	importantForAutofill?: TextInputProps['importantForAutofill'];
}

export function FormField<T extends string>({
	fieldName,
	label,
	updateField,
	placeholder,
	error,
	loading,
	value,
	secureTextEntry = false,
	autoComplete,
	textContentType,
	importantForAutofill = 'yes',
}: Props<T>) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>

			<View style={styles.inputContainer}>
				<TextInput
					style={[styles.input, loading && styles.disabledInput]}
					placeholder={placeholder}
					secureTextEntry={secureTextEntry && !isPasswordVisible}
					value={value}
					onChangeText={val => updateField(fieldName, val)}
					editable={!loading}
					placeholderTextColor="#888888"
					autoComplete={autoComplete}
					textContentType={textContentType}
					importantForAutofill={importantForAutofill}
				/>
				{secureTextEntry && (
					<TouchableOpacity
						onPress={() => setIsPasswordVisible(prev => !prev)}
						style={styles.toggleButton}
						disabled={loading}
						hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
						activeOpacity={0.7}
					>
						<Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888888" />
					</TouchableOpacity>
				)}
			</View>

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
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		backgroundColor: '#fefefe',
		paddingHorizontal: 14,
	},
	input: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: '#000',
	},
	toggleButton: {
		paddingLeft: 8,
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
