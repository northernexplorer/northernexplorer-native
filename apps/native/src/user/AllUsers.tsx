import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {RolesEnum} from '@northernexplorer/types';
import {Spinner} from '@northernexplorer/tools';
import {Column, Table} from '@northernexplorer/tools';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';

export function AllUsers() {
	const router = useRouter();
	const authentication = useAuthentication();
	const {data: users, loading} = useApiFetch('user', 'UserController', 'getAll', {});

	if (!authentication) return <Redirect href="/profile/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	type UserItem = NonNullable<typeof users>[number];

	const columns: Column<UserItem>[] = [
		{
			key: 'name',
			title: 'User',
			flex: 3,
			render: user => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.userName} numberOfLines={1}>
						{user.firstName} {user.lastName}
					</Text>
					<Text style={styles.userEmail} numberOfLines={1}>
						{user.email}
					</Text>
				</View>
			),
		},
		{
			key: 'role',
			title: 'Role',
			flex: 2,
			render: user => (
				<View style={styles.roleBadge}>
					<Text style={styles.roleText}>{user.roles?.join(', ') || ''}</Text>
				</View>
			),
		},
		{
			key: 'status',
			title: 'Status',
			flex: 2,
			render: user => (
				<Text style={user.isActive !== false ? styles.activeText : styles.inactiveText}>
					{user.isActive !== false ? 'Active' : 'Inactive'}
				</Text>
			),
		},
		{
			key: 'registered',
			title: 'Registered At',
			flex: 2,
			render: user => <Text style={styles.roleText}>{new Date(user.createdAt).toLocaleDateString()}</Text>,
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
			data={users}
			columns={columns}
			keyExtractor={user => user.id}
			emptyText="No users found."
			emptyIcon="people-outline"
			onRowPress={user => router.push(`/profile/${user.username}`)}
		/>
	);
}

const styles = StyleSheet.create({
	userName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#212529',
	},
	userEmail: {
		fontSize: 12,
		color: '#6c757d',
		marginTop: 2,
	},
	roleBadge: {
		alignSelf: 'flex-start',
		backgroundColor: '#eef2f6',
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	roleText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#495057',
		textTransform: 'capitalize',
	},
	activeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#2b8a3e',
	},
	inactiveText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#c92a2a',
	},
});
