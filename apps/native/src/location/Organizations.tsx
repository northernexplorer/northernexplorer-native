import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Spinner, Column, Table} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';

export function Organizations() {
	const router = useRouter();
	const authentication = useAuthentication();

	const {data: organizations, loading} = useApiFetch('location', 'OrganizationController', 'getAll', {});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	type OrgItem = NonNullable<typeof organizations>[number];

	const columns: Column<OrgItem>[] = [
		{
			key: 'name',
			title: 'Organization Name',
			flex: 1,
			render: org => (
				<Text style={styles.nameText} numberOfLines={1}>
					{org.name}
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
				data={organizations}
				columns={columns}
				keyExtractor={org => org.id}
				emptyText="No organizations found."
				emptyIcon="business-outline"
				onRowPress={org => router.push(`/admin/edit-organization/${org.id}`)}
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
