import {View, Text, TouchableOpacity} from 'react-native';
import {Redirect, useLocalSearchParams, useRouter} from 'expo-router';
import React from 'react';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {ProfileDetails} from '~/user/Profile/components/ProfileDetails';
import {Subscription} from '~/user/Profile/components/Subscription';
import {Sessions} from '~/user/Profile/components/Sessions';

type RouteParams = {
	username: string;
	tab?: 'details' | 'subscription' | 'security';
};

export function Profile() {
	const authentication = useAuthentication();
	const router = useRouter();
	const {username, tab = 'details'} = useLocalSearchParams<RouteParams>();

	if (!authentication) return <Redirect href="/profile/login" />;

	const switchTab = (newTab: 'details' | 'subscription' | 'security') => {
		router.setParams({username, tab: newTab});
	};

	return (
		<View style={styles.container}>
			<View style={{flexDirection: 'row', marginBottom: 20}}>
				<TouchableOpacity style={[styles.tabButton, tab === 'details' && styles.activeTabButton]} onPress={() => switchTab('details')}>
					<Text style={tab === 'details' ? styles.activeTabText : styles.tabText}>Details</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tabButton, tab === 'subscription' && styles.activeTabButton]}
					onPress={() => switchTab('subscription')}
				>
					<Text style={tab === 'subscription' ? styles.activeTabText : styles.tabText}>Subscription</Text>
				</TouchableOpacity>

				<TouchableOpacity style={[styles.tabButton, tab === 'security' && styles.activeTabButton]} onPress={() => switchTab('security')}>
					<Text style={tab === 'security' ? styles.activeTabText : styles.tabText}>Security</Text>
				</TouchableOpacity>
			</View>

			{tab === 'details' && <ProfileDetails username={username} />}
			{tab === 'subscription' && <Subscription username={username} />}
			{tab === 'security' && <Sessions username={username} />}
		</View>
	);
}
