import React, {useState} from 'react';
import {Pressable, Text, ScrollView} from 'react-native';
import styles from '~/user/styles';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiMutation} from '~/core/useApiMutation';
import {FormField} from '~/layout/Layout/components/FormField';

const initialFormData = {
	currentPassword: '',
	newPassword: '',
	confirmPassword: '',
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

type RouteParams = {
	username: string;
};

export function ChangePassword() {
	const authentication = useAuthentication();
	const {username} = useLocalSearchParams<RouteParams>();

	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});

	const {mutate, loading} = useApiMutation('user', 'UserController', 'changePassword');

	if (!authentication) return <Redirect href="/profile/login" />;

	const updateField = (key: FormKeys, value: string) => {
		setFormData(prev => ({...prev, [key]: value}));
		if (errors[key]) {
			setErrors(prev => {
				const next = {...prev};
				delete next[key];
				return next;
			});
		}
	};

	const validateForm = async () => {
		const newErrors: Partial<Record<FormKeys, string>> = {};

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
		try {
			await mutate({...formData, username});
			router.replace(`/profile/${username}`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<Text style={styles.title}>Change Password</Text>

			<FormField
				fieldName="currentPassword"
				label="Current Password"
				placeholder="Current Password"
				value={formData.currentPassword}
				updateField={updateField}
				error={errors.currentPassword}
				loading={loading}
				secureTextEntry
			/>

			<FormField
				fieldName="newPassword"
				label="New Password"
				placeholder="New Password"
				value={formData.newPassword}
				updateField={updateField}
				error={errors.newPassword}
				loading={loading}
				secureTextEntry
			/>

			<FormField
				fieldName="confirmPassword"
				label="Confirm New Password"
				placeholder="Confirm New Password"
				value={formData.confirmPassword}
				updateField={updateField}
				error={errors.confirmPassword}
				loading={loading}
				secureTextEntry
			/>

			<Pressable style={[styles.button, loading && {opacity: 0.6}]} onPress={validateForm} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Updating Password...' : 'Change Password'}</Text>
			</Pressable>

			<Link href={`/profile/${username}`} asChild>
				<Pressable style={styles.secondaryButton} disabled={loading}>
					<Text style={styles.secondaryButtonText}>Cancel</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}
