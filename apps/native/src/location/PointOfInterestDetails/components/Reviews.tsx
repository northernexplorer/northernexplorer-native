import React, {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {formatName} from '@northernexplorer/tools-web';
import {PointOfInterestType, ReviewStatusEnum, RolesEnum} from '@northernexplorer/types';
import {useRouter} from 'expo-router';
import {ReviewForm} from './ReviewForm';
import {RenderStars} from './RenderStars';
import {ReviewMetadataBadges} from './ReviewMetadataBadges';
import {ReviewLikes} from './ReviewLikes';
import {useApiMutation} from '~/core/useApiMutation';
import {styles as globalStyles} from '~/location/PointOfInterestDetails/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {alertStore} from '~/core/alertStore';
import {UserAvatar} from '~/layout/Layout/components/UserAvatar';

type ReviewsProps = {
	data: PointOfInterestType;
	refetch: () => void;
};

export function Reviews({data, refetch}: ReviewsProps) {
	const router = useRouter();
	const authentication = useAuthentication();
	const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
	const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

	const deleteMutation = useApiMutation('location', 'ReviewController', 'deleteReview');
	const reviews = data.reviews ?? [];
	const myReviews = reviews.filter(r => r.user.id === authentication?.userId);
	const otherReviews = reviews.filter(r => r.user.id !== authentication?.userId);
	const userHasReviewed = myReviews.length > 0;

	const isAdmin = authentication?.roles?.includes(RolesEnum.Admin);

	const handleSuccess = () => {
		setEditingReviewId(null);
		refetch();
	};

	const navigateToProfile = (username: string) => {
		if (username) {
			router.push(`/user/${username}`);
		}
	};

	const handleDelete = (reviewId: string) => {
		alertStore.showAlert({
			title: 'Delete Review',
			message: 'Are you sure you want to delete this review? This action cannot be undone.',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setDeletingReviewId(reviewId);
						await deleteMutation.mutate({id: reviewId});
						refetch();
					},
				},
			],
		});
	};

	const renderReviewCard = (review: NonNullable<PointOfInterestType['reviews']>[number], isMine = false) => {
		const isPending = review.status === ReviewStatusEnum.Pending;
		const canManageReview = isAdmin || review.user.id === authentication?.userId;
		const isDeleting = deletingReviewId === review.id;

		if (editingReviewId === review.id) {
			return (
				<View key={review.id} style={globalStyles.reviewCard}>
					<ReviewForm initialData={review} refetch={handleSuccess} onCancel={() => setEditingReviewId(null)} />
				</View>
			);
		}

		return (
			<View key={review.id} style={[globalStyles.reviewCard, isMine && reviewStyles.myReviewCard]}>
				<View style={globalStyles.headerRow}>
					<View style={reviewStyles.userInfo}>
						<UserAvatar username={review.user.username} onPress={() => navigateToProfile(review.user.username)} />
						<View style={reviewStyles.userDetails}>
							<View style={reviewStyles.nameBadgeRow}>
								<Pressable onPress={() => navigateToProfile(review.user.username)} style={reviewStyles.namePressable}>
									<Text style={globalStyles.userName} numberOfLines={1} ellipsizeMode="tail">
										{formatName(review.user)}
									</Text>
								</Pressable>
								{isMine && (
									<View style={reviewStyles.youBadge}>
										<Text style={reviewStyles.youBadgeText}>Your Review</Text>
									</View>
								)}
								{isMine && isPending && (
									<View style={reviewStyles.pendingBadge}>
										<Text style={reviewStyles.pendingBadgeText}>Pending</Text>
									</View>
								)}
							</View>
							<RenderStars rating={review.rating} />
						</View>
					</View>

					<View style={reviewStyles.rightHeaderContainer}>
						<View style={reviewStyles.scoreTag}>
							<Ionicons name="ribbon-outline" size={12} color="#0088cc" />
							<Text style={reviewStyles.scoreTagText}>{review.user.score}</Text>
						</View>

						{canManageReview && (
							<>
								<Pressable onPress={() => setEditingReviewId(review.id)} style={reviewStyles.editButton} hitSlop={8}>
									<Ionicons name="pencil" size={14} color="#0088cc" />
									<Text style={reviewStyles.editButtonText}>Edit</Text>
								</Pressable>

								<Pressable
									onPress={() => handleDelete(review.id)}
									disabled={isDeleting}
									style={reviewStyles.deleteButton}
									hitSlop={8}
								>
									{isDeleting ? (
										<ActivityIndicator size="small" color="#ef4444" />
									) : (
										<Ionicons name="trash-outline" size={15} color="#ef4444" />
									)}
								</Pressable>
							</>
						)}
					</View>
				</View>

				<ReviewMetadataBadges difficulty={review.difficulty} entranceCost={review.entranceCost} conditions={review.conditions} />

				<Text style={globalStyles.description}>{review.description}</Text>
				<ReviewLikes reviewId={review.id} currentUserId={authentication?.userId} />
			</View>
		);
	};

	return (
		<View style={reviewStyles.container}>
			{!userHasReviewed && <ReviewForm refetch={refetch} />}

			<View style={reviewStyles.headerSection}>
				<Text style={globalStyles.reviewTitle}>Community Reviews ({reviews.length})</Text>
			</View>

			{reviews.length === 0 ? (
				<View style={reviewStyles.emptyState}>
					<Ionicons name="chatbox-ellipses-outline" size={44} color="#cbd5e1" />
					<Text style={reviewStyles.emptyTitle}>No reviews yet</Text>
					<Text style={reviewStyles.emptySubtitle}>Be the first to share your experience exploring this location.</Text>
				</View>
			) : (
				<View style={reviewStyles.listContainer}>
					{myReviews.map(r => renderReviewCard(r, true))}
					{otherReviews.map(r => renderReviewCard(r, false))}
				</View>
			)}
		</View>
	);
}

const reviewStyles = StyleSheet.create({
	container: {
		marginVertical: 12,
	},
	headerSection: {
		marginTop: 16,
		marginBottom: 12,
	},
	listContainer: {
		gap: 12,
	},
	myReviewCard: {
		borderColor: '#bae6fd',
		backgroundColor: '#f0f9ff',
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		flex: 1, // Takes remaining width and restricts child expanding
		marginRight: 8,
	},
	userDetails: {
		flex: 1, // Ensures name and badges drop into bounded width
	},
	rightHeaderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		flexShrink: 0, // Keeps buttons intact without squishing
	},
	namePressable: {
		flexShrink: 1,
	},
	editButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: '#e0f2fe',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	editButtonText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#0088cc',
	},
	deleteButton: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fef2f2',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	nameBadgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 6,
	},
	youBadge: {
		backgroundColor: '#e0f2fe',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	youBadgeText: {
		color: '#0369a1',
		fontSize: 10,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	pendingBadge: {
		backgroundColor: '#fef3c7',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	pendingBadgeText: {
		color: '#b45309',
		fontSize: 10,
		fontWeight: '700',
		textTransform: 'uppercase',
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
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderStyle: 'dashed',
		marginVertical: 8,
	},
	emptyTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#0f172a',
		marginTop: 10,
	},
	emptySubtitle: {
		fontSize: 13,
		color: '#64748b',
		textAlign: 'center',
		marginTop: 4,
		maxWidth: 280,
	},
});
