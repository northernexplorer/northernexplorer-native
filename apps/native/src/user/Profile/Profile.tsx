import {Spinner} from '@northernexplorer/tools-web';

export type AvatarDetails = {
	subscriptionLevelName: string;
	firstName: string;
	username: string;
};

import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React from 'react';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {ProfileDetails} from '~/user/Profile/components/ProfileDetails';
import {ProfileTimeline} from '~/user/Profile/components/ProfileTimeline';
import {Subscription} from '~/user/Profile/components/Subscription';
import {Security} from '~/user/Profile/components/Security';
import {Other} from '~/user/Profile/components/Other';
import {useApiFetch} from '~/core/useApiFetch';
import {UserAvatar} from '~/layout/Layout/components/UserAvatar';

type RouteParams = {
	username: string;
	tab?: 'timeline' | 'details' | 'subscription' | 'security' | 'other';
};

export function Profile() {
	const authentication = useAuthentication();
	const router = useRouter();
	const {username, tab = 'timeline'} = useLocalSearchParams<RouteParams>();
	const {data, loading} = useApiFetch('user', 'UserController', 'getAvatarDetails', {username});

	const avatarData = data as AvatarDetails | undefined;

	const switchTab = (newTab: 'timeline' | 'details' | 'subscription' | 'security' | 'other') => {
		router.setParams({username, tab: newTab});
	};

	if (loading) return <Spinner />;

	return (
		<View style={styles.container}>
			{/* Profile Header */}
			<View style={headerStyles.headerContainer}>
				<View style={headerStyles.avatarWrapper}>
					<UserAvatar username={username} size={72} />
				</View>

				<View style={headerStyles.infoContainer}>
					<View style={headerStyles.nameRow}>
						<Text style={headerStyles.displayName}>{avatarData?.firstName || username}</Text>
						{avatarData?.subscriptionLevelName && (
							<View style={headerStyles.badge}>
								<Text style={headerStyles.badgeText}>{avatarData.subscriptionLevelName}</Text>
							</View>
						)}
					</View>

					<Text style={headerStyles.handleText}>@{username}</Text>
				</View>
			</View>

			{/* Navigation Tabs */}
			{authentication?.username === username && (
				<View style={styles.tabBarContainer}>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
						<TouchableOpacity
							style={[styles.tabButton, tab === 'timeline' && styles.activeTabButton]}
							onPress={() => switchTab('timeline')}
						>
							<Text style={tab === 'timeline' ? styles.activeTabText : styles.tabText}>Timeline</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.tabButton, tab === 'details' && styles.activeTabButton]}
							onPress={() => switchTab('details')}
						>
							<Text style={tab === 'details' ? styles.activeTabText : styles.tabText}>Details</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.tabButton, tab === 'subscription' && styles.activeTabButton]}
							onPress={() => switchTab('subscription')}
						>
							<Text style={tab === 'subscription' ? styles.activeTabText : styles.tabText}>Subscription</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.tabButton, tab === 'security' && styles.activeTabButton]}
							onPress={() => switchTab('security')}
						>
							<Text style={tab === 'security' ? styles.activeTabText : styles.tabText}>Security</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.tabButton, tab === 'other' && styles.activeTabButton]} onPress={() => switchTab('other')}>
							<Text style={tab === 'other' ? styles.activeTabText : styles.tabText}>Other</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			)}

			{tab === 'timeline' && <ProfileTimeline username={username} />}
			{tab === 'details' && <ProfileDetails username={username} />}
			{tab === 'subscription' && <Subscription username={username} />}
			{tab === 'security' && <Security username={username} />}
			{tab === 'other' && <Other username={username} />}
		</View>
	);
}

const headerStyles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	avatarWrapper: {
		borderRadius: 40,
	},
	infoContainer: {
		flex: 1,
		justifyContent: 'center',
		gap: 2,
	},
	nameRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		flexWrap: 'wrap',
	},
	displayName: {
		fontSize: 22,
		fontWeight: '700',
		color: '#0f172a',
	},
	handleText: {
		fontSize: 14,
		color: '#64748b',
		fontWeight: '500',
	},
	badge: {
		backgroundColor: '#e0f2fe',
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 12,
	},
	badgeText: {
		color: '#0284c7',
		fontSize: 12,
		fontWeight: '600',
	},
});
