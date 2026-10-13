import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Redirect, useRouter, useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {FormField, Spinner} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';
import {CountryDropdown} from '~/layout/Layout/components/CountryDropdown';
import {RegionDropdown} from '~/layout/Layout/components/RegionDropdown';

export function RegionEdit() {
	const router = useRouter();
	const {id: paramId} = useLocalSearchParams<{id?: string}>();
	const authentication = useAuthentication();
	const isAdmin = Boolean(authentication?.roles?.includes(RolesEnum.Admin));

	const [filterCountryId, setFilterCountryId] = useState('');
	const [selectedRegionId, setSelectedRegionId] = useState(paramId || '');
	const [targetCountryId, setTargetCountryId] = useState('');
	const [name, setName] = useState('');
	const [errors, setErrors] = useState<{name?: string; countryId?: string; regionId?: string}>({});

	const {data: regionData, loading: fetchingRegion} = useApiFetch(
		'location',
		'RegionController',
		'getById',
		{id: selectedRegionId},
		{skip: !selectedRegionId},
	);

	const {mutate: editRegion, loading: mutationLoading} = useApiMutation('location', 'RegionController', 'edit');

	useEffect(() => {
		if (paramId) {
			setSelectedRegionId(paramId);
		}
	}, [paramId]);

	useEffect(() => {
		if (regionData && selectedRegionId) {
			setName(regionData.name);
			const countryId = regionData.countryId || regionData.country?.id || '';
			setTargetCountryId(countryId);
			if (!filterCountryId) {
				setFilterCountryId(countryId);
			}
		}
	}, [regionData, selectedRegionId]);

	if (!authentication) return <Redirect href="/user/login" />;
	if (!isAdmin) return <Redirect href="404" />;

	const handleSubmit = async () => {
		const newErrors: {name?: string; countryId?: string; regionId?: string} = {};
		if (!selectedRegionId) {
			newErrors.regionId = 'Please select a region to edit';
		}
		if (!targetCountryId) {
			newErrors.countryId = 'Country is required';
		}
		if (!name.trim()) {
			newErrors.name = 'Region name is required';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setErrors({});

		const result = await editRegion({
			id: selectedRegionId,
			countryId: targetCountryId,
			name: name.trim(),
		});

		if (result) {
			alertStore.showAlert({
				message: `Region "${result.name}" updated successfully!`,
				type: 'success',
			});
			router.push('/admin');
		}
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.card}>
				{!paramId && (
					<View style={styles.selectorSection}>
						<Text style={styles.sectionHeader}>Select Region</Text>
						<CountryDropdown
							fieldName="filterCountryId"
							label="Filter by Country"
							value={filterCountryId}
							updateField={(_, val) => {
								setFilterCountryId(val);
								setSelectedRegionId('');
								setName('');
								setTargetCountryId(val);
								setErrors(prev => ({...prev, regionId: undefined}));
							}}
							disabled={mutationLoading}
						/>

						<RegionDropdown
							fieldName="selectedRegionId"
							label="Select Region to Edit"
							countryId={filterCountryId}
							value={selectedRegionId}
							updateField={(_, val) => {
								setSelectedRegionId(val);
								setErrors(prev => ({...prev, regionId: undefined}));
							}}
							error={errors.regionId}
							disabled={mutationLoading || !filterCountryId}
						/>
						<View style={styles.divider} />
					</View>
				)}

				{fetchingRegion && selectedRegionId ? (
					<View style={styles.loadingContainer}>
						<Spinner />
					</View>
				) : (
					selectedRegionId && (
						<View>
							<Text style={styles.sectionHeader}>Edit Details</Text>
							<CountryDropdown
								fieldName="targetCountryId"
								label="Assigned Country"
								value={targetCountryId}
								updateField={(_, val) => {
									setTargetCountryId(val);
									if (errors.countryId) setErrors(prev => ({...prev, countryId: undefined}));
								}}
								error={errors.countryId}
								disabled={mutationLoading}
							/>

							<FormField
								label="Region Name"
								value={name}
								updateField={(_, val) => {
									setName(val);
									if (errors.name) setErrors(prev => ({...prev, name: undefined}));
								}}
								placeholder="e.g. Suðurnes, Troms, Lapland"
								error={errors.name}
								loading={mutationLoading}
								fieldName="name"
							/>

							<View style={styles.buttonRow}>
								<TouchableOpacity
									style={[styles.button, styles.cancelButton]}
									onPress={() => router.push('/admin')}
									disabled={mutationLoading}
								>
									<Text style={styles.cancelButtonText}>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.button, styles.submitButton, mutationLoading && styles.buttonDisabled]}
									onPress={handleSubmit}
									disabled={mutationLoading}
								>
									{mutationLoading ? (
										<ActivityIndicator size="small" color="#ffffff" />
									) : (
										<>
											<Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" style={{marginRight: 6}} />
											<Text style={styles.submitButtonText}>Save Changes</Text>
										</>
									)}
								</TouchableOpacity>
							</View>
						</View>
					)
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
		maxWidth: 600,
		width: '100%',
		alignSelf: 'center',
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: '#e9ecef',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	selectorSection: {
		marginBottom: 12,
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '700',
		color: '#212529',
		marginBottom: 12,
	},
	divider: {
		height: 1,
		backgroundColor: '#e9ecef',
		marginVertical: 16,
	},
	loadingContainer: {
		padding: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 12,
		marginTop: 24,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		minWidth: 120,
	},
	cancelButton: {
		backgroundColor: '#f1f3f5',
	},
	cancelButtonText: {
		color: '#495057',
		fontWeight: '600',
		fontSize: 14,
	},
	submitButton: {
		backgroundColor: '#0088cc',
	},
	submitButtonText: {
		color: '#ffffff',
		fontWeight: '600',
		fontSize: 14,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
});
