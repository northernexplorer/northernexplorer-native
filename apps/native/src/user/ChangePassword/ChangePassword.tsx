import React, { useState } from 'react';
import { View, TextInput, Alert, Pressable, Text } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';

export function ChangePassword() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const updatePassword = (key: keyof typeof passwords, value: string) => {
        setPasswords((prev) => ({ ...prev, [key]: value }));
    };

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        console.log('Updating password...');
    };

    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    secureTextEntry
                    value={passwords.currentPassword}
                    onChangeText={(val) => updatePassword('currentPassword', val)}
                />
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={passwords.newPassword}
                    onChangeText={(val) => updatePassword('newPassword', val)}
                />
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    secureTextEntry
                    value={passwords.confirmPassword}
                    onChangeText={(val) => updatePassword('confirmPassword', val)}
                />
            </View>
            <Link href="/profile" asChild>
                <Pressable style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </Pressable>
            </Link>
        </View>
    );
}
