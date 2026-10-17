import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Spinner, Column, Table} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';

export function Countries() {
	const router = useRouter();
	const authentication = useAuthentication();

	const {data: countries, loading} = useApiFetch('location', 'CountryController', 'getAll', {});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

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
				data={countries}
				columns={columns}
				keyExtractor={country => country.id}
				emptyText="No countries found."
				emptyIcon="globe-outline"
				onRowPress={country => router.push(`/admin/edit-country/${country.id}`)}
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
});
