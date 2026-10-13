import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Spinner, Column, Table} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';

export function Regions() {
	const router = useRouter();
	const authentication = useAuthentication();

	const {data: regions, loading} = useApiFetch('location', 'RegionController', 'getAll', {});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	type RegionItem = NonNullable<typeof regions>[number];

	const columns: Column<RegionItem>[] = [
		{
			key: 'name',
			title: 'Region Name',
			flex: 2,
			render: region => (
				<Text style={styles.nameText} numberOfLines={1}>
					{region.name}
				</Text>
			),
		},
		{
			key: 'country',
			title: 'Country',
			flex: 2,
			render: region => (
				<Text style={styles.countryText} numberOfLines={1}>
					{region.country?.name || '-'}
				</Text>
			),
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
				data={regions}
				columns={columns}
				keyExtractor={region => region.id}
				emptyText="No regions found."
				emptyIcon="map-outline"
				onRowPress={region => router.push(`/admin/edit-region/${region.id}`)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	nameText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#212529',
	},
	countryText: {
		fontSize: 13,
		color: '#6c757d',
	},
});
