import React, {useState} from 'react';
import {Text, Pressable, ScrollView} from 'react-native';
import styles from '~/user/styles';
import {Link} from 'expo-router';
import {useApiMutation} from '~/core/useApiMutation';
import {FormField} from '~/layout/Layout/components/FormField';

const initialFormData = {
	email: '',
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

export function ForgotPassword() {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});

	const {mutate, loading} = useApiMutation('user', 'UserController', 'forgotPassword');

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
		try {
			mutate(formData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<Text style={styles.title}>Forgot Password</Text>
			<Text style={styles.description}>
				Enter the email address associated with your account and we'll send you instructions to reset your password.
			</Text>

			{/* Email Field using FormField */}
			<FormField
				fieldName="email"
				label="Email Address"
				placeholder="Email Address"
				value={formData.email}
				updateField={updateField}
				error={errors.email}
				loading={loading}
			/>

			{/* Submit Button */}
			<Pressable style={[styles.button, loading && {opacity: 0.6}]} onPress={validateForm} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Sending Link...' : 'Send Reset Link'}</Text>
			</Pressable>

			{/* Navigation Link */}
			<Link href="/profile/login" asChild>
				<Pressable disabled={loading}>
					<Text style={styles.link}>Back to Sign In</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}
