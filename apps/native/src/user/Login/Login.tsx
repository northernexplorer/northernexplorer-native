import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch, ScrollView } from 'react-native';
import { styles } from '~/user/styles';
import { Link } from 'expo-router';

const initialFormData = {
    identifier: '',
    password: '',
    rememberMe: false,
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

export function Login() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (key: FormKeys, value: string | boolean) => {
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

        if (!formData.identifier.trim()) {
            newErrors.identifier = 'Username or email is required';
        }
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Your login logic / API call goes here
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Sign In</Text>

            {/* Username or Email Field */}
            <View style={styles.field}>
                <Text style={styles.label}>Username or Email</Text>
                <TextInput
                    value={formData.identifier}
                    onChangeText={(val) => updateField('identifier', val)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    placeholder="Username or Email"
                    style={styles.input}
                    editable={!isSubmitting}
                />
                {errors.identifier && <Text style={styles.errorText}>{errors.identifier}</Text>}
            </View>

            {/* Password Field */}
            <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    value={formData.password}
                    onChangeText={(val) => updateField('password', val)}
                    secureTextEntry
                    placeholder="Password"
                    style={styles.input}
                    editable={!isSubmitting}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Remember Me Switch Row */}
            <View style={styles.rememberRow}>
                <Text style={styles.label}>Remember Me</Text>
                <Switch
                    value={formData.rememberMe}
                    onValueChange={(val) => updateField('rememberMe', val)}
                    disabled={isSubmitting}
                />
            </View>

            {/* Submit Button */}
            <Pressable
                style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                onPress={validateForm}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>{isSubmitting ? 'Signing In...' : 'Sign In'}</Text>
            </Pressable>

            {/* Navigation Links */}
            <Link href="/profile/forgot-password" asChild>
                <Pressable disabled={isSubmitting}>
                    <Text style={styles.link}>Forgot Password?</Text>
                </Pressable>
            </Link>

            <Link href="/profile/register" asChild>
                <Pressable disabled={isSubmitting}>
                    <Text style={styles.link}>Create Account</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}
