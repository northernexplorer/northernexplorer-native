import React, {useState} from 'react';
import {View, Text, TextInput, Pressable, Switch, ScrollView} from 'react-native';
import styles from '~/user/styles';
import {Link, router} from 'expo-router';
import {useApiMutation} from '~/core/useApiMutation';
import {FormField} from '~/layout/Layout/components/FormField';

const initialFormData = {
	firstName: '',
	lastName: '',
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
	acceptTerms: false,
	acceptPrivacy: false,
	website: '',
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

export function Register() {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});

	const {mutate, loading} = useApiMutation('user', 'UserController', 'register');

	const updateField = (key: FormKeys, value: string | boolean) => {
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

		if (formData.firstName.trim().length < 2) newErrors.firstName = 'First name is too short';
		if (formData.lastName.trim().length < 2) newErrors.lastName = 'Last name is too short';
		if (formData.username.trim().length < 6) newErrors.username = 'Username must be at least 6 characters';
		if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
		if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms of service';
		if (!formData.acceptPrivacy) newErrors.acceptPrivacy = 'You must accept the privacy policy';

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			await handleSubmit();
		}
	};

	const handleSubmit = async () => {
		const response = await mutate(formData);
		if (response.success) {
			router.replace('/profile/login');
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<Text style={styles.title}>Create Account</Text>

			<TextInput
				value={formData.website}
				onChangeText={val => updateField('website', val)}
				placeholder="Your Website"
				autoCapitalize="none"
				autoCorrect={false}
				style={{position: 'absolute', width: 0, height: 0, opacity: 0}}
				pointerEvents="none"
			/>

			<FormField
				fieldName="firstName"
				label="First Name"
				placeholder="First Name"
				value={formData.firstName}
				updateField={updateField}
				error={errors.firstName}
				loading={loading}
			/>

			<FormField
				fieldName="lastName"
				label="Last Name"
				placeholder="Last Name"
				value={formData.lastName}
				updateField={updateField}
				error={errors.lastName}
				loading={loading}
			/>

			<FormField
				fieldName="username"
				label="Username"
				placeholder="Username"
				value={formData.username}
				updateField={updateField}
				error={errors.username}
				loading={loading}
			/>

			<FormField
				fieldName="email"
				label="Email Address"
				placeholder="Email Address"
				value={formData.email}
				updateField={updateField}
				error={errors.email}
				loading={loading}
			/>

			<FormField
				fieldName="password"
				label="Password"
				placeholder="Password"
				value={formData.password}
				updateField={updateField}
				error={errors.password}
				loading={loading}
				secureTextEntry
			/>

			<FormField
				fieldName="confirmPassword"
				label="Confirm Password"
				placeholder="Confirm Password"
				value={formData.confirmPassword}
				updateField={updateField}
				error={errors.confirmPassword}
				loading={loading}
				secureTextEntry
			/>

			<View style={styles.switchRow}>
				<Text style={styles.label}>
					I accept the{' '}
					<Link href="/terms-of-service" style={styles.linkText}>
						Terms of Service
					</Link>
				</Text>
				<Switch value={formData.acceptTerms} onValueChange={val => updateField('acceptTerms', val)} disabled={loading} />
			</View>
			{errors.acceptTerms && <Text style={styles.errorText}>{errors.acceptTerms}</Text>}

			<View style={styles.switchRow}>
				<Text style={styles.label}>
					I accept the{' '}
					<Link href="/privacy-policy" style={styles.linkText}>
						Privacy Policy
					</Link>
				</Text>
				<Switch value={formData.acceptPrivacy} onValueChange={val => updateField('acceptPrivacy', val)} disabled={loading} />
			</View>
			{errors.acceptPrivacy && <Text style={styles.errorText}>{errors.acceptPrivacy}</Text>}

			<Pressable style={[styles.button, loading && {opacity: 0.6}]} onPress={validateForm} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
			</Pressable>

			<Link href="/profile/login" asChild>
				<Pressable disabled={loading}>
					<Text style={styles.link}>Already have an account? Sign In</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}
