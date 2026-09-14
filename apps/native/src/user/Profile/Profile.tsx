import {View, Text, TouchableOpacity} from 'react-native';
import {Redirect, useLocalSearchParams, useRouter} from 'expo-router';
import React from 'react';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {ProfileDetails} from '~/user/Profile/components/ProfileDetails';
import {ProfileTimeline} from '~/user/Profile/components/ProfileTimeline';
import {Subscription} from '~/user/Profile/components/Subscription';
import {Security} from '~/user/Profile/components/Security';
import {Other} from '~/user/Profile/components/Other';

type RouteParams = {
	username: string;
	tab?: 'timeline' | 'details' | 'subscription' | 'security' | 'other';
};

export function Profile() {
	const authentication = useAuthentication();
	const router = useRouter();
	const {username, tab = 'timeline'} = useLocalSearchParams<RouteParams>();

	if (!authentication) return <Redirect href="/profile/login" />;

	const switchTab = (newTab: 'timeline' | 'details' | 'subscription' | 'security' | 'other') => {
		router.setParams({username, tab: newTab});
	};

	return (
		<View style={styles.container}>
			<View style={{flexDirection: 'row', marginBottom: 20}}>
				<TouchableOpacity style={[styles.tabButton, tab === 'timeline' && styles.activeTabButton]} onPress={() => switchTab('timeline')}>
					<Text style={tab === 'timeline' ? styles.activeTabText : styles.tabText}>Timeline</Text>
				</TouchableOpacity>

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

				<TouchableOpacity style={[styles.tabButton, tab === 'other' && styles.activeTabButton]} onPress={() => switchTab('other')}>
					<Text style={tab === 'other' ? styles.activeTabText : styles.tabText}>Other</Text>
				</TouchableOpacity>
			</View>

			{tab === 'timeline' && <ProfileTimeline username={username} />}
			{tab === 'details' && <ProfileDetails username={username} />}
			{tab === 'subscription' && <Subscription username={username} />}
			{tab === 'security' && <Security username={username} />}
			{tab === 'other' && <Other username={username} />}
		</View>
	);
}
