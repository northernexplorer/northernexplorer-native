import {View, Text, Pressable} from 'react-native';
import {Link} from 'expo-router';
import React from 'react';
import {formatDate, Spinner} from '@northernexplorer/tools';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';

type Props = {
	username: string;
};

export function ProfileDetails({username}: Props) {
	const {data, loading} = useApiFetch('user', 'UserController', 'getByUsername', {
		username,
	});
	if (loading || !data) return <Spinner />;

	const ProfileField = ({label, value}: {label: string; value: string | number}) => (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<Text style={styles.value}>{value}</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<ProfileField label="First Name" value={data.firstName} />
			<ProfileField label="Last Name" value={data.lastName} />
			<ProfileField label="Username" value={data.username} />
			<ProfileField label="Gender" value={data.gender} />
			<ProfileField label="Birthday" value={formatDate(data.birthday)} />
			<ProfileField label="Email Address" value={data.email} />
			<ProfileField label="Score" value={data.score} />
			<ProfileField label="Status" value={data.isActive ? 'Active' : 'Inactive'} />

			<ProfileField label="Registered On" value={formatDate(data.createdAt)} />
			<Link href={`/profile/${username}/edit-profile`} asChild>
				<Pressable style={styles.button}>
					<Text style={styles.buttonText}>Edit Profile</Text>
				</Pressable>
			</Link>
		</View>
	);
}
