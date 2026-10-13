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
	const [targetCountryId, setTargetCountryId] = useState('');
	const [targetRegionId, setTargetRegionId] = useState('');
	const [errors, setErrors] = useState<{name?: string; orgId?: string}>({});

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
		}
	}, [orgData, selectedOrgId]);

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
			regionIds: targetRegionId ? [targetRegionId] : undefined,
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
							}}
							disabled={mutationLoading || !filterCountryId}
						/>

						<OrganizationDropdown
							fieldName="selectedOrgId"
							label="Select Organization to Edit"
							regionId={filterRegionId}
							value={selectedOrgId}
							updateField={(_, val) => {
								setSelectedOrgId(val);
								setErrors(prev => ({...prev, orgId: undefined}));
							}}
							error={errors.orgId}
							disabled={mutationLoading || !filterRegionId}
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
								fieldName="targetCountryId"
								label="Country (Optional - filters regions)"
								value={targetCountryId}
								updateField={(_, val) => {
									setTargetCountryId(val);
									setTargetRegionId('');
								}}
								disabled={mutationLoading}
							/>

							<RegionDropdown
								fieldName="targetRegionId"
								countryId={targetCountryId}
								label="Associated Region (Optional)"
								value={targetRegionId}
								updateField={(_, val) => {
									setTargetRegionId(val);
								}}
								disabled={mutationLoading || !targetCountryId}
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
