import {View, Text, TouchableOpacity} from 'react-native';
import styles from '~/user/styles';
import {Redirect, useLocalSearchParams} from 'expo-router';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import React, {useState} from 'react';
import {ProfileDetails} from '~/user/Profile/components/ProfileDetails';
import {Subscription} from '~/user/Profile/components/Subscription';
import {Sessions} from '~/user/Profile/components/Sessions';

type RouteParams = {
	username: string;
};

type ActiveTab = 'details' | 'subscription' | 'security';

export function Profile() {
	const authentication = useAuthentication();
	const {username} = useLocalSearchParams<RouteParams>();

	const [activeTab, setActiveTab] = useState<ActiveTab>('details');

	if (!authentication) return <Redirect href="/profile/login" />;

	return (
		<View style={styles.container}>
			<View style={{flexDirection: 'row', marginBottom: 20}}>
				<TouchableOpacity
					style={[styles.tabButton, activeTab === 'details' && styles.activeTabButton]}
					onPress={() => setActiveTab('details')}
				>
					<Text style={activeTab === 'details' ? styles.activeTabText : styles.tabText}>Details</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tabButton, activeTab === 'subscription' && styles.activeTabButton]}
					onPress={() => setActiveTab('subscription')}
				>
					<Text style={activeTab === 'subscription' ? styles.activeTabText : styles.tabText}>Subscription</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tabButton, activeTab === 'security' && styles.activeTabButton]}
					onPress={() => setActiveTab('security')}
				>
					<Text style={activeTab === 'security' ? styles.activeTabText : styles.tabText}>Security</Text>
				</TouchableOpacity>
			</View>

			{activeTab === 'details' && <ProfileDetails username={username} />}
			{activeTab === 'subscription' && <Subscription username={username} />}
			{activeTab === 'security' && <Sessions username={username} />}
		</View>
	);
}
