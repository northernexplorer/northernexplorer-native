import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {setBaseLayer} from '~/location/state/map/mapSlice';
import {baseLayers} from '~/location/Map/baseLayers';
import {useMap} from '~/location/state/map/useMap';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

const LAYER_TILES = [
	{
		key: 'standard',
		label: 'Standard',
		layer: baseLayers.standard,
		icon: 'map-outline',
	},
	{
		key: 'satellite',
		label: 'Satellite',
		layer: baseLayers.satellite,
		icon: 'satellite-variant',
	},
	{
		key: 'terrain',
		label: 'Terrain',
		layer: baseLayers.terrain,
		icon: 'image-filter-hdr',
	},
] as const;

export function MapSidebar() {
	const dispatch = useDispatch();
	const authentication = useAuthentication();
	const {baseLayer} = useMap();

	const isLoggedIn = !!authentication?.username;

	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {username: authentication?.username});

	const canChangeMapStyle = !!permissionData?.navigation.changeMapStyle;

	const bannerHref = isLoggedIn ? `/profile/${authentication.username}/change-subscription` : '/profile/login';

	const bannerTitle = 'Upgrade Required to Access All Map Styles';

	const bannerSubtitle = isLoggedIn ? 'Click to find out more' : 'Start by signing in';

	if (!data) return null;

	return (
		<View>
			{!canChangeMapStyle && (
				<Link href={bannerHref} asChild>
					<TouchableOpacity activeOpacity={0.8}>
						<View style={styles.banner}>
							<Text style={styles.bannerTitle}>{bannerTitle}</Text>
							<Text style={styles.bannerSubtitle}>{bannerSubtitle}</Text>
						</View>
					</TouchableOpacity>
				</Link>
			)}

			<Text style={styles.heading}>Map Style</Text>
			<View style={[styles.tileGroup, !canChangeMapStyle && styles.disabledGroup]}>
				{LAYER_TILES.map(item => {
					const isActive = JSON.stringify(baseLayer) === JSON.stringify(item.layer);

					return (
						<TouchableOpacity
							key={item.key}
							activeOpacity={0.8}
							disabled={!canChangeMapStyle}
							onPress={() => dispatch(setBaseLayer(item.layer))}
							style={[styles.tileCard, isActive && styles.tileCardActive]}
						>
							<View style={styles.tilePreview}>
								<MaterialCommunityIcons name={item.icon} size={28} color={isActive ? 'white' : 'rgba(255,255,255,0.72)'} />
							</View>
							<Text style={[styles.menuText, isActive && styles.activeText]}>{item.label}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	heading: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		marginTop: 16,
		marginBottom: 8,
	},
	tileGroup: {
		flexDirection: 'row',
		gap: 8,
	},
	disabledGroup: {
		opacity: 0.4,
		pointerEvents: 'none',
	},
	tileCard: {
		alignItems: 'center',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
		backgroundColor: 'rgba(255,255,255,0.04)',
		padding: 4,
	},
	tileCardActive: {
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderColor: 'rgba(255,255,255,0.2)',
	},
	tilePreview: {
		width: 65,
		height: 65,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.04)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	menuText: {
		color: 'rgba(255,255,255,0.72)',
		fontSize: 11,
		marginTop: 4,
		marginBottom: 2,
	},
	activeText: {
		color: 'white',
		fontWeight: '600',
	},
	banner: {
		backgroundColor: 'rgba(255,255,255,0.04)',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#333333',
		padding: 12,
		marginBottom: 12,
	},
	bannerTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: 'white',
		marginBottom: 2,
	},
	bannerSubtitle: {
		fontSize: 13,
		lineHeight: 18,
		color: 'rgba(255,255,255,0.78)',
	},
});
