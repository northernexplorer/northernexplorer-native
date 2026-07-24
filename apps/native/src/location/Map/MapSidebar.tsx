import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setBaseLayer} from '~/location/state/map/mapSlice';
import {baseLayers} from '~/location/Map/baseLayers';
import {useMap} from '~/location/state/map/useMap';

// Define the tile visual configuration
const LAYER_TILES = [
	{
		key: 'standard',
		label: 'Standard',
		layer: baseLayers.standard,
		bgStyle: {backgroundColor: '#e5e7eb'},
	},
	{
		key: 'satellite',
		label: 'Satellite',
		layer: baseLayers.satellite,
		bgStyle: {backgroundColor: '#1e293b'},
	},
	{
		key: 'terrain',
		label: 'Terrain',
		layer: baseLayers.terrain,
		bgStyle: {backgroundColor: '#dcfce7'},
	},
] as const;

export function MapSidebar() {
	const dispatch = useDispatch();
	const {baseLayer} = useMap();

	return (
		<View>
			<Text>Map Style</Text>
			<View style={styles.tileGroup}>
				{LAYER_TILES.map(item => {
					const isActive = JSON.stringify(baseLayer) === JSON.stringify(item.layer);

					return (
						<TouchableOpacity
							key={item.key}
							activeOpacity={0.8}
							onPress={() => dispatch(setBaseLayer(item.layer))}
							style={[styles.tileCard, isActive && styles.tileCardActive]}
						>
							<View style={[styles.tilePreview, item.bgStyle]}>
								<Text style={styles.previewText}>{item.key === 'satellite' ? '🛰️' : item.key === 'terrain' ? '🏔️' : '🗺️'}</Text>
							</View>
							<Text style={[styles.tileLabel, isActive && styles.tileLabelActive]}>{item.label}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		fontSize: 11,
		fontWeight: '700',
		textTransform: 'uppercase',
		color: '#64748b',
		marginBottom: 8,
		letterSpacing: 0.5,
	},
	tileGroup: {
		flexDirection: 'row',
		gap: 8,
	},
	tileCard: {
		alignItems: 'center',
		borderRadius: 8,
		borderWidth: 2,
		borderColor: 'transparent',
		padding: 2,
	},
	tileCardActive: {
		borderColor: '#2563eb',
	},
	tilePreview: {
		width: 75,
		height: 75,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center',
	},
	previewText: {
		fontSize: 20,
	},
	tileLabel: {
		fontSize: 11,
		fontWeight: '500',
		color: '#334155',
		marginTop: 4,
	},
	tileLabelActive: {
		fontWeight: '700',
		color: '#2563eb',
	},
});
