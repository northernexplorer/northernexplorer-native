import {View, Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/components/Spinner';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiMutation} from '~/core/useApiMutation';

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
	const auth = useAuthentication();
	const {data, loading, refetch} = useApiFetch('user', 'SessionController', 'getSessions', {
		username,
		refreshToken: auth?.refreshToken || '',
	});
	const {mutate} = useApiMutation('user', 'SessionController', 'removeSession');

	if (loading || !data) return <Spinner />;

	const handleSubmit = async (sessionId: number) => {
		const response = await mutate({sessionId});
		if (response) {
			refetch();
		}
	};

	return (
		<View style={styles.container}>
			{data.map(session => (
				<View
					key={session.id}
					style={[
						styles.field,
						{
							flexDirection: 'row',
							alignItems: 'center',
							paddingVertical: 10,
							backgroundColor: session.active ? '#F0FFF4' : 'transparent',
							borderColor: session.active ? '#48BB78' : '#E2E8F0',
							borderWidth: 1,
							borderRadius: 8,
							marginBottom: 8,
						},
					]}
				>
					<View style={{width: 40, alignItems: 'center', marginRight: 10}}>
						<Ionicons name={getIconForOS(session.osName)} size={22} color={session.active ? '#48BB78' : '#4A4A4A'} />
						<Ionicons
							name={getIconForClient(session.clientName)}
							size={22}
							color={session.active ? '#48BB78' : '#4A4A4A'}
							style={{marginTop: -4}}
						/>
					</View>

					<View style={{flex: 1}}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Text style={[styles.label, {fontWeight: '600'}]}>
								{session.osName} • {session.clientName}
							</Text>
							{/* Active Badge */}
							{session.active && (
								<View style={{marginLeft: 8, backgroundColor: '#48BB78', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4}}>
									<Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>ACTIVE</Text>
								</View>
							)}
						</View>

						<Text style={[styles.value, {fontSize: 14}]}>
							{new Date(session.firstLoginAt).toLocaleDateString()} to {new Date(session.lastLoginAt).toLocaleDateString()}
						</Text>
						<Text style={{fontSize: 12, color: '#A0A0A0', marginTop: 2}}>{session.ipAddress}</Text>
					</View>
					{!session.active && (
						<TouchableOpacity onPress={() => handleSubmit(session.id)} style={{padding: 10}}>
							<Ionicons name="trash-outline" size={20} color="#E53E3E" />
						</TouchableOpacity>
					)}
				</View>
			))}
		</View>
	);
}
