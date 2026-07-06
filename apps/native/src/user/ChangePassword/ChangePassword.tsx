import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';

export function ChangePassword() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (key: keyof typeof formData, value: string | boolean) => {
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
        let newErrors: Record<string, string> = {};

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
        setIsSubmitting(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    secureTextEntry
                    value={formData.currentPassword}
                    onChangeText={(val) => updateField('currentPassword', val)}
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
                    value={formData.newPassword}
                    onChangeText={(val) => updateField('newPassword', val)}
                />
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(val) => updateField('confirmPassword', val)}
                />
                {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
            </View>
            <Pressable style={styles.button} onPress={validateForm} disabled={isSubmitting}>
                <Text style={styles.buttonText}>Change Password</Text>
            </Pressable>
            <Link href="/profile" asChild>
                <Pressable style={styles.secondaryButton} disabled={isSubmitting}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
            </Link>
        </View>
    );
}
