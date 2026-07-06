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
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updatePassword = (key: keyof typeof passwords, value: string) => {
        setPasswords((prev) => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        let newErrors: Record<string, string> = {};

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                {errors.currentPassword && (
                    <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
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
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
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
                {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
            </View>
            <Link href="/profile" asChild>
                <Pressable style={styles.button} onPress={validateForm}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </Pressable>
            </Link>
        </View>
    );
}
