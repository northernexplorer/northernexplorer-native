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

    const updateField = (key: keyof typeof formData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleRegister = () => {
        if (formData.password !== formData.confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        console.log(formData);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            {/* Name Fields */}
            <View style={styles.field}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    value={formData.firstName}
                    onChangeText={(val) => updateField('firstName', val)}
                    placeholder="First Name"
                    style={styles.input}
                />
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    value={formData.lastName}
                    onChangeText={(val) => updateField('lastName', val)}
                    placeholder="Last Name"
                    style={styles.input}
                />
            </View>

            {/* Account Details */}
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
            </View>

            {/* Password Fields */}
            <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    value={formData.password}
                    onChangeText={(val) => updateField('password', val)}
                    secureTextEntry
                    placeholder="Password"
                    style={styles.input}
                />
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
            </View>

            {/* Legal Agreements */}
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

            {/* Submission */}
            <Pressable
                style={[
                    styles.button,
                    (!formData.acceptTerms || !formData.acceptPrivacy) && styles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={!formData.acceptTerms || !formData.acceptPrivacy}
            >
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
