import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Redirect, useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Spinner, Column, Table, Pagination} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';

const limit = 20;

export function Countries() {
	const router = useRouter();
	const params = useLocalSearchParams<{page?: string}>();
	const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
	const authentication = useAuthentication();

	const {data: countries, loading} = useApiFetch('location', 'CountryController', 'getAll', {});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	const pageCountries = countries?.slice((page - 1) * limit, page * limit);
	type CountryItem = NonNullable<typeof countries>[number];

	const columns: Column<CountryItem>[] = [
		{
			key: 'name',
			title: 'Country Name',
			flex: 1,
			render: country => (
				<Text style={styles.nameText} numberOfLines={1}>
					{country.name}
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
				data={pageCountries}
				columns={columns}
				keyExtractor={country => country.id}
				emptyText="No countries found."
				emptyIcon="globe-outline"
				onRowPress={country => router.push(`/admin/edit-country/${country.id}`)}
			/>
			<Pagination limit={limit} itemCount={pageCountries?.length || 0} totalCount={countries?.length} />
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
});
