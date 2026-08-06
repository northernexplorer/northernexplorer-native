import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {Link, router, useLocalSearchParams} from 'expo-router';
import {getUrl, getUrlSafeString} from '@northernexplorer/tools';
import {styles as detailStyles} from '~/location/HistoricSiteDetails/styles';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/elements/Spinner';
import {FormField} from '~/layout/Layout/elements/FormField';
import {TextAreaField} from '~/layout/Layout/elements/TextAreaField';
import {DateField} from '~/layout/Layout/elements/DateField';
import {useApiMutation} from '~/core/useApiMutation';

type FormState = {
	name: string;
	description: string;
	lat: string;
	lon: string;
	startDate?: Date;
	endDate?: Date;
};

type FormKeys = keyof FormState;

export function HistoricSiteEdit() {
	const {id} = useLocalSearchParams<{id: string}>();
	const {data, loading} = useApiFetch('location', 'HistoricSiteController', 'getHistoricSiteById', {id});
	const {mutate, loading: mutationLoading} = useApiMutation('location', 'HistoricSiteController', 'edit', {});

	const [form, setForm] = useState<FormState>({
		name: '',
		description: '',
		lat: '',
		lon: '',
		startDate: new Date(),
		endDate: new Date(),
	});

	useEffect(() => {
		if (data) {
			setForm({
				name: data.name,
				description: data.description,
				lat: String(data.lat),
				lon: String(data.lon),
				startDate: data.startDate ? new Date(data.startDate) : undefined,
				endDate: data.endDate ? new Date(data.endDate) : undefined,
			});
		}
	}, [data]);

	if (loading || !data) return <Spinner />;

	const updateField = <K extends FieldKey>(name: K, value: FormState[K]) => {
		setForm(prev => ({...prev, [name]: value}));
	};

	const validateForm = async () => {
		const newErrors: Partial<Record<FormKeys, string>> = {};

		if (formData.firstName.trim().length < 2) newErrors.firstName = 'First name is too short';
		if (formData.lastName.trim().length < 2) newErrors.lastName = 'Last name is too short';
		if (formData.username.trim().length < 6) newErrors.username = 'Username must be at least 6 characters';
		if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email address';
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
		if (response?.success) {
			router.replace('/profile/email-confirmation');
		}
	};

	return (
		<ScrollView style={formStyles.container} contentContainerStyle={formStyles.contentContainer}>
			<Image source={{uri: getUrl({path: data.image, serverUrl: config.SERVER_URL})}} style={detailStyles.banner} />

			<View style={detailStyles.content}>
				<Text style={detailStyles.breadcrumbs}>
					{data.country?.name} › {data.region?.name}
				</Text>

				<Text style={formStyles.heading}>Edit Historic Site</Text>

				<View style={formStyles.formGroup}>
					<FormField
						fieldName="name"
						label="Site Name"
						placeholder="Enter site name"
						value={form.name}
						updateField={updateField}
						loading={mutationLoading}
					/>

					<View style={formStyles.row}>
						<View style={formStyles.halfWidth}>
							<FormField
								fieldName="lat"
								label="Latitude"
								placeholder="e.g. 54.1234"
								value={form.lat}
								updateField={updateField}
								loading={mutationLoading}
							/>
						</View>
						<View style={formStyles.halfWidth}>
							<FormField
								fieldName="lon"
								label="Longitude"
								placeholder="e.g. -94.5678"
								value={form.lon}
								updateField={updateField}
								loading={mutationLoading}
							/>
						</View>
					</View>

					<View style={formStyles.row}>
						<View style={formStyles.halfWidth}>
							<DateField
								fieldName="startDate"
								label="Start Date"
								value={form.startDate}
								updateField={updateField}
								loading={mutationLoading}
							/>
						</View>
						<View style={formStyles.halfWidth}>
							<DateField fieldName="endDate" label="End Date" value={form.endDate} updateField={updateField} loading={mutationLoading} />
						</View>
					</View>

					<TextAreaField
						fieldName="description"
						label="Description"
						placeholder="Enter site history and details..."
						value={form.description}
						updateField={updateField}
						loading={mutationLoading}
						numberOfLines={6}
					/>
				</View>

				<View style={formStyles.buttonRow}>
					<Link
						href={{
							pathname: '/[country]/[region]/[name]/[id]',
							params: {
								country: getUrlSafeString(data.country?.name),
								region: getUrlSafeString(data.region?.name),
								id: getUrlSafeString(data.id),
								name: getUrlSafeString(data.name),
							},
						}}
						asChild
					>
						<TouchableOpacity style={{...formStyles.button, ...formStyles.cancelButton}} disabled={mutationLoading}>
							<Text style={formStyles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</Link>

					<TouchableOpacity
						style={[formStyles.button, formStyles.saveButton, mutationLoading && formStyles.disabledButton]}
						onPress={validateForm}
						disabled={mutationLoading}
					>
						{mutationLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={formStyles.saveButtonText}>Save Changes</Text>}
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
}

const formStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 32,
	},
	heading: {
		fontSize: 22,
		fontWeight: '700',
		color: '#111',
		marginVertical: 12,
	},
	formGroup: {
		gap: 16,
		marginVertical: 12,
	},
	row: {
		flexDirection: 'row',
		gap: 12,
	},
	halfWidth: {
		flex: 1,
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 24,
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	saveButton: {
		backgroundColor: '#0088cc',
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
	},
	cancelButton: {
		backgroundColor: '#E5E5EA',
	},
	cancelButtonText: {
		color: '#3A3A3C',
		fontSize: 16,
		fontWeight: '600',
	},
	disabledButton: {
		opacity: 0.6,
	},
});
