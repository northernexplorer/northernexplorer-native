import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { styles } from '~/user/styles';
import { Link } from 'expo-router';

const initialFormData = {
    email: '',
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

export function ForgotPassword() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        const trimmedEmail = formData.email.trim();
        if (!trimmedEmail) {
            newErrors.email = 'Email is required';
        } else if (!trimmedEmail.includes('@')) {
            newErrors.email = 'Invalid email address';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Your password reset API call goes here
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.description}>
                Enter the email address associated with your account and we'll send you instructions
                to reset your password.
            </Text>

            {/* Email Field */}
            <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    value={formData.email}
                    onChangeText={(val) => updateField('email', val)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    placeholder="Email Address"
                    style={styles.input}
                    editable={!isSubmitting}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Submit Button */}
            <Pressable
                style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                onPress={validateForm}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                </Text>
            </Pressable>

            {/* Navigation Link */}
            <Link href="/profile/login" asChild>
                <Pressable disabled={isSubmitting}>
                    <Text style={styles.link}>Back to Sign In</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}
