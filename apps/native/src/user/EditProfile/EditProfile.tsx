import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect, useLocalSearchParams, router } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';
import { useApiMutation } from '~/core/useApiMutation';
import { useApiFetch } from '~/core/useApiFetch';
import { Spinner } from '~/layout/Layout/components/Spiner';

type RouteParams = {
    username: string;
};

interface ProfileFormFields {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    userId: number;
}

type FormKeys = keyof ProfileFormFields;

export function EditProfile() {
    const authentication = useAuthentication();

    const { username } = useLocalSearchParams<RouteParams>();

    const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const { data, loading } = useApiFetch('user', 'UserController', 'getByUsername', {
        username,
    });

    const { mutate, loading: mutationLoading } = useApiMutation(
        'user',
        'UserController',
        'editProfile',
    );

    const [formData, setFormData] = useState<ProfileFormFields>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        userId: 0,
    });

    useEffect(() => {
        if (data) {
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                userId: data.id,
            });
        }
    }, [data]);

    if (!authentication) return <Redirect href="/profile/login" />;
    if (loading || !data) return <Spinner />;

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
        setSubmissionError(null);

        if (formData.firstName.trim().length < 2) newErrors.firstName = 'First name is too short';
        if (formData.lastName.trim().length < 2) newErrors.lastName = 'Last name is too short';
        if (formData.username.trim().length < 6) {
            newErrors.username = 'Username must be at least 6 characters';
        }
        if (!formData.email.trim().includes('@')) newErrors.email = 'Invalid email address';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        const response = await mutate(formData);

        if (response) {
            router.replace(`/profile/${username}`);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Edit Profile</Text>

            {submissionError && (
                <Text style={[styles.errorText, { textAlign: 'center', marginVertical: 10 }]}>
                    {submissionError}
                </Text>
            )}

            {/* First Name */}
            <View style={styles.field}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    value={formData.firstName}
                    onChangeText={(val) => updateField('firstName', val)}
                    placeholder="First Name"
                    style={styles.input}
                    editable={!mutationLoading}
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
                    editable={!mutationLoading}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>

            {/* Username */}
            <View style={styles.field}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    value={formData.username}
                    onChangeText={(val) => updateField('username', val)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Username"
                    style={styles.input}
                    editable={!mutationLoading}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
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
                    editable={!mutationLoading}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Submit Changes */}
            <Pressable
                style={[styles.button, mutationLoading && { opacity: 0.6 }]}
                onPress={validateForm}
                disabled={mutationLoading}
            >
                <Text style={styles.buttonText}>
                    {mutationLoading ? 'Saving Changes...' : 'Save Changes'}
                </Text>
            </Pressable>

            {/* Cancel Action */}
            <Link href={`/profile/${username}`} asChild>
                <Pressable style={styles.secondaryButton} disabled={mutationLoading}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}
