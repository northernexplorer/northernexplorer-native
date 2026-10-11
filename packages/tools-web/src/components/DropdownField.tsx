import React, {useState, useRef, useMemo} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable, Dimensions, ScrollView} from 'react-native';

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
	disabled?: boolean;
	darkMode?: boolean;
	isSearchable?: boolean;
	searchPlaceholder?: string;
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
	const {fieldName, label, options, error, loading, disabled, isMultiSelect, darkMode = false, isSearchable = false, searchPlaceholder} = props;
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [dropdownCoords, setDropdownCoords] = useState<{x: number; y: number; width: number; height: number}>({
		x: 0,
		y: 0,
		width: 0,
		height: 48,
	});
	const inputRef = useRef<View>(null);
	const modalInputRef = useRef<TextInput>(null);

	const toggleDropdown = () => {
		if (loading || disabled) return;

		if (!isOpen && inputRef.current) {
			inputRef.current.measureInWindow((x, y, width, height) => {
				setDropdownCoords({
					x,
					y,
					width,
					height,
				});
				setSearchQuery('');
				setIsOpen(true);
			});
		} else {
			closeDropdown();
		}
	};

	const closeDropdown = () => {
		setSearchQuery('');
		setIsOpen(false);
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
			closeDropdown();
		}
	};

	const filteredOptions = useMemo(() => {
		if (!isSearchable || !searchQuery.trim()) {
			return options;
		}
		const query = searchQuery.toLowerCase().trim();
		return options.filter(opt => opt.label.toLowerCase().includes(query));
	}, [options, isSearchable, searchQuery]);

	const getDisplayText = (): string => {
		if (isMultiSelect) {
			const selectedLabels = options.filter(opt => props.value.includes(opt.value)).map(opt => opt.label);
			if (selectedLabels.length === 0) return 'Select...';
			return selectedLabels.join(', ');
		}

		const selectedOption = options.find(opt => opt.value === props.value);
		return selectedOption ? selectedOption.label : 'Select...';
	};

	const selectedOption = !isMultiSelect ? options.find(opt => opt.value === props.value) : undefined;
	const selectedLabel = selectedOption ? selectedOption.label : '';
	const placeholderText = searchPlaceholder || (selectedLabel ? selectedLabel : 'Select...');

	return (
		<View style={styles.container}>
			<Text style={[styles.label, darkMode && styles.labelDark]}>{label}</Text>

			<View style={styles.fieldWrapper} ref={inputRef}>
				<TouchableOpacity
					style={[styles.input, darkMode && styles.inputDark, error ? styles.inputError : null, (loading || disabled) && styles.disabled]}
					onPress={toggleDropdown}
					activeOpacity={0.7}
					disabled={loading || disabled}
				>
					<Text
						style={[styles.inputText, darkMode && styles.inputTextDark, !selectedLabel && !isMultiSelect && styles.placeholderText]}
						numberOfLines={1}
					>
						{getDisplayText()}
					</Text>
					<Text style={[styles.chevron, darkMode && styles.chevronDark]}>▾</Text>
				</TouchableOpacity>
			</View>

			<Modal visible={isOpen} transparent animationType="none" onRequestClose={closeDropdown}>
				<Pressable style={styles.modalOverlay} onPress={closeDropdown}>
					<Pressable
						onPress={e => e.stopPropagation()}
						style={[
							styles.dropdownContainer,
							{
								left: dropdownCoords.x,
								top: dropdownCoords.y,
								width: dropdownCoords.width,
							},
						]}
					>
						<View
							style={[
								styles.input,
								styles.inputOpen,
								darkMode && styles.inputDark,
								darkMode && styles.inputOpenDark,
								error ? styles.inputError : null,
							]}
						>
							{isSearchable ? (
								<TextInput
									ref={modalInputRef}
									style={[styles.inputText, darkMode && styles.inputTextDark]}
									placeholder={placeholderText}
									placeholderTextColor={darkMode ? 'rgba(255, 255, 255, 0.4)' : '#999'}
									value={searchQuery}
									onChangeText={setSearchQuery}
									autoFocus={true}
									autoCapitalize="none"
									autoCorrect={false}
								/>
							) : (
								<Text style={[styles.inputText, darkMode && styles.inputTextDark]} numberOfLines={1}>
									{getDisplayText()}
								</Text>
							)}
							<TouchableOpacity onPress={closeDropdown} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
								<Text style={[styles.chevron, darkMode && styles.chevronDark, styles.chevronOpen]}>▾</Text>
							</TouchableOpacity>
						</View>

						<View
							style={[
								styles.dropdownMenu,
								darkMode && styles.dropdownMenuDark,
								{
									maxHeight: Math.max(120, SCREEN_HEIGHT - dropdownCoords.y - dropdownCoords.height - 16),
								},
							]}
						>
							<ScrollView bounces={false} nestedScrollEnabled keyboardShouldPersistTaps="handled">
								{filteredOptions.length === 0 ? (
									<View style={styles.noResultsContainer}>
										<Text style={[styles.noResultsText, darkMode && styles.noResultsTextDark]}>No results found</Text>
									</View>
								) : (
									filteredOptions.map((item, index) => {
										const selected = isSelected(item.value);
										const isLast = index === filteredOptions.length - 1;
										return (
											<TouchableOpacity
												key={String(item.value)}
												style={[
													styles.optionRow,
													darkMode && styles.optionRowDark,
													selected && styles.optionRowSelected,
													selected && darkMode && styles.optionRowSelectedDark,
													isLast && styles.optionRowLast,
												]}
												onPress={() => handleSelect(item.value)}
												activeOpacity={0.7}
											>
												<Text
													style={[
														styles.optionText,
														darkMode && styles.optionTextDark,
														selected && styles.optionTextSelected,
													]}
												>
													{item.label}
												</Text>
												{isMultiSelect ? <Text style={styles.checkbox}>{selected ? '☑' : '☐'}</Text> : null}
											</TouchableOpacity>
										);
									})
								)}
							</ScrollView>
						</View>
					</Pressable>
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
	labelDark: {
		color: '#EEE',
	},
	fieldWrapper: {
		position: 'relative',
	},
	input: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#CCC',
		borderRadius: 8,
		backgroundColor: '#FFF',
		paddingHorizontal: 14,
	},

	inputText: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: '#000',
	},
	inputDark: {
		backgroundColor: 'rgba(255, 255, 255, 0.06)',
		borderColor: 'rgba(255, 255, 255, 0.16)',
	},
	inputError: {
		borderColor: '#FF3B30',
	},
	inputOpen: {
		borderColor: '#0088cc',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	inputOpenDark: {
		borderColor: '#33aaff',
	},
	inputTextDark: {
		color: '#FFF',
	},
	chevron: {
		fontSize: 14,
		color: '#666',
	},
	chevronDark: {
		color: 'rgba(255, 255, 255, 0.7)',
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
	dropdownContainer: {
		position: 'absolute',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 5,
	},
	dropdownMenu: {
		backgroundColor: '#FFF',
		borderWidth: 1,
		borderTopWidth: 0,
		borderColor: '#0088cc',
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		fontFamily: 'System',
	},
	dropdownMenuDark: {
		backgroundColor: '#1E1E1E',
		borderColor: '#33aaff',
		shadowColor: '#000',
		shadowOpacity: 0.4,
	},
	placeholderText: {
		color: '#888',
	},
	noResultsContainer: {
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	noResultsText: {
		fontSize: 14,
		color: '#888',
	},
	noResultsTextDark: {
		color: '#AAA',
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
	optionRowDark: {
		borderBottomColor: 'rgba(255, 255, 255, 0.1)',
	},
	optionRowSelected: {
		backgroundColor: '#F0F8FF',
	},
	optionRowSelectedDark: {
		backgroundColor: 'rgba(0, 136, 204, 0.25)',
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
	optionTextDark: {
		color: '#DDD',
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
