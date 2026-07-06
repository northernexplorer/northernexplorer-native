import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { styles } from '~/user/styles';
import { Link } from 'expo-router';

export function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const validateForm = () => {
        let newErrors: Record<string, string> = {};

        if (!formData.identifier) {
            newErrors.identifier = 'Identifier is required';
        }
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

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
                />
                {errors.identifier && <Text style={styles.errorText}>{errors.identifier}</Text>}
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    value={formData.password}
                    onChangeText={(val) => updateField('password', val)}
                    secureTextEntry
                    placeholder="Password"
                    style={styles.input}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.rememberRow}>
                <Text style={styles.label}>Remember Me</Text>
                <Switch
                    value={formData.rememberMe}
                    onValueChange={(val) => updateField('rememberMe', val)}
                />
            </View>
            <Link href="/profile" asChild>
                <Pressable style={styles.button} onPress={validateForm}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
            </Link>
            <Link href="/profile/forgot-password" asChild>
                <Pressable>
                    <Text style={styles.link}>Forgot Password?</Text>
                </Pressable>
            </Link>
            <Link href="/profile/register" asChild>
                <Pressable>
                    <Text style={styles.link}>Create Account</Text>
                </Pressable>
            </Link>
        </View>
    );
}
