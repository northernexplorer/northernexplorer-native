import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {EntranceCostEnum, ReviewRatingEnum, SiteConditionEnum, SiteDifficultyEnum} from '@northernexplorer/types';
import {Spinner} from '@northernexplorer/tools';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';

export const PendingReview: React.FC = () => {
	const {id} = useLocalSearchParams<{id: string}>();

	const {data: review, loading: isLoadingData} = useApiFetch('location', 'ReviewController', 'getReviewById', {id});

	const {mutate: approveReview, loading: isApproving} = useApiMutation('location', 'ReviewController', 'approveReview');

	const {mutate: rejectReview, loading: isRejecting} = useApiMutation('location', 'ReviewController', 'rejectReview');

	const handleApprove = async () => {
		await approveReview({id});
		alertStore.showAlert({
			title: 'Success',
			message: 'Review approved successfully.',
			type: 'success',
			buttons: [{text: 'OK', onPress: () => router.back()}],
		});
	};

	const handleReject = () => {
		alertStore.showAlert({
			title: 'Reject Review',
			type: 'warning',
			message: 'Are you sure you want to reject and delete this review submission?',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Reject',
					style: 'destructive',
					onPress: async () => {
						await rejectReview({id});
						alertStore.showAlert({
							title: 'Success',
							message: 'Review rejected and removed.',
							type: 'success',
							buttons: [{text: 'OK', onPress: () => router.back()}],
						});
					},
				},
			],
		});
	};

	if (isLoadingData || !review) return <Spinner />;

	const isActionLoading = isApproving || isRejecting;

	const COST_LABELS: Record<EntranceCostEnum, string> = {
		[EntranceCostEnum.FREE]: 'Free',
		[EntranceCostEnum.TIER_1_10]: '$1 – $10',
		[EntranceCostEnum.TIER_11_25]: '$11 – $25',
		[EntranceCostEnum.TIER_26_50]: '$26 – $50',
		[EntranceCostEnum.TIER_50_PLUS]: '$50+',
	};

	return (
		<View style={styles.card}>
			<View style={styles.headerRow}>
				<View style={styles.userInfo}>
					<Text style={styles.username}>{review.user.username}</Text>
					<Text style={styles.userScore}>★ {review.user.score} pts</Text>
				</View>
				<Text style={styles.poiName}>{review.pointOfInterest.name}</Text>
			</View>

			<View style={styles.ratingRow}>
				<Text style={styles.ratingStars}>
					{'★'.repeat(review.rating)}
					{'☆'.repeat(5 - review.rating)}
				</Text>
				<Text style={styles.ratingText}>
					{ReviewRatingEnum[review.rating]} ({review.rating}/5)
				</Text>
			</View>

			<Text style={styles.description}>{review.description}</Text>

			<View style={styles.badgeContainer}>
				{review.difficulty && (
					<View style={[styles.badge, styles.difficultyBadge]}>
						<Text style={styles.badgeText}>Diff: {SiteDifficultyEnum[review.difficulty]}</Text>
					</View>
				)}
				{review.entranceCost && (
					<View style={[styles.badge, styles.costBadge]}>
						<Text style={styles.badgeText}>Cost: {COST_LABELS[review.entranceCost]}</Text>
					</View>
				)}
				{review.conditions?.map((cond: SiteConditionEnum) => (
					<View key={cond} style={[styles.badge, styles.conditionBadge]}>
						<Text style={styles.conditionBadgeText}>{cond.replace(/_/g, ' ')}</Text>
					</View>
				))}
			</View>

			<View style={styles.actionRow}>
				<TouchableOpacity
					style={[styles.button, styles.rejectButton, isActionLoading && styles.disabledButton]}
					onPress={handleReject}
					disabled={isActionLoading}
				>
					{isRejecting ? <ActivityIndicator size="small" color="#EF4444" /> : <Text style={styles.rejectButtonText}>Reject</Text>}
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, styles.approveButton, isActionLoading && styles.disabledButton]}
					onPress={handleApprove}
					disabled={isActionLoading}
				>
					{isApproving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.approveButtonText}>Approve Review</Text>}
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#1E293B',
		borderRadius: 12,
		padding: 16,
		marginVertical: 8,
		borderWidth: 1,
		borderColor: '#334155',
	},
	centerContent: {
		minHeight: 120,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		color: '#EF4444',
		fontSize: 14,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	username: {
		color: '#F8FAFC',
		fontSize: 16,
		fontWeight: '700',
	},
	userScore: {
		color: '#F59E0B',
		fontSize: 13,
		fontWeight: '600',
		backgroundColor: '#451A03',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
	},
	poiName: {
		color: '#94A3B8',
		fontSize: 14,
		fontWeight: '500',
		maxWidth: '40%',
		textAlign: 'right',
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
		gap: 8,
	},
	ratingStars: {
		color: '#F59E0B',
		fontSize: 18,
		letterSpacing: 2,
	},
	ratingText: {
		color: '#CBD5E1',
		fontSize: 13,
	},
	description: {
		color: '#E2E8F0',
		fontSize: 15,
		lineHeight: 22,
		marginBottom: 12,
	},
	badgeContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
		marginBottom: 16,
	},
	badge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
	},
	difficultyBadge: {
		backgroundColor: '#3B82F620',
		borderWidth: 1,
		borderColor: '#3B82F6',
	},
	costBadge: {
		backgroundColor: '#10B98120',
		borderWidth: 1,
		borderColor: '#10B981',
	},
	conditionBadge: {
		backgroundColor: '#334155',
	},
	badgeText: {
		color: '#F8FAFC',
		fontSize: 12,
		fontWeight: '600',
	},
	conditionBadgeText: {
		color: '#94A3B8',
		fontSize: 12,
		fontWeight: '500',
	},
	actionRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 12,
		borderTopWidth: 1,
		borderTopColor: '#334155',
		paddingTop: 12,
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 18,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 100,
	},
	disabledButton: {
		opacity: 0.6,
	},
	approveButton: {
		backgroundColor: '#16A34A',
	},
	approveButtonText: {
		color: '#FFFFFF',
		fontWeight: '700',
		fontSize: 14,
	},
	rejectButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#EF4444',
	},
	rejectButtonText: {
		color: '#EF4444',
		fontWeight: '600',
		fontSize: 14,
	},
});
