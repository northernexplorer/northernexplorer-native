import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FormField} from './FormField';

export interface CoordinateMapProps {
	lat?: number | null;
	lon?: number | null;
	onSelectCoordinates: (lat: number, lon: number) => void;
	disabled?: boolean;
}

export interface CoordinateFieldProps<TLat extends string = string, TLon extends string = string> {
	latFieldName?: TLat;
	lonFieldName?: TLon;
	latValue?: string | number;
	lonValue?: string | number;
	updateField?: (name: TLat | TLon, value: string) => void;
	onCoordinatesChange?: (coords: {lat: string; lon: string}) => void;
	latLabel?: string;
	lonLabel?: string;
	latPlaceholder?: string;
	lonPlaceholder?: string;
	latError?: string;
	lonError?: string;
	loading?: boolean;
	disabled?: boolean;
	initialMode?: 'manual' | 'map';
	renderMap?: (props: CoordinateMapProps) => React.ReactNode;
	mapComponent?: React.ComponentType<CoordinateMapProps>;
}

export function CoordinateField<TLat extends string = string, TLon extends string = string>({
	latFieldName = 'lat' as TLat,
	lonFieldName = 'lon' as TLon,
	latValue = '',
	lonValue = '',
	updateField,
	onCoordinatesChange,
	latLabel = 'Latitude',
	lonLabel = 'Longitude',
	latPlaceholder = 'e.g. 54.1234',
	lonPlaceholder = 'e.g. -94.5678',
	latError,
	lonError,
	loading = false,
	disabled = false,
	initialMode = 'manual',
	renderMap,
	mapComponent: MapComponent,
}: CoordinateFieldProps<TLat, TLon>) {
	const [mode, setMode] = useState<'manual' | 'map'>(initialMode);

	const latString = String(latValue);
	const lonString = String(lonValue);

	const parsedLat = parseFloat(latString);
	const parsedLon = parseFloat(lonString);

	const numericLat = !isNaN(parsedLat) ? parsedLat : null;
	const numericLon = !isNaN(parsedLon) ? parsedLon : null;

	const handleCoordinatesSelected = (lat: number, lon: number) => {
		const formattedLat = Number(lat.toFixed(6)).toString();
		const formattedLon = Number(lon.toFixed(6)).toString();

		if (updateField) {
			updateField(latFieldName, formattedLat);
			updateField(lonFieldName, formattedLon);
		}

		if (onCoordinatesChange) {
			onCoordinatesChange({lat: formattedLat, lon: formattedLon});
		}
	};

	const showMapToggle = Boolean(renderMap || MapComponent);

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.sectionLabel}>Coordinates</Text>
				{showMapToggle ? (
					<View style={styles.toggleContainer}>
						<TouchableOpacity
							style={[styles.toggleButton, mode === 'manual' && styles.toggleButtonActive]}
							onPress={() => setMode('manual')}
							activeOpacity={0.7}
						>
							<Ionicons name="create-outline" size={14} color={mode === 'manual' ? '#FFFFFF' : '#4B5563'} />
							<Text style={[styles.toggleText, mode === 'manual' && styles.toggleTextActive]}>Text Input</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.toggleButton, mode === 'map' && styles.toggleButtonActive]}
							onPress={() => setMode('map')}
							activeOpacity={0.7}
						>
							<Ionicons name="map-outline" size={14} color={mode === 'map' ? '#FFFFFF' : '#4B5563'} />
							<Text style={[styles.toggleText, mode === 'map' && styles.toggleTextActive]}>Select on Map</Text>
						</TouchableOpacity>
					</View>
				) : null}
			</View>

			{mode === 'manual' || !showMapToggle ? (
				<View style={styles.inputsRow}>
					<View style={styles.halfWidth}>
						<FormField
							fieldName={latFieldName}
							label={latLabel}
							placeholder={latPlaceholder}
							value={latString}
							updateField={updateField ? (name, val) => updateField(name, val) : () => {}}
							error={latError}
							loading={loading || disabled}
						/>
					</View>
					<View style={styles.halfWidth}>
						<FormField
							fieldName={lonFieldName}
							label={lonLabel}
							placeholder={lonPlaceholder}
							value={lonString}
							updateField={updateField ? (name, val) => updateField(name, val) : () => {}}
							error={lonError}
							loading={loading || disabled}
						/>
					</View>
				</View>
			) : (
				<View style={styles.mapSection}>
					{renderMap ? (
						renderMap({
							lat: numericLat,
							lon: numericLon,
							onSelectCoordinates: handleCoordinatesSelected,
							disabled: loading || disabled,
						})
					) : MapComponent ? (
						<MapComponent
							lat={numericLat}
							lon={numericLon}
							onSelectCoordinates={handleCoordinatesSelected}
							disabled={loading || disabled}
						/>
					) : null}
					{latError || lonError ? (
						<View style={styles.errorContainer}>
							{latError ? <Text style={styles.errorText}>Latitude: {latError}</Text> : null}
							{lonError ? <Text style={styles.errorText}>Longitude: {lonError}</Text> : null}
						</View>
					) : null}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		gap: 8,
		marginBottom: 4,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		gap: 8,
	},
	sectionLabel: {
		fontSize: 15,
		fontWeight: '600',
		color: '#333333',
	},
	toggleContainer: {
		flexDirection: 'row',
		backgroundColor: '#F3F4F6',
		borderRadius: 8,
		padding: 3,
		gap: 4,
	},
	toggleButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 6,
	},
	toggleButtonActive: {
		backgroundColor: '#2563EB',
	},
	toggleText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#4B5563',
	},
	toggleTextActive: {
		color: '#FFFFFF',
	},
	inputsRow: {
		flexDirection: 'row',
		gap: 12,
	},
	halfWidth: {
		flex: 1,
	},
	mapSection: {
		width: '100%',
		gap: 6,
	},
	errorContainer: {
		marginTop: 2,
		gap: 2,
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
	},
});
