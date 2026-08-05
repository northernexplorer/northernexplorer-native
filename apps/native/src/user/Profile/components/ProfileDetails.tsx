import {View, Text, Pressable} from 'react-native';
import {Link} from 'expo-router';
import React from 'react';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/elements/Spinner';

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
			<ProfileField label="Email Address" value={data.email} />
			<ProfileField label="review score" value={data.score} />
			<ProfileField label="Status" value={data.isActive ? 'Active' : 'Inactive'} />

			<ProfileField label="Registed On" value={new Date(data.createdAt).toLocaleDateString()} />
			<Link href={`/profile/${username}/edit-profile`} asChild>
				<Pressable style={styles.button}>
					<Text style={styles.buttonText}>Edit Profile</Text>
				</Pressable>
			</Link>
		</View>
	);
}
