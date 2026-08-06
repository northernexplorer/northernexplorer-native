import React, {useState, useEffect} from 'react';
import {Text, Pressable, ScrollView} from 'react-native';
import {Link, Redirect, useLocalSearchParams, router} from 'expo-router';
import {Spinner, FormField} from '@northernexplorer/tools';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiMutation} from '~/core/useApiMutation';
import {useApiFetch} from '~/core/useApiFetch';
import {isValidEmail} from '~/user/isValidEmail';

type RouteParams = {
	username: string;
};

interface ProfileFormFields {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	userId: string;
}

type FormKeys = keyof ProfileFormFields;

export function EditProfile() {
	const authentication = useAuthentication();

	const {username} = useLocalSearchParams<RouteParams>();

	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
	const [submissionError, setSubmissionError] = useState<string | null>(null);

	const {data, loading} = useApiFetch('user', 'UserController', 'getByUsername', {
		username,
	});

	const {mutate, loading: mutationLoading} = useApiMutation('user', 'UserController', 'editProfile');

	const [formData, setFormData] = useState<ProfileFormFields>({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		userId: '',
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
		setSubmissionError(null);

		if (formData.firstName.trim().length < 2) newErrors.firstName = 'First name is too short';
		if (formData.lastName.trim().length < 2) newErrors.lastName = 'Last name is too short';
		if (formData.username.trim().length < 6) {
			newErrors.username = 'Username must be at least 6 characters';
		}
		if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email address';

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			await handleSubmit();
		}
	};

	const handleSubmit = async () => {
		const response = await mutate(formData);

		if (response?.success) {
			router.replace(`/profile/${username}`);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			{submissionError && <Text style={[styles.errorText, {textAlign: 'center', marginVertical: 10}]}>{submissionError}</Text>}

			<FormField
				fieldName="firstName"
				label="First Name"
				placeholder="First Name"
				value={formData.firstName}
				updateField={updateField}
				error={errors.firstName}
				loading={mutationLoading}
			/>

			<FormField
				fieldName="lastName"
				label="Last Name"
				placeholder="Last Name"
				value={formData.lastName}
				updateField={updateField}
				error={errors.lastName}
				loading={mutationLoading}
			/>

			<FormField
				fieldName="username"
				label="Username"
				placeholder="Username"
				value={formData.username}
				updateField={updateField}
				error={errors.username}
				loading={mutationLoading}
			/>

			<FormField
				fieldName="email"
				label="Email Address"
				placeholder="Email Address"
				value={formData.email}
				updateField={updateField}
				error={errors.email}
				loading={mutationLoading}
			/>

			<Pressable style={[styles.button, mutationLoading && {opacity: 0.6}]} onPress={validateForm} disabled={mutationLoading}>
				<Text style={styles.buttonText}>{mutationLoading ? 'Saving Changes...' : 'Save Changes'}</Text>
			</Pressable>

			<Link href={`/profile/${username}`} asChild>
				<Pressable style={styles.secondaryButton} disabled={mutationLoading}>
					<Text style={styles.secondaryButtonText}>Cancel</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}
