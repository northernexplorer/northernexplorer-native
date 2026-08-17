import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, Pressable} from 'react-native';
import {DropdownField} from './DropdownField';

interface Props<T extends string> {
	fieldName: T;
	label: string;
	value?: Date;
	updateField: (name: T, value: Date) => void;
	error?: string;
	loading?: boolean;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DateField<T extends string>({fieldName, label, value, updateField, error, loading}: Props<T>) {
	const [showPicker, setShowPicker] = useState(false);

	const initialDate = value || new Date();
	const [selectedMonth, setSelectedMonth] = useState<number>(initialDate.getMonth());
	const [selectedDay, setSelectedDay] = useState<number>(initialDate.getDate());
	const [selectedYear, setSelectedYear] = useState<number>(initialDate.getFullYear());

	useEffect(() => {
		if (value) {
			setSelectedMonth(value.getMonth());
			setSelectedDay(value.getDate());
			setSelectedYear(value.getFullYear());
		}
	}, [value]);

	const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

	const monthOptions = MONTHS.map((m, idx) => ({label: m, value: idx}));
	const dayOptions = Array.from({length: daysInMonth}, (_, i) => ({
		label: String(i + 1),
		value: i + 1,
	}));

	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({length: 120}, (_, i) => {
		const y = currentYear - i;
		return {label: String(y), value: y};
	});

	const handleConfirm = () => {
		const validDay = Math.min(selectedDay, daysInMonth);
		const normalizedDate = new Date(selectedYear, selectedMonth, validDay, 12, 0, 0);
		updateField(fieldName, normalizedDate);
		setShowPicker(false);
	};

	const formattedDate = value ? value.toLocaleDateString() : 'Select...';

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>

			<View style={styles.fieldWrapper}>
				<TouchableOpacity
					style={[styles.input, error ? styles.inputError : null, showPicker && styles.inputOpen, loading && styles.disabled]}
					onPress={() => !loading && setShowPicker(true)}
					disabled={loading}
					activeOpacity={0.7}
				>
					<Text style={[styles.inputText, !value && styles.placeholderText]} numberOfLines={1}>
						{formattedDate}
					</Text>
					<Text style={[styles.chevron, showPicker && styles.chevronOpen]}>▾</Text>
				</TouchableOpacity>
			</View>

			{/* Centered Modal Overlay */}
			<Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
				<Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
					<Pressable style={styles.centeredCard} onPress={e => e.stopPropagation()}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>{label}</Text>
							<TouchableOpacity style={styles.doneButton} onPress={handleConfirm}>
								<Text style={styles.doneButtonText}>Done</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.pickersRow}>
							<View style={{flex: 2}}>
								<DropdownField
									fieldName="month"
									label="Month"
									value={selectedMonth}
									options={monthOptions}
									updateField={(_, val) => setSelectedMonth(val)}
								/>
							</View>
							<View style={{flex: 1}}>
								<DropdownField
									fieldName="day"
									label="Day"
									value={Math.min(selectedDay, daysInMonth)}
									options={dayOptions}
									updateField={(_, val) => setSelectedDay(val)}
								/>
							</View>
							<View style={{flex: 1.5}}>
								<DropdownField
									fieldName="year"
									label="Year"
									value={selectedYear}
									options={yearOptions}
									updateField={(_, val) => setSelectedYear(val)}
								/>
							</View>
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
	},
	inputText: {
		flex: 1,
		fontSize: 16,
		color: '#333',
		marginRight: 8,
	},
	placeholderText: {
		color: '#888888',
	},
	chevron: {
		fontSize: 14,
		color: '#666',
	},
	chevronOpen: {
		transform: [{rotate: '180deg'}],
		color: '#0088cc',
	},
	disabled: {
		opacity: 0.5,
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 2,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	centeredCard: {
		width: '100%',
		maxWidth: 380,
		backgroundColor: '#FFF',
		borderRadius: 16,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 8},
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 12,
		marginBottom: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#EEE',
	},
	modalTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	pickersRow: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'flex-start',
		paddingVertical: 8,
	},
	doneButton: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		backgroundColor: '#0088cc',
		borderRadius: 6,
	},
	doneButtonText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: 14,
	},
});
