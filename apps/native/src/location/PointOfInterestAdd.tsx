import React, {useState} from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Pressable} from 'react-native';
import {Redirect, router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {FormField, TextAreaField, DropdownField, getUrlSafeString, CoordinateField} from '@northernexplorer/tools-web';
import {PointOfInterestCreateType, PointOfInterestTypeEnum, PublishStatusEnum, RolesEnum} from '@northernexplorer/types';
import {styles as detailStyles} from '~/location/PointOfInterestDetails/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {CountryDropdown} from '~/layout/Layout/components/CountryDropdown';
import {RegionDropdown} from '~/layout/Layout/components/RegionDropdown';
import {PointOfInterestTypeDropdown} from '~/layout/Layout/components/PointOfInterestTypeDropdown';
import {OrganizationDropdown} from '~/layout/Layout/components/OrganizationDropdown';
import {CoordinateMap} from '~/layout/Layout/components/CoordinateMap';
import {PhotoUploadCard} from '~/location/PointOfInterestDetails/components/PhotoUploadCard';
import {ReviewForm} from '~/location/PointOfInterestDetails/components/ReviewForm';

type FormState = {
	name: string;
	description: string;
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

type CreatedPoiData = {
	id: string;
	countryName: string;
	regionName: string;
	poiName: string;
};

const STATUS_OPTIONS = [
	{label: 'Draft', value: PublishStatusEnum.Draft},
	{label: 'Published', value: PublishStatusEnum.Published},
];

export function PointOfInterestAdd() {
	const authentication = useAuthentication();
	const isAdmin = Boolean(authentication?.roles?.includes(RolesEnum.Admin));
	const {mutate, loading: mutationLoading} = useApiMutation('location', 'PointOfInterestController', 'create');

	const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
	const [createdPoi, setCreatedPoi] = useState<CreatedPoiData | null>(null);

	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
	const [form, setForm] = useState<FormState>({
		name: '',
		description: '',
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

	if (!authentication) return <Redirect href="/user/login" />;

	const updateField = <K extends FormKeys>(name: K, value: FormState[K]) => {
		setForm(prev => {
			const next = {...prev, [name]: value};
			if (name === 'countryId' && prev.countryId !== value) {
				next.regionId = '';
				next.organizationId = '';
			}
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
		const payload: PointOfInterestCreateType = {
			name: form.name,
			description: form.description,
			lat: parsedLat,
			lon: parsedLon,
			countryId: form.countryId,
			regionId: form.regionId,
			type: form.type,
			startDate: form.startDate.trim() ? Number(form.startDate) : undefined,
			endDate: form.endDate.trim() ? Number(form.endDate) : undefined,
			status: isAdmin ? form.status : PublishStatusEnum.Draft,
			organizationId: form.organizationId,
		};

		const response = await mutate(payload);
		if (response?.success && response.id) {
			setCreatedPoi({
				id: response.id,
				countryName: response.countryName,
				regionName: response.regionName,
				poiName: response.poiName,
			});
			setStep(2);
		}
	};

	const renderStepIndicator = () => {
		const steps = [
			{number: 1, title: 'POI Details'},
			{number: 2, title: 'Upload Photos'},
			{number: 3, title: 'Leave Review'},
		];

		return (
			<View style={formStyles.stepperWrapper}>
				<View style={formStyles.stepperContainer}>
					{steps.map((s, index) => {
						const isCompleted = step > s.number;
						const isCurrent = step === s.number;

						return (
							<React.Fragment key={s.number}>
								<View style={formStyles.stepItem}>
									<View
										style={[
											formStyles.stepCircle,
											isCompleted && formStyles.stepCircleCompleted,
											isCurrent && formStyles.stepCircleCurrent,
										]}
									>
										{isCompleted ? (
											<Ionicons name="checkmark" size={14} color="#ffffff" />
										) : (
											<Text style={[formStyles.stepNumberText, isCurrent && formStyles.stepNumberTextCurrent]}>{s.number}</Text>
										)}
									</View>
									<Text style={[formStyles.stepLabel, (isCurrent || isCompleted) && formStyles.stepLabelActive]} numberOfLines={1}>
										{s.title}
									</Text>
								</View>
								{index < steps.length - 1 && (
									<View style={[formStyles.stepConnector, step > s.number && formStyles.stepConnectorActive]} />
								)}
							</React.Fragment>
						);
					})}
				</View>
			</View>
		);
	};

	return (
		<ScrollView style={formStyles.container} contentContainerStyle={formStyles.contentContainer}>
			<View style={detailStyles.content}>
				{step < 4 && renderStepIndicator()}

				{/* STEP 1: POI Details Form */}
				{step === 1 && (
					<>
						<View style={formStyles.headerIntro}>
							<Text style={formStyles.heading}>{isAdmin ? 'Add Point of Interest' : 'Suggest a Point of Interest'}</Text>
							<Text style={formStyles.subheading}>
								{isAdmin
									? 'Create a new point of interest on the map. You can save it as a draft or publish it immediately.'
									: 'Suggest a new location for Northern Explorer. Your suggestion will be saved as a draft and reviewed by administrators.'}
							</Text>
						</View>

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
								<PointOfInterestTypeDropdown
									fieldName="type"
									label="Type"
									value={form.type}
									updateField={updateField}
									error={errors.type}
								/>
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
							<TouchableOpacity
								style={[formStyles.button, formStyles.cancelButton]}
								onPress={() => router.back()}
								disabled={mutationLoading}
							>
								<Text style={formStyles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[formStyles.button, formStyles.saveButton, mutationLoading && formStyles.disabledButton]}
								onPress={validateForm}
								disabled={mutationLoading}
							>
								{mutationLoading ? (
									<ActivityIndicator color="#FFFFFF" />
								) : (
									<Text style={formStyles.saveButtonText}>Continue to Photos</Text>
								)}
							</TouchableOpacity>
						</View>
					</>
				)}

				{/* STEP 2: Upload Photos */}
				{step === 2 && createdPoi && (
					<View style={formStyles.stepContent}>
						<View style={formStyles.stepHeader}>
							<View style={formStyles.stepBadge}>
								<Text style={formStyles.stepBadgeText}>Step 2 of 3</Text>
							</View>
							<Text style={formStyles.heading}>Upload Photos</Text>
							<Text style={formStyles.subheading}>
								Add photos for <Text style={{fontWeight: '700'}}>{createdPoi.poiName}</Text>. Photos will be saved and reviewed along
								with your draft.
							</Text>
						</View>

						<PhotoUploadCard pointOfInterestId={createdPoi.id} />

						<View style={formStyles.buttonRow}>
							<TouchableOpacity style={[formStyles.button, formStyles.secondaryButton]} onPress={() => setStep(3)}>
								<Text style={formStyles.secondaryButtonText}>Skip Photos</Text>
							</TouchableOpacity>

							<TouchableOpacity style={[formStyles.button, formStyles.saveButton]} onPress={() => setStep(3)}>
								<Text style={formStyles.saveButtonText}>Continue to Review</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{/* STEP 3: Leave a Review */}
				{step === 3 && createdPoi && (
					<View style={formStyles.stepContent}>
						<View style={formStyles.stepHeader}>
							<View style={formStyles.stepBadge}>
								<Text style={formStyles.stepBadgeText}>Step 3 of 3</Text>
							</View>
							<Text style={formStyles.heading}>Leave a Review</Text>
							<Text style={formStyles.subheading}>
								Share your experience, trail difficulty, entrance cost, and conditions for{' '}
								<Text style={{fontWeight: '700'}}>{createdPoi.poiName}</Text>.
							</Text>
						</View>

						<ReviewForm pointOfInterestId={createdPoi.id} onSuccess={() => setStep(4)} />

						<TouchableOpacity style={formStyles.skipLink} onPress={() => setStep(4)}>
							<Text style={formStyles.skipLinkText}>Skip review and finish submission →</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* STEP 4: Success / Confirmation Screen */}
				{step === 4 && createdPoi && (
					<View style={formStyles.successCard}>
						<View style={formStyles.successIconContainer}>
							<Ionicons name="checkmark-circle" size={64} color="#16a34a" />
						</View>
						<Text style={formStyles.successTitle}>Point of Interest Submitted!</Text>
						<Text style={formStyles.successDescription}>
							Thank you for contributing! Your submission for <Text style={{fontWeight: '700'}}>{createdPoi.poiName}</Text> has been
							saved as a draft. It will be reviewed by our team before appearing on the public map.
						</Text>

						<View style={formStyles.successActions}>
							<Pressable style={[formStyles.button, formStyles.saveButton]} onPress={() => router.replace('/map')}>
								<Ionicons name="map-outline" size={18} color="#ffffff" style={{marginRight: 6}} />
								<Text style={formStyles.saveButtonText}>Explore Map</Text>
							</Pressable>

							<Pressable style={[formStyles.button, formStyles.cancelButton]} onPress={() => router.replace('/')}>
								<Ionicons name="home-outline" size={18} color="#3A3A3C" style={{marginRight: 6}} />
								<Text style={formStyles.cancelButtonText}>Go to Dashboard</Text>
							</Pressable>

							{isAdmin && (
								<Pressable
									style={[formStyles.button, formStyles.adminViewButton]}
									onPress={() =>
										router.replace({
											pathname: '/[country]/[region]/[name]/[id]',
											params: {
												country: getUrlSafeString(createdPoi.countryName),
												region: getUrlSafeString(createdPoi.regionName),
												id: getUrlSafeString(createdPoi.id),
												name: getUrlSafeString(createdPoi.poiName),
											},
										})
									}
								>
									<Ionicons name="eye-outline" size={18} color="#0284c7" style={{marginRight: 6}} />
									<Text style={formStyles.adminViewButtonText}>View POI Details</Text>
								</Pressable>
							)}
						</View>
					</View>
				)}
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
	stepperWrapper: {
		marginBottom: 16,
		paddingVertical: 12,
		paddingHorizontal: 8,
		backgroundColor: '#ffffff',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	stepperContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	stepItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepCircle: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: '#e2e8f0',
		alignItems: 'center',
		justifyContent: 'center',
	},
	stepCircleCurrent: {
		backgroundColor: '#0088cc',
	},
	stepCircleCompleted: {
		backgroundColor: '#16a34a',
	},
	stepNumberText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#64748b',
	},
	stepNumberTextCurrent: {
		color: '#ffffff',
	},
	stepLabel: {
		fontSize: 13,
		fontWeight: '500',
		color: '#94a3b8',
	},
	stepLabelActive: {
		color: '#0f172a',
		fontWeight: '600',
	},
	stepConnector: {
		flex: 1,
		height: 2,
		backgroundColor: '#e2e8f0',
		marginHorizontal: 8,
	},
	stepConnectorActive: {
		backgroundColor: '#16a34a',
	},
	headerIntro: {
		marginBottom: 8,
	},
	stepHeader: {
		marginBottom: 12,
	},
	stepBadge: {
		alignSelf: 'flex-start',
		backgroundColor: '#e0f2fe',
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		marginBottom: 6,
	},
	stepBadgeText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#0284c7',
	},
	heading: {
		fontSize: 22,
		fontWeight: '700',
		color: '#111',
		marginVertical: 4,
	},
	subheading: {
		fontSize: 14,
		color: '#64748b',
		lineHeight: 20,
	},
	stepContent: {
		marginVertical: 8,
	},
	skipLink: {
		alignItems: 'center',
		paddingVertical: 14,
		marginTop: 8,
	},
	skipLinkText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#64748b',
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
		flexDirection: 'row',
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
	secondaryButton: {
		backgroundColor: '#f1f5f9',
		borderWidth: 1,
		borderColor: '#cbd5e1',
	},
	secondaryButtonText: {
		color: '#475569',
		fontSize: 16,
		fontWeight: '600',
	},
	adminViewButton: {
		backgroundColor: '#e0f2fe',
		borderWidth: 1,
		borderColor: '#bae6fd',
	},
	adminViewButtonText: {
		color: '#0284c7',
		fontSize: 16,
		fontWeight: '600',
	},
	disabledButton: {
		opacity: 0.6,
	},
	successCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		padding: 24,
		alignItems: 'center',
		marginVertical: 16,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	successIconContainer: {
		marginBottom: 16,
	},
	successTitle: {
		fontSize: 22,
		fontWeight: '700',
		color: '#0f172a',
		marginBottom: 8,
		textAlign: 'center',
	},
	successDescription: {
		fontSize: 15,
		color: '#64748b',
		textAlign: 'center',
		lineHeight: 22,
		marginBottom: 24,
		maxWidth: 480,
	},
	successActions: {
		width: '100%',
		gap: 12,
		maxWidth: 360,
	},
});
