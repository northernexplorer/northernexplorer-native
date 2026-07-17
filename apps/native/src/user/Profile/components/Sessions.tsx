import {View, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';
import React from 'react';
import {Spinner} from '~/layout/Layout/components/Spinner';

type Props = {
	username: string;
};

const getIconForOS = (os: string) => {
	const name = os.toLowerCase();
	if (name.includes('ios')) return 'logo-apple';
	if (name.includes('android')) return 'logo-android';
	if (name.includes('windows')) return 'logo-windows';
	return 'desktop-outline';
};

const getIconForClient = (client: string) => {
	const name = client.toLowerCase();
	if (name.includes('chrome')) return 'logo-chrome';
	if (name.includes('firefox')) return 'logo-firefox';
	if (name.includes('safari')) return 'compass-outline';
	return 'globe-outline';
};

export function Sessions({username}: Props) {
	const {data, loading} = useApiFetch('user', 'SessionController', 'getSessions', {
		username,
	});

	if (loading || !data) return <Spinner />;

	return (
		<View style={styles.container}>
			{data.map(session => (
				<View key={session.id} style={[styles.field, {flexDirection: 'row', alignItems: 'center', paddingVertical: 10}]}>
					<View style={{width: 40, alignItems: 'center', marginRight: 10}}>
						<Ionicons name={getIconForOS(session.osName)} size={22} color="#4A4A4A" />
						<Ionicons name={getIconForClient(session.clientName)} size={22} color="#4A4A4A" style={{marginTop: -4}} />
					</View>

					<View style={{flex: 1}}>
						<Text style={[styles.label, {fontWeight: '600'}]}>
							{session.osName} • {session.clientName}
						</Text>

						<Text style={[styles.value, {fontSize: 14}]}>
							{new Date(session.firstLoginAt).toLocaleDateString()} to {new Date(session.lastLoginAt).toLocaleDateString()}
						</Text>
						<Text style={{fontSize: 12, color: '#A0A0A0', marginTop: 2}}>{session.ipAddress}</Text>
					</View>
				</View>
			))}
		</View>
	);
}
