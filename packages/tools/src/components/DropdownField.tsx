import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Dimensions, ScrollView} from 'react-native';

interface Option<V> {
	label: string;
	value: V;
}

interface BaseProps<T extends string, V> {
	fieldName: T;
	label: string;
	options: Option<V>[];
	error?: string;
	loading?: boolean;
}

interface SingleProps<T extends string, V> extends BaseProps<T, V> {
	isMultiSelect?: false;
	value: V;
	updateField: (name: T, value: V) => void;
}

interface MultiProps<T extends string, V> extends BaseProps<T, V> {
	isMultiSelect: true;
	value: V[];
	updateField: (name: T, value: V[]) => void;
}

type Props<T extends string, V> = SingleProps<T, V> | MultiProps<T, V>;

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function DropdownField<T extends string, V>(props: Props<T, V>) {
	const {fieldName, label, options, error, loading, isMultiSelect} = props;
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownCoords, setDropdownCoords] = useState<{x: number; y: number; width: number}>({x: 0, y: 0, width: 0});
	const inputRef = useRef<View>(null);

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

	const isSelected = (itemValue: V): boolean => {
		if (isMultiSelect) {
			return props.value.includes(itemValue);
		}
		return props.value === itemValue;
	};

	const handleSelect = (itemValue: V) => {
		if (isMultiSelect) {
			const currentValues = props.value;
			const nextValues = currentValues.includes(itemValue) ? currentValues.filter(val => val !== itemValue) : [...currentValues, itemValue];
			props.updateField(fieldName, nextValues);
		} else {
			props.updateField(fieldName, itemValue);
			setIsOpen(false);
		}
	};

	const getDisplayText = (): string => {
		if (isMultiSelect) {
			const selectedLabels = options.filter(opt => props.value.includes(opt.value)).map(opt => opt.label);
			if (selectedLabels.length === 0) return 'Select...';
			return selectedLabels.join(', ');
		}

		const selectedOption = options.find(opt => opt.value === props.value);
		return selectedOption ? selectedOption.label : 'Select...';
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
					<Text style={styles.inputText} numberOfLines={1}>
						{getDisplayText()}
					</Text>
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
						<ScrollView bounces={false} nestedScrollEnabled>
							{options.map((item, index) => {
								const selected = isSelected(item.value);
								const isLast = index === options.length - 1;
								return (
									<TouchableOpacity
										key={String(item.value)}
										style={[styles.optionRow, selected && styles.optionRowSelected, isLast && styles.optionRowLast]}
										onPress={() => handleSelect(item.value)}
										activeOpacity={0.7}
									>
										<Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item.label}</Text>
										{isMultiSelect ? <Text style={styles.checkbox}>{selected ? '☑' : '☐'}</Text> : null}
									</TouchableOpacity>
								);
							})}
						</ScrollView>
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
		flex: 1,
		fontSize: 16,
		color: '#333',
		marginRight: 8,
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
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
	checkbox: {
		fontSize: 16,
		color: '#0088cc',
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 2,
	},
});
