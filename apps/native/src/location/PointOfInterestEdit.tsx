import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import {
	getUrlSafeString,
	Spinner,
	FormField,
	TextAreaField,
	DropdownField,
	ImageView,
	getImageUrl,
	CoordinateField,
} from '@northernexplorer/tools-web';
import {
	PointOfInterestEditType,
	PointOfInterestSuggestionCreateType,
	PointOfInterestTypeEnum,
	PublishStatusEnum,
	RolesEnum,
} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {config} from '~/config';
import {styles, styles as detailStyles} from '~/location/PointOfInterestDetails/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {CountryDropdown} from '~/layout/Layout/components/CountryDropdown';
import {RegionDropdown} from '~/layout/Layout/components/RegionDropdown';
import {PointOfInterestTypeDropdown} from '~/layout/Layout/components/PointOfInterestTypeDropdown';
import {OrganizationDropdown} from '~/layout/Layout/components/OrganizationDropdown';
import {CoordinateMap} from '~/layout/Layout/components/CoordinateMap';
import {Map} from '~/location/PointOfInterestDetails/components/Map';
import {alertStore} from '~/core/alertStore';

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
	organizationId: string;
};

type FormKeys = keyof FormState;

const STATUS_OPTIONS = [
	{label: 'Draft', value: PublishStatusEnum.Draft},
	{label: 'Published', value: PublishStatusEnum.Published},
];

export function PointOfInterestEdit() {
	const {id} = useLocalSearchParams<{id: string}>();
	const authentication = useAuthentication();
	const isAdmin = !!authentication?.roles?.includes(RolesEnum.Admin);
	const {data, loading} = useApiFetch('location', 'PointOfInterestController', 'getById', {id});
	const {mutate: editMutate, loading: editLoading} = useApiMutation('location', 'PointOfInterestController', 'edit');
	const {mutate: suggestMutate, loading: suggestLoading} = useApiMutation('location', 'PointOfInterestSuggestionController', 'create');

	const mutationLoading = isAdmin ? editLoading : suggestLoading;

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
		organizationId: '',
	});

	useEffect(() => {
		if (data) {
			setForm({
				name: data.name,
				description: data.description,
				image: data.image.id,
				lat: String(data.lat),
				lon: String(data.lon),
				countryId: data.country.id,
				regionId: data.region.id,
				type: Array.isArray(data.type) ? data.type : [PointOfInterestTypeEnum.HistoricSite],
				startDate: data.startDate != null ? String(data.startDate) : '',
				endDate: data.endDate != null ? String(data.endDate) : '',
				status: data.status,
				organizationId: data.organization.id,
			});
		}
	}, [data]);

	if (!authentication) return <Redirect href="/user/login" />;
	if (loading || !data) return <Spinner />;

	const updateField = <K extends FormKeys>(name: K, value: FormState[K]) => {
		setForm(prev => {
			const next = {...prev, [name]: value};
			// Reset region and organization if country changes
			if (name === 'countryId' && prev.countryId !== value) {
				next.regionId = '';
				next.organizationId = '';
			}
			// Reset organization if region changes
			if (name === 'regionId' && prev.regionId !== value) {
				next.organizationId = '';
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
		if (!form.organizationId) newErrors.organizationId = 'Organization is required';
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
		if (isAdmin) {
			const payload: PointOfInterestEditType = {
				id: data.id,
				name: form.name,
				description: form.description,
				imageId: form.image,
				lat: parsedLat,
				lon: parsedLon,
				countryId: form.countryId,
				regionId: form.regionId,
				type: form.type,
				startDate: form.startDate.trim() ? Number(form.startDate) : undefined,
				endDate: form.endDate.trim() ? Number(form.endDate) : undefined,
				status: form.status,
				organizationId: form.organizationId,
			};

			const response = await editMutate(payload);
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
		} else {
			const payload: PointOfInterestSuggestionCreateType = {
				pointOfInterestId: data.id,
				name: form.name,
				description: form.description,
				imageId: form.image || undefined,
				lat: parsedLat,
				lon: parsedLon,
				countryId: form.countryId,
				regionId: form.regionId,
				organizationId: form.organizationId,
				type: form.type,
				startDate: form.startDate.trim() ? Number(form.startDate) : undefined,
				endDate: form.endDate.trim() ? Number(form.endDate) : undefined,
			};

			const response = await suggestMutate(payload);
			if (response?.success) {
				alertStore.showAlert({
					title: 'Suggestion Submitted',
					message: 'Thank you for your contribution! Your suggested update has been submitted for admin review.',
					type: 'success',
					buttons: [
						{
							text: 'OK',
							onPress: () => {
								router.replace({
									pathname: '/[country]/[region]/[name]/[id]',
									params: {
										country: getUrlSafeString(data.country.name),
										region: getUrlSafeString(data.region.name),
										id: getUrlSafeString(data.id),
										name: getUrlSafeString(data.name),
									},
								});
							},
						},
					],
				});
			}
		}
	};

	return (
		<ScrollView style={formStyles.container} contentContainerStyle={formStyles.contentContainer}>
			<View style={styles.bannerContainer}>
				<ImageView
					source={{
						uri: getImageUrl({
							path: data.image.url,
							size: 'large',
							cdn: config.CONTENT_DELIVERY_NETWORK,
							processed: data.image.processed,
						}),
					}}
					style={styles.banner}
				/>
				<View style={styles.mapCard}>
					<Map
						site={{
							...data,
							lat: !isNaN(parseFloat(form.lat)) ? parseFloat(form.lat) : data.lat,
							lon: !isNaN(parseFloat(form.lon)) ? parseFloat(form.lon) : data.lon,
						}}
					/>
				</View>
			</View>
			<View style={detailStyles.content}>
				<Text style={detailStyles.breadcrumbs}>
					{data.country.name} › {data.region.name}
				</Text>

				<Text style={formStyles.heading}>{isAdmin ? 'Edit Point of Interest' : 'Suggest Point of Interest Update'}</Text>
				{!isAdmin && (
					<Text style={formStyles.subheading}>
						Suggest updates or corrections for this point of interest. Submissions will be reviewed by administrators.
					</Text>
				)}

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
						label="Image Id"
						placeholder="Id of image"
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

					<OrganizationDropdown
						fieldName="organizationId"
						label="Organization"
						regionId={form.regionId}
						value={form.organizationId}
						updateField={updateField}
						error={errors.organizationId}
					/>

					<CoordinateField
						latFieldName="lat"
						lonFieldName="lon"
						latValue={form.lat}
						lonValue={form.lon}
						updateField={updateField}
						latError={errors.lat}
						lonError={errors.lon}
						loading={mutationLoading}
						mapComponent={CoordinateMap}
					/>

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
					<View style={isAdmin ? formStyles.halfWidth : {flex: 1}}>
						<PointOfInterestTypeDropdown fieldName="type" label="Type" value={form.type} updateField={updateField} error={errors.type} />
					</View>
					{isAdmin && (
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
					)}
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
						{mutationLoading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={formStyles.saveButtonText}>{isAdmin ? 'Save Changes' : 'Submit Suggestion'}</Text>
						)}
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
	subheading: {
		fontSize: 14,
		color: '#666',
		marginBottom: 12,
		lineHeight: 20,
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
