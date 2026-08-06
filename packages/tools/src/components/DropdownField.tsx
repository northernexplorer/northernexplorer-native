import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface Option<T> {
	label: string;
	value: T;
}

interface Props<T extends string, V> {
	fieldName: T;
	label: string;
	value: V;
	options: Option<V>[];
	updateField: (name: T, value: V) => void;
	error?: string;
	loading?: boolean;
}

export function DropdownField<T extends string, V>({fieldName, label, value, options, updateField, error, loading}: Props<T, V>) {
	const [isOpen, setIsOpen] = useState(false);

	const selectedOption = options.find(opt => opt.value === value);

	const handleSelect = (val: V) => {
		updateField(fieldName, val);
		setIsOpen(false);
	};

	return (
		<View style={[styles.container, isOpen && styles.containerActive]}>
			<Text style={styles.label}>{label}</Text>

			<View style={styles.fieldWrapper}>
				<TouchableOpacity
					style={[styles.input, error ? styles.inputError : null, isOpen && styles.inputOpen, loading && styles.disabled]}
					onPress={() => !loading && setIsOpen(!isOpen)}
					activeOpacity={0.7}
					disabled={loading}
				>
					<Text style={styles.inputText}>{selectedOption ? selectedOption.label : 'Select...'}</Text>
					<Text style={[styles.chevron, isOpen && styles.chevronOpen]}>▾</Text>
				</TouchableOpacity>

				{isOpen && (
					<View style={styles.dropdownMenu}>
						{options.map((item, index) => {
							const isSelected = item.value === value;
							const isLast = index === options.length - 1;
							return (
								<TouchableOpacity
									key={String(item.value)}
									style={[styles.optionRow, isSelected && styles.optionRowSelected, isLast && styles.optionRowLast]}
									onPress={() => handleSelect(item.value)}
									activeOpacity={0.7}
								>
									<Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{item.label}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				)}
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 6,
		zIndex: 1,
	},
	containerActive: {
		zIndex: 1000,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#333',
	},
	fieldWrapper: {
		position: 'relative',
	},
	input: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 48,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: '#CCC',
		borderRadius: 8,
		backgroundColor: '#FFF',
	},
	inputError: {
		borderColor: '#FF3B30',
	},
	inputOpen: {
		borderColor: '#0088cc',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	inputText: {
		fontSize: 16,
		color: '#333',
	},
	chevron: {
		fontSize: 14,
		color: '#666',
	},
	chevronOpen: {
		transform: [{rotate: '180deg'}],
	},
	disabled: {
		opacity: 0.5,
	},
	dropdownMenu: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: '#FFF',
		borderWidth: 1,
		borderTopWidth: 0,
		borderColor: '#0088cc',
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 5,
	},
	optionRow: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#EEE',
	},
	optionRowSelected: {
		backgroundColor: '#F0F8FF',
	},
	optionRowLast: {
		borderBottomWidth: 0,
		borderBottomLeftRadius: 7,
		borderBottomRightRadius: 7,
	},
	optionText: {
		fontSize: 15,
		color: '#333',
	},
	optionTextSelected: {
		fontWeight: '600',
		color: '#0088cc',
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 2,
	},
});
