import React from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {formatName, Spinner} from '@northernexplorer/tools-web';
import {SuggestionStatusEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';

export function SuggestedUpdateDetails() {
	const {id} = useLocalSearchParams<{id: string}>();

	const {data: suggestion, loading: isLoadingData} = useApiFetch('location', 'PointOfInterestSuggestionController', 'getById', {id});

	const {mutate: approve, loading: isApproving} = useApiMutation('location', 'PointOfInterestSuggestionController', 'approve');

	const {mutate: reject, loading: isRejecting} = useApiMutation('location', 'PointOfInterestSuggestionController', 'reject');

	if (isLoadingData || !suggestion) return <Spinner />;

	const isActionLoading = isApproving || isRejecting;
	const isPending = suggestion.status === SuggestionStatusEnum.Pending;

	const handleApprovePress = () => {
		alertStore.showAlert({
			title: 'Approve Suggestion',
			message:
				'Are you sure you want to approve this suggested update? The Point of Interest will be updated and the submitter will receive +10 user score.',
			type: 'warning',
			buttons: [
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Approve',
					style: 'default',
					onPress: async () => {
						const res = await approve({id});
						if (res?.success) {
							alertStore.showAlert({
								title: 'Success',
								message: 'Suggested update approved and applied to Point of Interest.',
								type: 'success',
								buttons: [{text: 'OK', onPress: () => router.back()}],
							});
						}
					},
				},
			],
		});
	};

	const handleRejectPress = () => {
		alertStore.showAlert({
			title: 'Reject Suggestion',
			message: 'Are you sure you want to reject this suggested update?',
			type: 'warning',
			buttons: [
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Reject',
					style: 'destructive',
					onPress: async () => {
						const res = await reject({id});
						if (res?.success) {
							alertStore.showAlert({
								title: 'Success',
								message: 'Suggested update rejected.',
								type: 'success',
								buttons: [{text: 'OK', onPress: () => router.back()}],
							});
						}
					},
				},
			],
		});
	};

	const poi = suggestion.pointOfInterest;

	const isNameChanged = suggestion.name !== poi.name;
	const isDescriptionChanged = suggestion.description !== poi.description;
	const isCoordsChanged = suggestion.lat !== poi.lat || suggestion.lon !== poi.lon;
	const isCountryChanged = suggestion.country.id !== poi.country.id;
	const isRegionChanged = suggestion.region.id !== poi.region.id;
	const isOrgChanged = suggestion.organization.id !== poi.organization.id;
	const isDatesChanged = suggestion.startDate !== poi.startDate || suggestion.endDate !== poi.endDate;
	const isTypeChanged = JSON.stringify(suggestion.type) !== JSON.stringify(poi.type);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			{/* Top Header Card */}
			<View style={styles.card}>
				<View style={styles.headerRow}>
					<View style={{flex: 1}}>
						<Text style={styles.subTitle}>Target Point of Interest</Text>
						<Text style={styles.title}>{poi.name}</Text>
						<Text style={styles.breadcrumbs}>
							{poi.country.name} › {poi.region.name}
						</Text>
					</View>

					<View
						style={[
							styles.statusBadge,
							suggestion.status === SuggestionStatusEnum.Pending && styles.pendingBadge,
							suggestion.status === SuggestionStatusEnum.Approved && styles.approvedBadge,
							suggestion.status === SuggestionStatusEnum.Rejected && styles.rejectedBadge,
						]}
					>
						<Text
							style={[
								styles.statusBadgeText,
								suggestion.status === SuggestionStatusEnum.Pending && styles.pendingBadgeText,
								suggestion.status === SuggestionStatusEnum.Approved && styles.approvedBadgeText,
								suggestion.status === SuggestionStatusEnum.Rejected && styles.rejectedBadgeText,
							]}
						>
							{suggestion.status}
						</Text>
					</View>
				</View>

				{/* Submitter Info */}
				<View style={styles.submitterSection}>
					<View style={styles.avatarCircle}>
						<Text style={styles.avatarText}>{suggestion.user.username.charAt(0).toUpperCase() || 'U'}</Text>
					</View>
					<View style={{flex: 1}}>
						<Text style={styles.submitterName}>{formatName(suggestion.user)}</Text>
						<Text style={styles.submitterUsername}>@{suggestion.user.username}</Text>
					</View>
					<View style={styles.scoreTag}>
						<Ionicons name="ribbon-outline" size={14} color="#0088cc" />
						<Text style={styles.scoreTagText}>{suggestion.user.score} pts</Text>
					</View>
				</View>
			</View>

			{/* Comparison Section */}
			<Text style={styles.sectionHeading}>Suggested Changes</Text>

			{/* Name Field Comparison */}
			<View style={[styles.fieldCard, isNameChanged && styles.fieldCardChanged]}>
				<View style={styles.fieldHeader}>
					<Text style={styles.fieldLabel}>Site Name</Text>
					{isNameChanged ? (
						<View style={styles.changedBadge}>
							<Text style={styles.changedBadgeText}>Modified</Text>
						</View>
					) : (
						<Text style={styles.unchangedText}>Unchanged</Text>
					)}
				</View>
				<View style={styles.compareRow}>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Current</Text>
						<Text style={styles.currentValue}>{poi.name}</Text>
					</View>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Suggested</Text>
						<Text style={[styles.suggestedValue, isNameChanged && styles.changedValueHighlight]}>{suggestion.name}</Text>
					</View>
				</View>
			</View>

			{/* Location Field Comparison */}
			<View style={[styles.fieldCard, (isCountryChanged || isRegionChanged) && styles.fieldCardChanged]}>
				<View style={styles.fieldHeader}>
					<Text style={styles.fieldLabel}>Country & Region</Text>
					{isCountryChanged || isRegionChanged ? (
						<View style={styles.changedBadge}>
							<Text style={styles.changedBadgeText}>Modified</Text>
						</View>
					) : (
						<Text style={styles.unchangedText}>Unchanged</Text>
					)}
				</View>
				<View style={styles.compareRow}>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Current</Text>
						<Text style={styles.currentValue}>
							{poi.country.name} › {poi.region.name}
						</Text>
					</View>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Suggested</Text>
						<Text style={[styles.suggestedValue, (isCountryChanged || isRegionChanged) && styles.changedValueHighlight]}>
							{suggestion.country.name} › {suggestion.region.name}
						</Text>
					</View>
				</View>
			</View>

			{/* Organization Field Comparison */}
			<View style={[styles.fieldCard, isOrgChanged && styles.fieldCardChanged]}>
				<View style={styles.fieldHeader}>
					<Text style={styles.fieldLabel}>Organization</Text>
					{isOrgChanged ? (
						<View style={styles.changedBadge}>
							<Text style={styles.changedBadgeText}>Modified</Text>
						</View>
					) : (
						<Text style={styles.unchangedText}>Unchanged</Text>
					)}
				</View>
				<View style={styles.compareRow}>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Current</Text>
						<Text style={styles.currentValue}>{poi.organization.name || 'None'}</Text>
					</View>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Suggested</Text>
						<Text style={[styles.suggestedValue, isOrgChanged && styles.changedValueHighlight]}>
							{suggestion.organization.name || 'None'}
						</Text>
					</View>
				</View>
			</View>

			{/* Coordinates Field Comparison */}
			<View style={[styles.fieldCard, isCoordsChanged && styles.fieldCardChanged]}>
				<View style={styles.fieldHeader}>
					<Text style={styles.fieldLabel}>Coordinates</Text>
					{isCoordsChanged ? (
						<View style={styles.changedBadge}>
							<Text style={styles.changedBadgeText}>Modified</Text>
						</View>
					) : (
						<Text style={styles.unchangedText}>Unchanged</Text>
					)}
				</View>
				<View style={styles.compareRow}>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Current</Text>
						<Text style={styles.currentValue}>
							{poi.lat}°, {poi.lon}°
						</Text>
					</View>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Suggested</Text>
						<Text style={[styles.suggestedValue, isCoordsChanged && styles.changedValueHighlight]}>
							{suggestion.lat}°, {suggestion.lon}°
						</Text>
					</View>
				</View>
			</View>

			{/* Type Field Comparison */}
			<View style={[styles.fieldCard, isTypeChanged && styles.fieldCardChanged]}>
				<View style={styles.fieldHeader}>
					<Text style={styles.fieldLabel}>Type</Text>
					{isTypeChanged ? (
						<View style={styles.changedBadge}>
							<Text style={styles.changedBadgeText}>Modified</Text>
						</View>
					) : (
						<Text style={styles.unchangedText}>Unchanged</Text>
					)}
				</View>
				<View style={styles.compareRow}>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Current</Text>
						<Text style={styles.currentValue}>{Array.isArray(poi.type) ? poi.type.join(', ') : 'None'}</Text>
					</View>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Suggested</Text>
						<Text style={[styles.suggestedValue, isTypeChanged && styles.changedValueHighlight]}>
							{Array.isArray(suggestion.type) ? suggestion.type.join(', ') : 'None'}
						</Text>
					</View>
				</View>
			</View>

			{/* Dates Field Comparison */}
			<View style={[styles.fieldCard, isDatesChanged && styles.fieldCardChanged]}>
				<View style={styles.fieldHeader}>
					<Text style={styles.fieldLabel}>Active Years</Text>
					{isDatesChanged ? (
						<View style={styles.changedBadge}>
							<Text style={styles.changedBadgeText}>Modified</Text>
						</View>
					) : (
						<Text style={styles.unchangedText}>Unchanged</Text>
					)}
				</View>
				<View style={styles.compareRow}>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Current</Text>
						<Text style={styles.currentValue}>
							{poi.startDate || 'Unknown'} - {poi.endDate || 'Unknown'}
						</Text>
					</View>
					<View style={styles.compareCol}>
						<Text style={styles.compareLabel}>Suggested</Text>
						<Text style={[styles.suggestedValue, isDatesChanged && styles.changedValueHighlight]}>
							{suggestion.startDate || 'Unknown'} - {suggestion.endDate || 'Unknown'}
						</Text>
					</View>
				</View>
			</View>

			{/* Description Field Comparison */}
			<View style={[styles.fieldCard, isDescriptionChanged && styles.fieldCardChanged]}>
				<View style={styles.fieldHeader}>
					<Text style={styles.fieldLabel}>Description</Text>
					{isDescriptionChanged ? (
						<View style={styles.changedBadge}>
							<Text style={styles.changedBadgeText}>Modified</Text>
						</View>
					) : (
						<Text style={styles.unchangedText}>Unchanged</Text>
					)}
				</View>
				<View style={styles.compareRowStacked}>
					<View style={styles.stackedBlock}>
						<Text style={styles.compareLabel}>Current</Text>
						<Text style={styles.currentValue}>{poi.description}</Text>
					</View>
					<View style={[styles.stackedBlock, isDescriptionChanged && styles.stackedBlockHighlight]}>
						<Text style={styles.compareLabel}>Suggested</Text>
						<Text style={[styles.suggestedValue, isDescriptionChanged && styles.changedValueHighlight]}>{suggestion.description}</Text>
					</View>
				</View>
			</View>

			{/* Actions Footer */}
			{isPending && (
				<View style={styles.actionRow}>
					<Pressable
						style={[styles.button, styles.rejectButton, isActionLoading && styles.disabledButton]}
						onPress={handleRejectPress}
						disabled={isActionLoading}
					>
						{isRejecting ? (
							<ActivityIndicator color="#FFFFFF" size="small" />
						) : (
							<>
								<Ionicons name="close-circle-outline" size={18} color="#FFFFFF" />
								<Text style={styles.buttonText}>Reject Suggestion</Text>
							</>
						)}
					</Pressable>

					<Pressable
						style={[styles.button, styles.approveButton, isActionLoading && styles.disabledButton]}
						onPress={handleApprovePress}
						disabled={isActionLoading}
					>
						{isApproving ? (
							<ActivityIndicator color="#FFFFFF" size="small" />
						) : (
							<>
								<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
								<Text style={styles.buttonText}>Approve & Apply</Text>
							</>
						)}
					</Pressable>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1},
	contentContainer: {paddingBottom: 40},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#e9ecef',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 12,
	},
	subTitle: {
		fontSize: 12,
		fontWeight: '600',
		color: '#868e96',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		color: '#212529',
		marginVertical: 4,
	},
	breadcrumbs: {
		fontSize: 13,
		color: '#6c757d',
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 8,
	},
	statusBadgeText: {
		fontSize: 12,
		fontWeight: '700',
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
	submitterSection: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#f1f3f5',
		gap: 12,
	},
	avatarCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#e0f2fe',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#0284c7',
	},
	submitterName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#212529',
	},
	submitterUsername: {
		fontSize: 12,
		color: '#868e96',
	},
	scoreTag: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: '#f0f9ff',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#bae6fd',
	},
	scoreTagText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#0088cc',
	},
	sectionHeading: {
		fontSize: 18,
		fontWeight: '700',
		color: '#212529',
		marginBottom: 12,
	},
	fieldCard: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	fieldCardChanged: {
		borderColor: '#bae6fd',
		backgroundColor: '#fafcff',
	},
	fieldHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	fieldLabel: {
		fontSize: 14,
		fontWeight: '700',
		color: '#343a40',
	},
	changedBadge: {
		backgroundColor: '#e0f2fe',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	changedBadgeText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#0284c7',
	},
	unchangedText: {
		fontSize: 11,
		color: '#adb5bd',
	},
	compareRow: {
		flexDirection: 'row',
		gap: 16,
	},
	compareCol: {
		flex: 1,
	},
	compareRowStacked: {
		gap: 12,
	},
	stackedBlock: {
		padding: 10,
		backgroundColor: '#f8f9fa',
		borderRadius: 8,
	},
	stackedBlockHighlight: {
		backgroundColor: '#f0f9ff',
		borderWidth: 1,
		borderColor: '#e0f2fe',
	},
	compareLabel: {
		fontSize: 11,
		fontWeight: '600',
		color: '#868e96',
		marginBottom: 4,
		textTransform: 'uppercase',
	},
	currentValue: {
		fontSize: 14,
		color: '#495057',
		lineHeight: 20,
	},
	suggestedValue: {
		fontSize: 14,
		color: '#212529',
		lineHeight: 20,
	},
	changedValueHighlight: {
		color: '#0284c7',
		fontWeight: '600',
	},
	actionRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 20,
	},
	button: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 14,
		borderRadius: 8,
	},
	approveButton: {
		backgroundColor: '#16a34a',
	},
	rejectButton: {
		backgroundColor: '#dc2626',
	},
	buttonText: {
		fontSize: 15,
		fontWeight: '600',
		color: '#ffffff',
	},
	disabledButton: {
		opacity: 0.6,
	},
});
