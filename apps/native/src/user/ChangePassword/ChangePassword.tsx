import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, ScrollView } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';
import { useApiMutation } from '~/core/useApiMutation';

const initialFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

export function ChangePassword() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});

    const { mutate, loading } = useApiMutation('user', 'UserController', 'changePassword');

    const updateField = (key: FormKeys, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const validateForm = async () => {
        const newErrors: Partial<Record<FormKeys, string>> = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'New password must be at least 8 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'New passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            // Your password update API logic goes here
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Change Password</Text>

            {/* Current Password */}
            <View style={styles.field}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    secureTextEntry
                    value={formData.currentPassword}
                    onChangeText={(val) => updateField('currentPassword', val)}
                    editable={!loading}
                />
                {errors.currentPassword && (
                    <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
            </View>

            {/* New Password */}
            <View style={styles.field}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={formData.newPassword}
                    onChangeText={(val) => updateField('newPassword', val)}
                    editable={!loading}
                />
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
            </View>

            {/* Confirm New Password */}
            <View style={styles.field}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(val) => updateField('confirmPassword', val)}
                    editable={!loading}
                />
                {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
            </View>

            {/* Submit Action Button */}
            <Pressable
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={validateForm}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Updating Password...' : 'Change Password'}
                </Text>
            </Pressable>

            {/* Cancel Action Link */}
            <Link href="/profile" asChild>
                <Pressable style={styles.secondaryButton} disabled={loading}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}
