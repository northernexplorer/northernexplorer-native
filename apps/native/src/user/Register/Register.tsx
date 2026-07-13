import React, {useState} from 'react';
import {View, Text, TextInput, Pressable, Switch, ScrollView} from 'react-native';
import {styles} from '~/user/styles';
import {Link, router} from 'expo-router';
import {useApiMutation} from '~/core/useApiMutation';

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

		// Field validations
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
			router.replace('/profile/email-confirmation');
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<Text style={styles.title}>Create Account</Text>

			{/* Honeypot Field - Kept completely invisible to human users */}
			<TextInput
				value={formData.website}
				onChangeText={val => updateField('website', val)}
				placeholder="Your Website"
				autoCapitalize="none"
				autoCorrect={false}
				style={{position: 'absolute', width: 0, height: 0, opacity: 0}}
				pointerEvents="none"
			/>

			{/* First Name */}
			<View style={styles.field}>
				<Text style={styles.label}>First Name</Text>
				<TextInput
					value={formData.firstName}
					onChangeText={val => updateField('firstName', val)}
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
					onChangeText={val => updateField('lastName', val)}
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
					value={formData.username}
					onChangeText={val => updateField('username', val)}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Username"
					style={styles.input}
					editable={!loading}
				/>
				{errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
			</View>

			{/* Email */}
			<View style={styles.field}>
				<Text style={styles.label}>Email Address</Text>
				<TextInput
					value={formData.email}
					onChangeText={val => updateField('email', val)}
					autoCapitalize="none"
					autoCorrect={false}
					keyboardType="email-address"
					placeholder="Email Address"
					style={styles.input}
					editable={!loading}
				/>
				{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
			</View>

			{/* Password */}
			<View style={styles.field}>
				<Text style={styles.label}>Password</Text>
				<TextInput
					value={formData.password}
					onChangeText={val => updateField('password', val)}
					secureTextEntry
					placeholder="Password"
					style={styles.input}
					editable={!loading}
				/>
				{errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
			</View>

			{/* Confirm Password */}
			<View style={styles.field}>
				<Text style={styles.label}>Confirm Password</Text>
				<TextInput
					value={formData.confirmPassword}
					onChangeText={val => updateField('confirmPassword', val)}
					secureTextEntry
					placeholder="Confirm Password"
					style={styles.input}
					editable={!loading}
				/>
				{errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
			</View>

			{/* Terms of Service */}
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

			{/* Privacy Policy */}
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

			{/* Submit Button */}
			<Pressable style={[styles.button, loading && {opacity: 0.6}]} onPress={validateForm} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
			</Pressable>

			{/* Sign In Link */}
			<Link href="/profile/login" asChild>
				<Pressable disabled={loading}>
					<Text style={styles.link}>Already have an account? Sign In</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}
