import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {getUrlSafeString} from '@northernexplorer/tools';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/elements/Spinner';
import {Column, Table} from '~/layout/Layout/elements/Table';

export function PublishedHistoricSites() {
	const router = useRouter();
	const authentication = useAuthentication();
	const {data: sites, loading} = useApiFetch('location', 'HistoricSiteController', 'getPublished', {});

	if (!authentication) return <Redirect href="/profile/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	type SiteItem = NonNullable<typeof sites>[number];
	const columns: Column<SiteItem>[] = [
		{
			key: 'image',
			title: '',
			width: 50,
			render: site =>
				site.image ? (
					<Image source={{uri: site.image}} style={styles.thumbnail} />
				) : (
					<View style={[styles.thumbnail, styles.placeholderThumbnail]}>
						<Ionicons name="image-outline" size={18} color="#9e9e9e" />
					</View>
				),
		},
		{
			key: 'name',
			title: 'Name',
			flex: 3,
			render: site => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.siteName} numberOfLines={1}>
						{site.name}
					</Text>
					<Text style={styles.siteDescription} numberOfLines={1}>
						{site.description || 'No description available'}
					</Text>
				</View>
			),
		},
		{
			key: 'region',
			title: 'Region / Country',
			flex: 2,
			render: site => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.cellText} numberOfLines={1}>
						{site.region.name}
					</Text>
					<Text style={styles.cellSubtext} numberOfLines={1}>
						{site.country.name}
					</Text>
				</View>
			),
		},
		{
			key: 'coords',
			title: 'Coordinates',
			flex: 2,
			render: site => <Text style={styles.coordsText}>{`${site.lat.toFixed(4)}, ${site.lon.toFixed(4)}`}</Text>,
		},
		{
			key: 'action',
			width: 30,
			align: 'right',
			render: () => <Ionicons name="chevron-forward" size={18} color="#adb5bd" />,
		},
	];

	return (
		<Table
			data={sites}
			columns={columns}
			keyExtractor={site => site.id}
			emptyText="No published historic sites found."
			emptyIcon="map-outline"
			onRowPress={site =>
				router.push(`/${getUrlSafeString(site.country.name)}/${getUrlSafeString(site.region.name)}/${getUrlSafeString(site.name)}/${site.id}`)
			}
		/>
	);
}

const styles = StyleSheet.create({
	thumbnail: {width: 38, height: 38, borderRadius: 8},
	placeholderThumbnail: {backgroundColor: '#e9ecef', alignItems: 'center', justifyContent: 'center'},
	siteName: {fontSize: 14, fontWeight: '600', color: '#212529'},
	siteDescription: {fontSize: 12, color: '#6c757d', marginTop: 2},
	cellText: {fontSize: 13, fontWeight: '500', color: '#343a40'},
	cellSubtext: {fontSize: 11, color: '#868e96', marginTop: 1},
	coordsText: {fontSize: 12, fontFamily: 'monospace', color: '#495057'},
});
