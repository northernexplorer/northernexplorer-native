import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '~/user/styles';
import { Link } from 'expo-router';

export function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (key: keyof typeof formData, value: string) => {
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

        if (!formData.email) {
            newErrors.email = 'Email is required';
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.description}>
                Enter the email address associated with your account and we'll send you instructions
                to reset your password.
            </Text>
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
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            <Pressable style={styles.button} onPress={validateForm} disabled={isSubmitting}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
            </Pressable>
            <Link href="/profile/login" asChild>
                <Pressable disabled={isSubmitting}>
                    <Text style={styles.link}>Back to Sign In</Text>
                </Pressable>
            </Link>
        </View>
    );
}
