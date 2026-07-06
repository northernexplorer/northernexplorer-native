import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { styles } from '~/user/styles';
import { Link } from 'expo-router';

export function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        acceptPrivacy: false,
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

        if (formData.firstName.length < 2) newErrors.firstName = 'First name is too short';
        if (formData.lastName.length < 2) newErrors.lastName = 'Last name is too short';
        if (formData.userName.length < 6) newErrors.userName = 'Username is too short';
        if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
        if (formData.password.length < 8)
            newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms of service';
        if (!formData.acceptPrivacy) newErrors.acceptPrivacy = 'You must accept the privacy policy';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.field}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    value={formData.firstName}
                    onChangeText={(val) => updateField('firstName', val)}
                    placeholder="First Name"
                    style={styles.input}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    value={formData.lastName}
                    onChangeText={(val) => updateField('lastName', val)}
                    placeholder="Last Name"
                    style={styles.input}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    value={formData.userName}
                    onChangeText={(val) => updateField('userName', val)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Username"
                    style={styles.input}
                />
                {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}
            </View>
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
            <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    value={formData.confirmPassword}
                    onChangeText={(val) => updateField('confirmPassword', val)}
                    secureTextEntry
                    placeholder="Confirm Password"
                    style={styles.input}
                />
                {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
            </View>
            <View style={styles.switchRow}>
                <Text style={styles.label}>
                    I accept the{' '}
                    <Link
                        href="/terms-of-service"
                        style={styles.linkText}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Terms of Service
                    </Link>
                </Text>
                <Switch
                    value={formData.acceptTerms}
                    onValueChange={(val) => updateField('acceptTerms', val)}
                />
            </View>
            {errors.acceptTerms && <Text style={styles.errorText}>{errors.acceptTerms}</Text>}
            <View style={styles.switchRow}>
                <Text style={styles.label}>
                    I accept the{' '}
                    <Link
                        href="/privacy-policy"
                        style={styles.linkText}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Privacy Policy
                    </Link>
                </Text>
                <Switch
                    value={formData.acceptPrivacy}
                    onValueChange={(val) => updateField('acceptPrivacy', val)}
                />
            </View>
            {errors.acceptPrivacy && (
                <Text style={styles.errorText}>{errors.acceptPrivacy}</Text>
            )}
            <Pressable style={styles.button} onPress={validateForm}>
                <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>
            <Link href="/profile/login" asChild>
                <Pressable>
                    <Text style={styles.link}>Already have an account? Sign In</Text>
                </Pressable>
            </Link>
        </View>
    );
}
