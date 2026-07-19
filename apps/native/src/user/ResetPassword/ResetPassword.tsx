import React, {useState} from 'react';
import {Pressable, Text, ScrollView} from 'react-native';
import {Link, router, useLocalSearchParams} from 'expo-router';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {FormField} from '~/layout/Layout/components/FormField';

const initialFormData = {
	newPassword: '',
	confirmPassword: '',
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

type RouteParams = {
	username: string;
};

export function ResetPassword() {
	const params = new URLSearchParams(window.location.search);
	const token = params.get('token');
	const {username} = useLocalSearchParams<RouteParams>();

	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});

	const {mutate, loading} = useApiMutation('user', 'UserController', 'resetPassword');

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
		const response = await mutate({...formData, token: token || ''});
		if (response?.success) {
			router.replace(`/profile/reset-password-complete`);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
