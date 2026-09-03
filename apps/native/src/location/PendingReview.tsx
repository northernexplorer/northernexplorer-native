import React, {useMemo} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {formatName, Spinner} from '@northernexplorer/tools';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';
import {styles as globalStyles} from '~/location/PointOfInterestDetails/styles';
import {ReviewMetadataBadges} from '~/location/PointOfInterestDetails/components/ReviewMetadataBadges';
import {RenderStars} from '~/location/PointOfInterestDetails/components/RenderStars';

export const PendingReview: React.FC = () => {
	const {id} = useLocalSearchParams<{id: string}>();

	const {data: review, loading: isLoadingData} = useApiFetch('location', 'ReviewController', 'getReviewById', {id});

	const {mutate: approveReview, loading: isApproving} = useApiMutation('location', 'ReviewController', 'approveReview');

	const {mutate: rejectReview, loading: isRejecting} = useApiMutation('location', 'ReviewController', 'rejectReview');

	const handleApprovePress = () => {
		alertStore.showAlert({
			title: 'Approve Review',
			message: 'Are you sure you want to approve this review? The submitter will receive +10 user score.',
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
						await approveReview({id});
						alertStore.showAlert({
							title: 'Success',
							message: 'Review approved successfully.',
							type: 'success',
							buttons: [{text: 'OK', onPress: () => router.back()}],
						});
					},
				},
			],
		});
	};

	const handleRejectPress = () => {
		alertStore.showAlert({
			title: 'Reject Review',
			message: 'Are you sure you want to reject and permanently delete this review? This action cannot be undone.',
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

	return (
		<View style={[globalStyles.reviewCard, pendingStyles.card]}>
			<View style={pendingStyles.poiHeaderRow}>
				<Text style={pendingStyles.poiName}>{review.pointOfInterest.name}</Text>
				<View style={pendingStyles.pendingBadge}>
					<Text style={pendingStyles.pendingBadgeText}>Pending Review</Text>
				</View>
			</View>

			<View style={globalStyles.headerRow}>
				<View style={pendingStyles.userInfo}>
					<View style={pendingStyles.avatarCircle}>
						<Text style={pendingStyles.avatarText}>{review.user.username.charAt(0).toUpperCase() || 'U'}</Text>
					</View>
					<View>
						<Text style={globalStyles.userName}>{formatName(review.user)}</Text>
						<RenderStars rating={review.rating} />
					</View>
				</View>

				<View style={pendingStyles.scoreTag}>
					<Ionicons name="ribbon-outline" size={12} color="#0088cc" />
					<Text style={pendingStyles.scoreTagText}>{review.user.score}</Text>
				</View>
			</View>

			<ReviewMetadataBadges difficulty={review.difficulty} entranceCost={review.entranceCost} conditions={review.conditions} />

			<Text style={globalStyles.description}>{review.description}</Text>

			<View style={pendingStyles.actionRow}>
				<Pressable
					style={[pendingStyles.button, pendingStyles.rejectButton, isActionLoading && pendingStyles.disabledButton]}
					onPress={handleRejectPress}
					disabled={isActionLoading}
				>
					{isRejecting ? <ActivityIndicator size="small" color="#ef4444" /> : <Text style={pendingStyles.rejectButtonText}>Reject</Text>}
				</Pressable>

				<Pressable
					style={[pendingStyles.button, pendingStyles.approveButton, isActionLoading && pendingStyles.disabledButton]}
					onPress={handleApprovePress}
					disabled={isActionLoading}
				>
					{isApproving ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={pendingStyles.approveButtonText}>Approve</Text>}
				</Pressable>
			</View>
		</View>
	);
};

const pendingStyles = StyleSheet.create({
	card: {
		marginVertical: 8,
	},
	poiHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	poiName: {
		fontSize: 15,
		fontWeight: '700',
		color: '#0f172a',
		flex: 1,
	},
	pendingBadge: {
		backgroundColor: '#fef3c7',
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	pendingBadgeText: {
		color: '#d97706',
		fontSize: 11,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	avatarCircle: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: '#64748b',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 15,
	},
	scoreTag: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: '#f1f5f9',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	scoreTagText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#0088cc',
	},
	actionRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 12,
		borderTopWidth: 1,
		borderTopColor: '#f1f5f9',
		paddingTop: 12,
		marginTop: 8,
	},
	button: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 90,
	},
	disabledButton: {
		opacity: 0.6,
	},
	approveButton: {
		backgroundColor: '#16a34a',
	},
	approveButtonText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 13,
	},
	rejectButton: {
		backgroundColor: '#fef2f2',
		borderWidth: 1,
		borderColor: '#fca5a5',
	},
	rejectButtonText: {
		color: '#dc2626',
		fontWeight: '600',
		fontSize: 13,
	},
});
