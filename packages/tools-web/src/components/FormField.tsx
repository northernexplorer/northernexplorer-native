import {Text, TextInput, TouchableOpacity, TextInputProps, View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';

interface Props<T extends string> extends Omit<TextInputProps, 'onChangeText' | 'value'> {
	fieldName: T;
	label?: string;
	placeholder: string;
	updateField: (name: T, value: string) => void;
	error?: string;
	loading?: boolean;
	value?: string;
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
	multiline,
	numberOfLines,
	textAlignVertical,
	style,
	blurOnSubmit,
	submitBehavior,
	...restProps
}: Props<T>) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	return (
		<View style={styles.field}>
			{label ? <Text style={styles.label}>{label}</Text> : null}

			<View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
				<TextInput
					{...restProps}
					style={[styles.input, multiline && styles.multilineInput, loading && styles.disabledInput, style]}
					placeholder={placeholder}
					secureTextEntry={secureTextEntry && !isPasswordVisible}
					value={value}
					onChangeText={val => updateField(fieldName, val)}
					editable={!loading}
					placeholderTextColor="#888888"
					autoComplete={autoComplete}
					textContentType={textContentType}
					importantForAutofill={importantForAutofill}
					multiline={multiline}
					numberOfLines={numberOfLines}
					textAlignVertical={multiline ? (textAlignVertical ?? 'top') : undefined}
					/* Fix for entering paragraph breaks (newlines) */
					blurOnSubmit={multiline ? (blurOnSubmit ?? false) : blurOnSubmit}
					submitBehavior={multiline ? (submitBehavior ?? 'newline') : submitBehavior}
				/>
				{secureTextEntry && !multiline && (
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

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
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
	multilineContainer: {
		alignItems: 'flex-start',
		paddingVertical: 4,
	},
	input: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: '#000',
	},
	multilineInput: {
		minHeight: 100,
		paddingTop: 8,
		paddingBottom: 8,
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
