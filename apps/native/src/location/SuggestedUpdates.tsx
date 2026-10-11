import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Redirect, useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Column, formatName, Pagination, Spinner, Table} from '@northernexplorer/tools-web';
import {PointOfInterestSuggestionType, RolesEnum, SuggestionStatusEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

const limit = 20;

export function SuggestedUpdates() {
	const router = useRouter();
	const authentication = useAuthentication();
	const params = useLocalSearchParams<{page?: string}>();
	const page = params.page ? parseInt(params.page, 10) : 1;
	const [statusFilter, setStatusFilter] = useState<SuggestionStatusEnum | 'ALL'>(SuggestionStatusEnum.Pending);

	const offset = (page - 1) * limit;

	const {data: suggestions, loading} = useApiFetch('location', 'PointOfInterestSuggestionController', 'getAll', {
		limit,
		offset,
		status: statusFilter === 'ALL' ? undefined : statusFilter,
	});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	const columns: Column<PointOfInterestSuggestionType>[] = [
		{
			key: 'user',
			title: 'Submitter',
			flex: 2,
			render: suggestion => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.userName} numberOfLines={1}>
						{formatName(suggestion.user)}
					</Text>
					<Text style={styles.userScore}>Score: {suggestion.user.score}</Text>
				</View>
			),
		},
		{
			key: 'pointOfInterest',
			title: 'Target Site',
			flex: 2.5,
			render: suggestion => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.poiName} numberOfLines={1}>
						{suggestion.pointOfInterest.name}
					</Text>
					<Text style={styles.locationText} numberOfLines={1}>
						{suggestion.pointOfInterest.country.name} › {suggestion.pointOfInterest.region.name}
					</Text>
				</View>
			),
		},
		{
			key: 'suggestedName',
			title: 'Suggested Name & Details',
			flex: 3,
			render: suggestion => {
				const isNameDifferent = suggestion.name !== suggestion.pointOfInterest.name;
				return (
					<View style={{paddingRight: 12}}>
						<Text style={[styles.suggestedText, isNameDifferent && styles.highlightText]} numberOfLines={1}>
							{suggestion.name}
						</Text>
						<Text style={styles.descriptionPreview} numberOfLines={1}>
							{suggestion.description}
						</Text>
					</View>
				);
			},
		},
		{
			key: 'status',
			title: 'Status',
			width: 100,
			render: suggestion => {
				let badgeStyle = styles.pendingBadge;
				let badgeTextStyle = styles.pendingBadgeText;

				if (suggestion.status === SuggestionStatusEnum.Approved) {
					badgeStyle = styles.approvedBadge;
					badgeTextStyle = styles.approvedBadgeText;
				} else if (suggestion.status === SuggestionStatusEnum.Rejected) {
					badgeStyle = styles.rejectedBadge;
					badgeTextStyle = styles.rejectedBadgeText;
				}

				return (
					<View style={[styles.statusBadge, badgeStyle]}>
						<Text style={[styles.statusBadgeText, badgeTextStyle]}>{suggestion.status}</Text>
					</View>
				);
			},
		},
		{
			key: 'action',
			width: 30,
			align: 'right',
			render: () => <Ionicons name="chevron-forward" size={18} color="#adb5bd" />,
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.filterRow}>
				{(['ALL', SuggestionStatusEnum.Pending, SuggestionStatusEnum.Approved, SuggestionStatusEnum.Rejected] as const).map(status => {
					const isSelected = statusFilter === status;
					return (
						<TouchableOpacity
							key={status}
							style={[styles.filterButton, isSelected && styles.filterButtonActive]}
							onPress={() => setStatusFilter(status)}
							activeOpacity={0.7}
						>
							<Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextActive]}>
								{status === 'ALL' ? 'All' : status}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			<Table
				data={suggestions}
				columns={columns}
				keyExtractor={s => s.id}
				emptyText="No suggested point of interest updates found."
				emptyIcon="bulb-outline"
				onRowPress={s => router.push(`/admin/suggested-updates/${s.id}`)}
			/>
			<Pagination limit={limit} itemCount={suggestions?.length || 0} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1},
	filterRow: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 16,
		flexWrap: 'wrap',
	},
	filterButton: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: '#f1f3f5',
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	filterButtonActive: {
		backgroundColor: '#0088cc',
		borderColor: '#0088cc',
	},
	filterButtonText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#495057',
	},
	filterButtonTextActive: {
		color: '#ffffff',
	},
	userName: {fontSize: 14, fontWeight: '600', color: '#212529'},
	userScore: {fontSize: 11, color: '#868e96', marginTop: 1},
	poiName: {fontSize: 14, fontWeight: '600', color: '#212529'},
	locationText: {fontSize: 11, color: '#868e96', marginTop: 1},
	suggestedText: {fontSize: 13, fontWeight: '500', color: '#343a40'},
	highlightText: {color: '#0088cc', fontWeight: '600'},
	descriptionPreview: {fontSize: 11, color: '#6c757d', marginTop: 2},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		alignSelf: 'flex-start',
	},
	statusBadgeText: {
		fontSize: 11,
		fontWeight: '600',
	},
	pendingBadge: {
		backgroundColor: '#fef3c7',
	},
	pendingBadgeText: {
		color: '#d97706',
	},
	approvedBadge: {
		backgroundColor: '#dcfce7',
	},
	approvedBadgeText: {
		color: '#16a34a',
	},
	rejectedBadge: {
		backgroundColor: '#fee2e2',
	},
	rejectedBadgeText: {
		color: '#dc2626',
	},
});
