import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {MapSettings} from '~/location/components/MapSettings';
import {FilterSettings} from '~/location/components/FilterSettings';
import {AdminSettings} from '~/location/components/AdminSettings';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

export function MapSidebar() {
	const authentication = useAuthentication();
	const isLoggedIn = !!authentication?.username;

	return (
		<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
			<MapSettings />
			<FilterSettings map />
			<View style={styles.section}>
				<Link href={isLoggedIn ? '/admin/add-point-of-interest' : '/user/login'} asChild>
					<TouchableOpacity style={styles.suggestPoiButton} activeOpacity={0.8}>
						<MaterialCommunityIcons name="map-marker-plus" size={18} color="#ffffff" />
						<Text style={styles.suggestPoiButtonText}>Suggest Point of Interest</Text>
					</TouchableOpacity>
				</Link>
			</View>
			<AdminSettings description="Include unpublished sites on the map" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
		paddingBottom: 24,
	},
	section: {
		marginTop: 4,
	},
	suggestPoiButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#0088cc',
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginTop: 6,
	},
	suggestPoiButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
	},
});
