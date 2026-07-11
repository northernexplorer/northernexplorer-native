import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '~/user/styles';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';
import React, { useState } from 'react';
import { ProfileDetails } from '~/user/Profile/components/ProfileDetails';
import { Subscription } from '~/user/Profile/components/Subscription';

type RouteParams = {
    username: string;
};

// Define a type for our active tab
type ActiveTab = 'details' | 'subscription';

export function Profile() {
    const authentication = useAuthentication();
    const { username } = useLocalSearchParams<RouteParams>();

    const [activeTab, setActiveTab] = useState<ActiveTab>('details');

    if (!authentication) return <Redirect href="/profile/login" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'details' && styles.activeTabButton]}
                    onPress={() => setActiveTab('details')}
                >
                    <Text style={activeTab === 'details' ? styles.activeTabText : styles.tabText}>
                        Details
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'subscription' && styles.activeTabButton,
                    ]}
                    onPress={() => setActiveTab('subscription')}
                >
                    <Text
                        style={activeTab === 'subscription' ? styles.activeTabText : styles.tabText}
                    >
                        Subscription
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'details' ? (
                <ProfileDetails username={username} />
            ) : (
                <Subscription username={username} />
            )}
        </View>
    );
}
