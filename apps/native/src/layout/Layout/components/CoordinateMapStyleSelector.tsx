import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link} from 'expo-router';
import {useAppDispatch} from '~/core/storeHooks';
import {baseLayers} from '~/location/Map/baseLayers';
import {setBaseLayer} from '~/location/state/map/mapSlice';
import {useMap} from '~/location/state/map/useMap';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {usePermissions} from '~/user/state/subscription';

const MAP_STYLES = [
	{key: 'standard', label: 'Standard', layer: baseLayers.standard},
	{key: 'satellite', label: 'Satellite', layer: baseLayers.satellite},
	{key: 'terrain', label: 'Terrain', layer: baseLayers.terrain},
];

export function CoordinateMapStyleSelector({disabled}: {disabled?: boolean}) {
	const dispatch = useAppDispatch();
	const {baseLayer} = useMap();
	const permissions = usePermissions();
	const authentication = useAuthentication();
	const canChangeMapStyle = !!permissions?.navigation.changeMapStyle;
	const isDisabled = !!disabled || !canChangeMapStyle;
	const bannerHref = authentication?.username ? `/user/${authentication.username}/change-subscription` : '/user/login';

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Map Style</Text>
			<View style={styles.options}>
				{MAP_STYLES.map(item => {
					const isActive = JSON.stringify(baseLayer) === JSON.stringify(item.layer);
					return (
						<TouchableOpacity
							key={item.key}
							accessibilityRole="button"
							accessibilityLabel={`${item.label} map style`}
							accessibilityState={{selected: isActive, disabled: isDisabled}}
							disabled={isDisabled}
							onPress={() => dispatch(setBaseLayer(item.layer))}
							style={[styles.option, isActive && styles.activeOption, isDisabled && styles.disabledOption]}
						>
							<Text style={[styles.optionText, isActive && styles.activeOptionText]}>{item.label}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
			{!canChangeMapStyle && (
				<Link href={bannerHref} asChild>
					<TouchableOpacity>
						<Text style={styles.upgradeText}>Upgrade required to change map style</Text>
					</TouchableOpacity>
				</Link>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 6,
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
		color: '#4B5563',
	},
	options: {
		flexDirection: 'row',
		gap: 8,
	},
	option: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 8,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#D1D5DB',
		backgroundColor: '#FFFFFF',
	},
	activeOption: {
		borderColor: '#0088cc',
		backgroundColor: '#F0F8FF',
	},
	disabledOption: {
		opacity: 0.5,
	},
	optionText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#4B5563',
	},
	activeOptionText: {
		fontWeight: '600',
		color: '#0088cc',
	},
	upgradeText: {
		fontSize: 12,
		color: '#0088cc',
	},
});
