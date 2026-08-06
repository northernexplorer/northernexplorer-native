import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Dimensions} from 'react-native';

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

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function DropdownField<T extends string, V>({fieldName, label, value, options, updateField, error, loading}: Props<T, V>) {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownCoords, setDropdownCoords] = useState<{x: number; y: number; width: number}>({x: 0, y: 0, width: 0});
	const inputRef = useRef<View>(null);

	const selectedOption = options.find(opt => opt.value === value);

	const toggleDropdown = () => {
		if (loading) return;

		if (!isOpen && inputRef.current) {
			inputRef.current.measureInWindow((x, y, width, height) => {
				setDropdownCoords({
					x,
					y: y + height,
					width,
				});
				setIsOpen(true);
			});
		} else {
			setIsOpen(false);
		}
	};

	const handleSelect = (val: V) => {
		updateField(fieldName, val);
		setIsOpen(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>

			<View style={styles.fieldWrapper} ref={inputRef}>
				<TouchableOpacity
					style={[styles.input, error ? styles.inputError : null, isOpen && styles.inputOpen, loading && styles.disabled]}
					onPress={toggleDropdown}
					activeOpacity={0.7}
					disabled={loading}
				>
					<Text style={styles.inputText}>{selectedOption ? selectedOption.label : 'Select...'}</Text>
					<Text style={[styles.chevron, isOpen && styles.chevronOpen]}>▾</Text>
				</TouchableOpacity>
			</View>

			<Modal visible={isOpen} transparent animationType="none" onRequestClose={() => setIsOpen(false)}>
				<Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
					<View
						style={[
							styles.dropdownMenu,
							{
								left: dropdownCoords.x,
								top: dropdownCoords.y,
								width: dropdownCoords.width,
								maxHeight: SCREEN_HEIGHT - dropdownCoords.y - 16,
							},
						]}
					>
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
				</Pressable>
			</Modal>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 6,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	dropdownMenu: {
		position: 'absolute',
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
