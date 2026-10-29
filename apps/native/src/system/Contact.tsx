import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput, Pressable, ScrollView} from 'react-native';
import {FormField, TextAreaField, CaptchaField} from '@northernexplorer/tools-web';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {apiClient} from '~/core/apiClient';
import {isValidEmail} from '~/user/isValidEmail';
import {alertStore} from '~/core/alertStore';

const initialFormData = {
	name: '',
	email: '',
	subject: '',
	message: '',
	website: '',
	captchaId: '',
	captchaAnswer: '',
};

type FormData = typeof initialFormData;
type FormKeys = keyof FormData;

export function Contact() {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
	const [captcha, setCaptcha] = useState<{captchaId: string; image: string; svg: string} | null>(null);
	const [captchaLoading, setCaptchaLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const {mutate, loading} = useApiMutation('system', 'SupportController', 'contact');

	const fetchCaptcha = useCallback(async () => {
		setCaptchaLoading(true);
		try {
			const res = await apiClient('system', 'SupportController', 'getCaptcha', {}, 'GET');
			if (res.captchaId) {
				setCaptcha(res);
				setFormData(prev => ({...prev, captchaId: res.captchaId, captchaAnswer: ''}));
			}
		} catch {
			// Failed to fetch captcha
		} finally {
			setCaptchaLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCaptcha();
	}, [fetchCaptcha]);

	const updateField = (key: FormKeys, value: unknown) => {
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

		if (!formData.name.trim()) newErrors.name = 'Please enter your name';
		if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email address';
		if (!formData.subject.trim()) newErrors.subject = 'Please enter a subject';
		if (!formData.message.trim()) newErrors.message = 'Please enter a message';
		if (!formData.captchaAnswer.trim()) {
			newErrors.captchaAnswer = 'Please enter the verification code';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			await handleSubmit();
		}
	};

	const handleSubmit = async () => {
		try {
			const response = await mutate(formData);
			if (response?.success) {
				setSubmitted(true);
				setFormData(initialFormData);
				alertStore.showAlert({
					message: 'Your message has been sent successfully. We will get back to you soon!',
					type: 'success',
				});
				fetchCaptcha();
			} else {
				fetchCaptcha();
			}
		} catch {
			fetchCaptcha();
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<TextInput
				value={formData.website}
				onChangeText={val => updateField('website', val)}
				placeholder="Your Website"
				autoCapitalize="none"
				autoCorrect={false}
				style={{position: 'absolute', width: 0, height: 0, opacity: 0}}
				pointerEvents="none"
			/>

			<Text style={styles.description}>
				Have a question, feedback, or need assistance? Fill out the form below to get in touch with our team.
			</Text>

			{submitted && (
				<View style={styles.noticeBackground}>
					<Text style={styles.noticeText}>Thank you for reaching out! Your message has been sent to support@northernexplorer.org.</Text>
				</View>
			)}

			<FormField
				fieldName="name"
				label="Name"
				placeholder="Your Name"
				value={formData.name}
				updateField={updateField}
				error={errors.name}
				loading={loading}
			/>

			<FormField
				fieldName="email"
				label="Email Address"
				placeholder="your.email@example.com"
				value={formData.email}
				updateField={updateField}
				error={errors.email}
				loading={loading}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<FormField
				fieldName="subject"
				label="Subject"
				placeholder="Subject"
				value={formData.subject}
				updateField={updateField}
				error={errors.subject}
				loading={loading}
			/>

			<TextAreaField
				fieldName="message"
				label="Message"
				placeholder="Write your message here..."
				value={formData.message}
				updateField={updateField}
				error={errors.message}
				loading={loading}
				numberOfLines={5}
			/>

			<CaptchaField
				fieldName="captchaAnswer"
				label="Security Verification"
				placeholder="Enter the code above"
				value={formData.captchaAnswer}
				updateField={updateField}
				image={captcha?.image}
				svg={captcha?.svg}
				onRefresh={fetchCaptcha}
				error={errors.captchaAnswer}
				loading={loading}
				refreshing={captchaLoading}
			/>

			<Pressable style={[styles.button, loading && {opacity: 0.6}]} onPress={validateForm} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Sending Message...' : 'Send Message'}</Text>
			</Pressable>
		</ScrollView>
	);
}
