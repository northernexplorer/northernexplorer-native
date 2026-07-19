import React, {useState} from 'react';
import {View, Text, Pressable, Switch, ScrollView} from 'react-native';
import {Link, router} from 'expo-router';
import {useDispatch} from 'react-redux';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {FormField} from '~/layout/Layout/components/FormField';
import {useDeviceInfo} from '~/user/Login/useDeviceInfo';

const initialFormData = {
	identifier: '',
	password: '',
	rememberMe: false,
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

export function Login() {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
	const dispatch = useDispatch();
	const deviceInfo = useDeviceInfo();

	const {mutate, loading} = useApiMutation('user', 'UserController', 'login');

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

		if (!formData.identifier.trim()) {
			newErrors.identifier = 'Username or email is required';
		}
		if (formData.password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			await handleSubmit();
		}
	};

	const handleSubmit = async () => {
		const response = await mutate({login: formData, device: deviceInfo});
		if (response) {
			dispatch(setAuthentication(response));
			router.replace(`/profile/${response.username}`);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<FormField
				fieldName="identifier"
				label="Username or Email"
				placeholder="Username or Email"
				value={formData.identifier}
				updateField={updateField}
				error={errors.identifier}
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

			<View style={styles.rememberRow}>
				<Text style={styles.label}>Remember Me</Text>
				<Switch value={formData.rememberMe} onValueChange={val => updateField('rememberMe', val)} disabled={loading} />
			</View>

			<Pressable style={[styles.button, loading && {opacity: 0.6}]} onPress={validateForm} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
			</Pressable>

			<Link href="/profile/forgot-password" asChild>
				<Pressable disabled={loading}>
					<Text style={styles.link}>Forgot Password?</Text>
				</Pressable>
			</Link>

			<Link href="/profile/register" asChild>
				<Pressable disabled={loading}>
					<Text style={styles.link}>Create Account</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}
