import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';

export function EditProfile() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
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
        if (formData.userName.length < 6)
            newErrors.userName = 'Username must be at least 6 characters';
        if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
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
            <Link href="/profile" asChild>
                <Pressable style={styles.button} onPress={validateForm}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </Pressable>
            </Link>
            <Link href="/profile" asChild>
                <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
            </Link>
        </View>
    );
}
