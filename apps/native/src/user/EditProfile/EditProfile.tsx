import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';
import { useApiMutation } from '~/core/useApiMutation';

const initialFormData = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
};
type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

type RouteParams = {
    id: string;
};

export function EditProfile() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;
    const { id } = useLocalSearchParams<RouteParams>();

    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});

    const { mutate, loading } = useApiMutation('user', 'UserController', 'editProfile');

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

        if (formData.firstName.trim().length < 2) newErrors.firstName = 'First name is too short';
        if (formData.lastName.trim().length < 2) newErrors.lastName = 'Last name is too short';
        if (formData.userName.trim().length < 6) {
            newErrors.userName = 'Username must be at least 6 characters';
        }
        if (!formData.email.trim().includes('@')) newErrors.email = 'Invalid email address';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            // Your update profile API call / state dispatch goes here
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Edit Profile</Text>

            {/* First Name */}
            <View style={styles.field}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    value={formData.firstName}
                    onChangeText={(val) => updateField('firstName', val)}
                    placeholder="First Name"
                    style={styles.input}
                    editable={!loading}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>

            {/* Last Name */}
            <View style={styles.field}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    value={formData.lastName}
                    onChangeText={(val) => updateField('lastName', val)}
                    placeholder="Last Name"
                    style={styles.input}
                    editable={!loading}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>

            {/* Username */}
            <View style={styles.field}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    value={formData.userName}
                    onChangeText={(val) => updateField('userName', val)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Username"
                    style={styles.input}
                    editable={!loading}
                />
                {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}
            </View>

            {/* Email Address */}
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
                    editable={!loading}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Submit Changes */}
            <Pressable
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={validateForm}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                </Text>
            </Pressable>

            {/* Cancel Action */}
            <Link href={`/profile/${id}`} asChild>
                <Pressable style={styles.secondaryButton} disabled={loading}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}
