import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {baseLayers} from '~/location/Map/baseLayers';
import {setBaseLayer, setMeasuring} from '~/location/state/map/mapSlice';
import {useMap} from '~/location/state/map/useMap';
import {usePermissions} from '~/user/state/subscription';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

const LAYER_TILES = [
	{key: 'standard', label: 'Standard', layer: baseLayers.standard, icon: 'map-outline'},
	{key: 'satellite', label: 'Satellite', layer: baseLayers.satellite, icon: 'satellite-variant'},
	{key: 'terrain', label: 'Terrain', layer: baseLayers.terrain, icon: 'image-filter-hdr'},
] as const;

export function MapSettings() {
	const dispatch = useDispatch();
	const authentication = useAuthentication();
	const permissions = usePermissions();
	const {baseLayer, measuring} = useMap();
	const isLoggedIn = !!authentication?.username;
	const canChangeMapStyle = !!permissions?.navigation.changeMapStyle;
	const bannerHref = isLoggedIn ? `/user/${authentication.username}/change-subscription` : '/user/login';
	const bannerSubtitle = isLoggedIn ? 'Click to find out more' : 'Start by signing in';

	return (
		<>
			<Text style={[styles.label, styles.labelDark]}>Map Style</Text>
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
			<Text style={[styles.label, styles.labelDark]}>Tools</Text>
			<View style={[styles.tileGroup, !canChangeMapStyle && styles.disabledGroup]}>
				<TouchableOpacity
					activeOpacity={0.8}
					accessibilityRole="button"
					accessibilityState={{selected: canChangeMapStyle && measuring, disabled: !canChangeMapStyle}}
					disabled={!canChangeMapStyle}
					onPress={() => dispatch(setMeasuring(!measuring))}
					style={[styles.measureTool, canChangeMapStyle && measuring && styles.segmentButtonActive]}
				>
					<MaterialCommunityIcons name="ruler" size={18} color={measuring ? 'white' : 'rgba(255,255,255,0.72)'} />
					<Text style={[styles.segmentText, measuring && styles.segmentTextActive]}>Measure distance</Text>
				</TouchableOpacity>
			</View>
			{!canChangeMapStyle && (
				<Link href={bannerHref} asChild>
					<TouchableOpacity activeOpacity={0.8}>
						<View style={styles.banner}>
							<Text style={styles.bannerTitle}>Upgrade Required to Access Advanced Map Tools</Text>
							<Text style={styles.bannerSubtitle}>{bannerSubtitle}</Text>
						</View>
					</TouchableOpacity>
				</Link>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	label: {fontSize: 15, fontWeight: '600', color: '#333'},
	labelDark: {color: '#EEE'},
	segmentButtonActive: {backgroundColor: '#0088cc'},
	measureTool: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.1)',
	},
	segmentText: {color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '500'},
	segmentTextActive: {color: 'white', fontWeight: '600'},
	tileGroup: {flexDirection: 'row', gap: 8},
	disabledGroup: {opacity: 0.4, pointerEvents: 'none'},
	tileCard: {
		alignItems: 'center',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
		backgroundColor: 'rgba(255,255,255,0.04)',
		padding: 4,
	},
	tileCardActive: {backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)'},
	tilePreview: {width: 65, height: 65, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', justifyContent: 'center', alignItems: 'center'},
	menuText: {color: 'rgba(255,255,255,0.72)', fontSize: 11, marginTop: 4, marginBottom: 2},
	activeText: {color: 'white', fontWeight: '600'},
	banner: {backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderWidth: 1, borderColor: '#333333', padding: 12, marginTop: 4},
	bannerTitle: {fontSize: 14, fontWeight: '600', color: 'white', marginBottom: 2},
	bannerSubtitle: {fontSize: 13, lineHeight: 18, color: 'rgba(255,255,255,0.78)'},
});
