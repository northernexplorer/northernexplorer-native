import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Redirect, useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {getUrlSafeString, Spinner, Column, Table, ImageView, Pagination, getImageUrl} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {config} from '~/config';

const limit = 20;

export function DraftPointOfInterests() {
	const router = useRouter();
	const authentication = useAuthentication();
	const params = useLocalSearchParams<{page?: string}>();
	const page = params.page ? parseInt(params.page, 10) : 1;

	const offset = (page - 1) * limit;

	const {data: sites, loading} = useApiFetch('location', 'PointOfInterestController', 'getDrafts', {
		limit,
		offset,
	});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	type SiteItem = NonNullable<typeof sites>[number];
	const columns: Column<SiteItem>[] = [
		{
			key: 'image',
			title: '',
			width: 50,
			render: site => (
				<ImageView
					source={{
						uri: getImageUrl({
							path: site.image.url,
							size: 'thumbnail',
							cdn: config.CONTENT_DELIVERY_NETWORK,
							processed: site.image.processed,
						}),
					}}
					style={styles.thumbnail}
				/>
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
		<View style={styles.container}>
			<Table
				data={sites}
				columns={columns}
				keyExtractor={site => site.id}
				emptyText="No draft historic sites found."
				emptyIcon="map-outline"
				onRowPress={site =>
					router.push(
						`/${getUrlSafeString(site.country.name)}/${getUrlSafeString(site.region.name)}/${getUrlSafeString(site.name)}/${site.id}`,
					)
				}
			/>
			<Pagination limit={limit} itemCount={sites?.length || 0} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1},
	thumbnail: {width: 38, height: 38, borderRadius: 8},
	placeholderThumbnail: {backgroundColor: '#e9ecef', alignItems: 'center', justifyContent: 'center'},
	siteName: {fontSize: 14, fontWeight: '600', color: '#212529'},
	siteDescription: {fontSize: 12, color: '#6c757d', marginTop: 2},
	cellText: {fontSize: 13, fontWeight: '500', color: '#343a40'},
	cellSubtext: {fontSize: 11, color: '#868e96', marginTop: 1},
	coordsText: {fontSize: 12, fontFamily: 'monospace', color: '#495057'},
});
