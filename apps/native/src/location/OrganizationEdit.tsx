import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Redirect, useRouter, useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {DropdownField, FormField, Spinner} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';
import {CountryDropdown} from '~/layout/Layout/components/CountryDropdown';
import {RegionDropdown} from '~/layout/Layout/components/RegionDropdown';
import {OrganizationDropdown} from '~/layout/Layout/components/OrganizationDropdown';

export function OrganizationEdit() {
	const router = useRouter();
	const {id: paramId} = useLocalSearchParams<{id?: string}>();
	const authentication = useAuthentication();
	const isAdmin = Boolean(authentication?.roles?.includes(RolesEnum.Admin));

	const [filterCountryId, setFilterCountryId] = useState('');
	const [filterRegionId, setFilterRegionId] = useState('');
	const [selectedOrgId, setSelectedOrgId] = useState(paramId || '');

	const [name, setName] = useState('');
	const [targetCountryFilterId, setTargetCountryFilterId] = useState('');
	const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
	const [errors, setErrors] = useState<{name?: string; orgId?: string}>({});

	const {data: allRegions, loading: loadingRegions} = useApiFetch('location', 'RegionController', 'getAll', {});

	const {data: orgData, loading: fetchingOrg} = useApiFetch(
		'location',
		'OrganizationController',
		'getById',
		{id: selectedOrgId},
		{skip: !selectedOrgId},
	);

	const {mutate: editOrg, loading: mutationLoading} = useApiMutation('location', 'OrganizationController', 'edit');

	useEffect(() => {
		if (paramId) {
			setSelectedOrgId(paramId);
		}
	}, [paramId]);

	useEffect(() => {
		if (orgData && selectedOrgId) {
			setName(orgData.name);
			if (Array.isArray(orgData.regions)) {
				setSelectedRegionIds(orgData.regions.map(r => r.id));
			} else {
				setSelectedRegionIds([]);
			}
		}
	}, [orgData, selectedOrgId]);

	const regionOptions = useMemo(() => {
		if (!Array.isArray(allRegions)) return [];
		const filtered = targetCountryFilterId
			? allRegions.filter(r => r.country?.id === targetCountryFilterId || r.countryId === targetCountryFilterId)
			: allRegions;
		return filtered.map(region => ({
			label: targetCountryFilterId ? region.name : `${region.name} (${region.country?.name || 'Unknown'})`,
			value: region.id,
		}));
	}, [allRegions, targetCountryFilterId]);

	const selectedRegionsList = useMemo(() => {
		if (!Array.isArray(allRegions)) return [];
		return allRegions.filter(r => selectedRegionIds.includes(r.id));
	}, [allRegions, selectedRegionIds]);

	if (!authentication) return <Redirect href="/user/login" />;
	if (!isAdmin) return <Redirect href="404" />;

	const handleSubmit = async () => {
		const newErrors: {name?: string; orgId?: string} = {};
		if (!selectedOrgId) {
			newErrors.orgId = 'Please select an organization to edit';
		}
		if (!name.trim()) {
			newErrors.name = 'Organization name is required';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setErrors({});

		const result = await editOrg({
			id: selectedOrgId,
			name: name.trim(),
			regionIds: selectedRegionIds,
		});

		if (result) {
			alertStore.showAlert({
				message: `Organization "${result.name}" updated successfully!`,
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
						<Text style={styles.sectionHeader}>Select Organization</Text>
						<CountryDropdown
							fieldName="filterCountryId"
							label="Filter by Country"
							value={filterCountryId}
							updateField={(_, val) => {
								setFilterCountryId(val);
								setFilterRegionId('');
								setSelectedOrgId('');
								setName('');
								setSelectedRegionIds([]);
							}}
							disabled={mutationLoading}
						/>

						<RegionDropdown
							fieldName="filterRegionId"
							label="Filter by Region"
							countryId={filterCountryId}
							value={filterRegionId}
							updateField={(_, val) => {
								setFilterRegionId(val);
								setSelectedOrgId('');
								setName('');
								setSelectedRegionIds([]);
							}}
							disabled={mutationLoading || !filterCountryId}
						/>

						<OrganizationDropdown
							fieldName="selectedOrgId"
							label="Select Organization to Edit"
							regionId={filterRegionId}
							allowAll={!filterRegionId}
							value={selectedOrgId}
							updateField={(_, val) => {
								setSelectedOrgId(val);
								setErrors(prev => ({...prev, orgId: undefined}));
							}}
							error={errors.orgId}
							disabled={mutationLoading}
						/>
						<View style={styles.divider} />
					</View>
				)}

				{fetchingOrg && selectedOrgId ? (
					<View style={styles.loadingContainer}>
						<Spinner />
					</View>
				) : (
					selectedOrgId && (
						<View>
							<Text style={styles.sectionHeader}>Edit Details</Text>
							<FormField
								label="Organization Name"
								value={name}
								updateField={(_, val) => {
									setName(val);
									if (errors.name) setErrors(prev => ({...prev, name: undefined}));
								}}
								placeholder="e.g. Arctic Adventures, Visit Norway"
								error={errors.name}
								loading={mutationLoading}
								fieldName="name"
							/>

							<CountryDropdown
								fieldName="targetCountryFilterId"
								label="Filter Regions by Country (Optional)"
								value={targetCountryFilterId}
								updateField={(_, val) => {
									setTargetCountryFilterId(val);
								}}
								disabled={mutationLoading}
							/>

							<DropdownField<'regions', string>
								fieldName="regions"
								label="Associated Regions (Optional)"
								value={selectedRegionIds}
								options={regionOptions}
								updateField={(_, val) => setSelectedRegionIds(val)}
								isMultiSelect
								isSearchable
								searchPlaceholder="Search and select regions..."
								loading={loadingRegions}
								disabled={mutationLoading}
							/>

							{selectedRegionsList.length > 0 && (
								<View style={styles.selectedSection}>
									<Text style={styles.selectedSectionTitle}>Selected Regions ({selectedRegionsList.length}):</Text>
									<View style={styles.chipsContainer}>
										{selectedRegionsList.map(region => (
											<View key={region.id} style={styles.chip}>
												<Text style={styles.chipText}>
													{region.name}
													{region.country?.name ? ` (${region.country.name})` : ''}
												</Text>
												<TouchableOpacity
													onPress={() => setSelectedRegionIds(prev => prev.filter(id => id !== region.id))}
													hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
													style={styles.chipRemove}
												>
													<Ionicons name="close-circle" size={16} color="#6c757d" />
												</TouchableOpacity>
											</View>
										))}
									</View>
								</View>
							)}

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
		marginBottom: 16,
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '600',
		color: '#212529',
		marginBottom: 12,
	},
	divider: {
		height: 1,
		backgroundColor: '#e9ecef',
		marginVertical: 16,
	},
	loadingContainer: {
		paddingVertical: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedSection: {
		marginTop: 8,
		marginBottom: 12,
	},
	selectedSectionTitle: {
		fontSize: 13,
		fontWeight: '600',
		color: '#495057',
		marginBottom: 8,
	},
	chipsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	chip: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#e7f5ff',
		borderWidth: 1,
		borderColor: '#a5d8ff',
		borderRadius: 16,
		paddingVertical: 4,
		paddingHorizontal: 10,
		gap: 6,
	},
	chipText: {
		fontSize: 13,
		color: '#1864ab',
		fontWeight: '500',
	},
	chipRemove: {
		justifyContent: 'center',
		alignItems: 'center',
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
