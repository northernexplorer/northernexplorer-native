import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import {getUrl, getUrlSafeString, Spinner, FormField, TextAreaField, DropdownField} from '@northernexplorer/tools';
import {PointOfInterestEditType, PointOfInterestTypeEnum, PublishStatusEnum, RolesEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {config} from '~/config';
import {styles as detailStyles} from '~/location/PointOfInterestDetails/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {CountryDropdown} from '~/layout/Layout/components/CountryDropdown';
import {RegionDropdown} from '~/layout/Layout/components/RegionDropdown';
import {PointOfInterestTypeDropdown} from '~/layout/Layout/components/PointOfInterestTypeDropdown';

type FormState = {
	name: string;
	description: string;
	image: string;
	lat: string;
	lon: string;
	countryId: string;
	regionId: string;
	type: PointOfInterestTypeEnum[];
	startDate: string;
	endDate: string;
	status: PublishStatusEnum;
};

type FormKeys = keyof FormState;

const STATUS_OPTIONS = [
	{label: 'Draft', value: PublishStatusEnum.Draft},
	{label: 'Published', value: PublishStatusEnum.Published},
];

export function PointOfInterestEdit() {
	const {id} = useLocalSearchParams<{id: string}>();
	const authentication = useAuthentication();
	const {data, loading} = useApiFetch('location', 'PointOfInterestController', 'getPointOfInterestById', {id});
	const {mutate, loading: mutationLoading} = useApiMutation('location', 'PointOfInterestController', 'edit');

	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
	const [form, setForm] = useState<FormState>({
		name: '',
		description: '',
		image: '',
		lat: '',
		lon: '',
		countryId: '',
		regionId: '',
		type: [PointOfInterestTypeEnum.HistoricSite],
		startDate: '',
		endDate: '',
		status: PublishStatusEnum.Draft,
	});

	useEffect(() => {
		if (data) {
			setForm({
				name: data.name,
				description: data.description,
				image: data.image,
				lat: String(data.lat),
				lon: String(data.lon),
				countryId: data.country.id,
				regionId: data.region.id,
				type: Array.isArray(data.type) ? data.type : [PointOfInterestTypeEnum.HistoricSite],
				startDate: data.startDate != null ? String(data.startDate) : '',
				endDate: data.endDate != null ? String(data.endDate) : '',
				status: data.status,
			});
		}
	}, [data]);

	if (!authentication) return <Redirect href="/profile/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading || !data) return <Spinner />;

	const updateField = <K extends FormKeys>(name: K, value: FormState[K]) => {
		setForm(prev => {
			const next = {...prev, [name]: value};
			// Reset region if country changes
			if (name === 'countryId' && prev.countryId !== value) {
				next.regionId = '';
			}
			return next;
		});

		if (errors[name]) {
			setErrors(prev => ({...prev, [name]: undefined}));
		}
	};

	const validateForm = async () => {
		const newErrors: Partial<Record<FormKeys, string>> = {};

		if (!form.name.trim()) newErrors.name = 'Site name is required';
		if (!form.description.trim()) newErrors.description = 'Description is required';
		if (!form.countryId) newErrors.countryId = 'Country is required';
		if (!form.regionId) newErrors.regionId = 'Region is required';
		if (form.type.length === 0) newErrors.type = 'At least one type must be selected';

		const parsedLat = parseFloat(form.lat);
		if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
			newErrors.lat = 'Latitude must be between -90 and 90';
		}

		const parsedLon = parseFloat(form.lon);
		if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
			newErrors.lon = 'Longitude must be between -180 and 180';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			await handleSubmit(parsedLat, parsedLon);
		}
	};

	const handleSubmit = async (parsedLat: number, parsedLon: number) => {
		const payload: PointOfInterestEditType = {
			id: data.id,
			name: form.name,
			description: form.description,
			image: form.image,
			lat: parsedLat,
			lon: parsedLon,
			countryId: form.countryId,
			regionId: form.regionId,
			type: form.type,
			startDate: form.startDate.trim() ? Number(form.startDate) : undefined,
			endDate: form.endDate.trim() ? Number(form.endDate) : undefined,
			status: form.status,
		};

		const response = await mutate(payload);
		if (response?.success) {
			router.replace({
				pathname: '/[country]/[region]/[name]/[id]',
				params: {
					country: getUrlSafeString(data.country.name),
					region: getUrlSafeString(data.region.name),
					id: getUrlSafeString(data.id),
					name: getUrlSafeString(form.name),
				},
			});
		}
	};

	return (
		<ScrollView style={formStyles.container} contentContainerStyle={formStyles.contentContainer}>
			<Image source={{uri: getUrl({path: data.image, serverUrl: config.SERVER_URL})}} style={detailStyles.banner} />

			<View style={detailStyles.content}>
				<Text style={detailStyles.breadcrumbs}>
					{data.country.name} › {data.region.name}
				</Text>

				<Text style={formStyles.heading}>Edit Point of Interest</Text>

				<View style={formStyles.formGroup}>
					<FormField
						fieldName="name"
						label="Site Name"
						placeholder="Enter site name"
						value={form.name}
						updateField={updateField}
						error={errors.name}
						loading={mutationLoading}
					/>

					<FormField
						fieldName="image"
						label="Image Path"
						placeholder="Path or URL to image"
						value={form.image}
						updateField={updateField}
						error={errors.image}
						loading={mutationLoading}
					/>

					<View style={[formStyles.row, {zIndex: 2000}]}>
						<View style={formStyles.halfWidth}>
							<CountryDropdown
								fieldName="countryId"
								label="Country"
								value={form.countryId}
								updateField={updateField}
								error={errors.countryId}
							/>
						</View>
						<View style={formStyles.halfWidth}>
							<RegionDropdown
								fieldName="regionId"
								label="Region"
								countryId={form.countryId}
								value={form.regionId}
								updateField={updateField}
								error={errors.regionId}
							/>
						</View>
					</View>

					<View style={formStyles.row}>
						<View style={formStyles.halfWidth}>
							<FormField
								fieldName="lat"
								label="Latitude"
								placeholder="e.g. 54.1234"
								value={form.lat}
								updateField={updateField}
								error={errors.lat}
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
								error={errors.lon}
								loading={mutationLoading}
							/>
						</View>
					</View>

					<View style={formStyles.row}>
						<View style={formStyles.halfWidth}>
							<FormField
								fieldName="startDate"
								label="Start Year"
								placeholder="e.g. 1784"
								value={form.startDate}
								updateField={updateField}
								error={errors.startDate}
								loading={mutationLoading}
							/>
						</View>
						<View style={formStyles.halfWidth}>
							<FormField
								fieldName="endDate"
								label="End Year"
								placeholder="e.g. 1821"
								value={form.endDate}
								updateField={updateField}
								error={errors.endDate}
								loading={mutationLoading}
							/>
						</View>
					</View>

					<TextAreaField
						fieldName="description"
						label="Description"
						placeholder="Enter site history and details..."
						value={form.description}
						updateField={updateField}
						error={errors.description}
						loading={mutationLoading}
						numberOfLines={6}
					/>
				</View>

				<View style={formStyles.row}>
					<View style={formStyles.halfWidth}>
						<PointOfInterestTypeDropdown fieldName="type" label="Type" value={form.type} updateField={updateField} error={errors.type} />
					</View>
					<View style={formStyles.halfWidth}>
						<DropdownField
							fieldName="status"
							label="Status"
							value={form.status}
							options={STATUS_OPTIONS}
							updateField={updateField}
							error={errors.status}
							loading={mutationLoading}
						/>
					</View>
				</View>

				<View style={formStyles.buttonRow}>
					<Link
						href={{
							pathname: '/[country]/[region]/[name]/[id]',
							params: {
								country: getUrlSafeString(data.country.name),
								region: getUrlSafeString(data.region.name),
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
