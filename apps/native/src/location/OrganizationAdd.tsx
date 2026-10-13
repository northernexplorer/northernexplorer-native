import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {DropdownField, FormField} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiMutation} from '~/core/useApiMutation';
import {useApiFetch} from '~/core/useApiFetch';
import {alertStore} from '~/core/alertStore';
import {CountryDropdown} from '~/layout/Layout/components/CountryDropdown';

export function OrganizationAdd() {
	const router = useRouter();
	const authentication = useAuthentication();
	const isAdmin = Boolean(authentication?.roles?.includes(RolesEnum.Admin));

	const [filterCountryId, setFilterCountryId] = useState('');
	const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
	const [name, setName] = useState('');
	const [errors, setErrors] = useState<{name?: string}>({});

	const {data: allRegions, loading: loadingRegions} = useApiFetch('location', 'RegionController', 'getAll', {});
	const {mutate: createOrganization, loading} = useApiMutation('location', 'OrganizationController', 'create');

	const regionOptions = useMemo(() => {
		if (!Array.isArray(allRegions)) return [];
		const filtered = filterCountryId ? allRegions.filter(r => r.country?.id === filterCountryId || r.countryId === filterCountryId) : allRegions;
		return filtered.map(region => ({
			label: filterCountryId ? region.name : `${region.name} (${region.country?.name || 'Unknown'})`,
			value: region.id,
		}));
	}, [allRegions, filterCountryId]);

	const selectedRegionsList = useMemo(() => {
		if (!Array.isArray(allRegions)) return [];
		return allRegions.filter(r => selectedRegionIds.includes(r.id));
	}, [allRegions, selectedRegionIds]);

	if (!authentication) return <Redirect href="/user/login" />;
	if (!isAdmin) return <Redirect href="404" />;

	const handleSubmit = async () => {
		const newErrors: {name?: string} = {};
		if (!name.trim()) {
			newErrors.name = 'Organization name is required';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setErrors({});

		const result = await createOrganization({
			name: name.trim(),
			regionIds: selectedRegionIds.length > 0 ? selectedRegionIds : undefined,
		});

		if (result) {
			alertStore.showAlert({
				message: `Organization "${result.name}" created successfully!`,
				type: 'success',
			});
			router.push('/admin');
		}
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.header}>
				<Ionicons name="business-outline" size={28} color="#0088cc" />
				<Text style={styles.headerTitle}>Add New Organization</Text>
			</View>
			<Text style={styles.headerSubtitle}>
				Register a conservation trust, national park service, or managing entity to oversee points of interest.
			</Text>

			<View style={styles.card}>
				<FormField
					label="Organization Name"
					value={name}
					updateField={(_, val) => {
						setName(val);
						if (errors.name) setErrors(prev => ({...prev, name: undefined}));
					}}
					placeholder="e.g. National Trust, Parks Canada, Statskog"
					error={errors.name}
					loading={loading}
					fieldName="name"
				/>

				<CountryDropdown
					fieldName="filterCountryId"
					label="Filter Regions by Country (Optional)"
					value={filterCountryId}
					updateField={(_, val) => {
						setFilterCountryId(val);
					}}
					disabled={loading}
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
					disabled={loading}
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
					<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.push('/admin')} disabled={loading}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
						onPress={handleSubmit}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<>
								<Ionicons name="add-circle-outline" size={18} color="#ffffff" style={{marginRight: 6}} />
								<Text style={styles.submitButtonText}>Create Organization</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 6,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: '700',
		color: '#212529',
	},
	headerSubtitle: {
		fontSize: 14,
		color: '#6c757d',
		marginBottom: 20,
		lineHeight: 20,
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
		minWidth: 120,
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
