import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {PointOfInterestType, ReviewRatingEnum} from '@northernexplorer/types';
import {formatName, Spinner} from '@northernexplorer/tools';
import CreateReview from './ReviewForm';
import {styles} from '~/location/PointOfInterestDetails/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type ReviewDetailsProps = {
	data: PointOfInterestType;
	loading: boolean;
	refetch: () => void;
	onEditReview?: (reviewId: string) => void;
};

function RenderStars({rating}: {rating: ReviewRatingEnum}) {
	return (
		<View style={reviewStyles.starRow}>
			{[1, 2, 3, 4, 5].map(starIndex => {
				const isFilled = rating >= starIndex;
				return <Ionicons key={starIndex} name={isFilled ? 'star' : 'star-outline'} size={16} color={isFilled ? '#ffb400' : '#cbd5e1'} />;
			})}
		</View>
	);
}

export function ReviewDetails({data, loading, refetch, onEditReview}: ReviewDetailsProps) {
	const authentication = useAuthentication();

	if (loading) return <Spinner />;

	const reviews = data.reviews ?? [];
	const myReviews = reviews.filter(r => r.user.id === authentication?.userId);
	const otherReviews = reviews.filter(r => r.user.id !== authentication?.userId);
	const userHasReviewed = myReviews.length > 0;

	return (
		<View style={reviewStyles.container}>
			{/* Show Review Creation Form at the top if User Hasn't Posted Yet */}
			{!userHasReviewed && <CreateReview refetch={refetch} />}

			{/* Reviews List Section Header */}
			<View style={reviewStyles.headerSection}>
				<Text style={styles.reviewTitle}>Community Reviews ({reviews.length})</Text>
			</View>

			{reviews.length === 0 ? (
				<View style={reviewStyles.emptyState}>
					<Ionicons name="chatbox-ellipses-outline" size={44} color="#cbd5e1" />
					<Text style={reviewStyles.emptyTitle}>No reviews yet</Text>
					<Text style={reviewStyles.emptySubtitle}>Be the first to share your experience exploring this location.</Text>
				</View>
			) : (
				<View style={reviewStyles.listContainer}>
					{/* Authenticated User's Reviews */}
					{myReviews.map(review => (
						<View key={review.id} style={[styles.reviewCard, reviewStyles.myReviewCard]}>
							<View style={styles.headerRow}>
								<View style={reviewStyles.userInfo}>
									<View style={reviewStyles.avatarCircle}>
										<Text style={reviewStyles.avatarText}>{review.user.username.charAt(0).toUpperCase() || 'U'}</Text>
									</View>
									<View>
										<View style={reviewStyles.nameBadgeRow}>
											<Text style={styles.userName}>{formatName(review.user)}</Text>
											<View style={reviewStyles.youBadge}>
												<Text style={reviewStyles.youBadgeText}>Your Review</Text>
											</View>
										</View>
										<RenderStars rating={review.rating} />
									</View>
								</View>

								{onEditReview && (
									<Pressable onPress={() => onEditReview(review.id)} style={styles.editButton} hitSlop={8}>
										<Text style={styles.editButtonText}>Edit</Text>
									</Pressable>
								)}
							</View>

							<Text style={styles.description}>{review.description}</Text>
						</View>
					))}

					{/* Other Users' Reviews */}
					{otherReviews.map(review => (
						<View key={review.id} style={styles.reviewCard}>
							<View style={styles.headerRow}>
								<View style={reviewStyles.userInfo}>
									<View style={[reviewStyles.avatarCircle, reviewStyles.otherAvatarCircle]}>
										<Text style={reviewStyles.avatarText}>{review.user.username.charAt(0).toUpperCase() || 'U'}</Text>
									</View>
									<View>
										<Text style={styles.userName}>{formatName(review.user)}</Text>
										<RenderStars rating={review.rating} />
									</View>
								</View>

								{review.user.score && (
									<View style={reviewStyles.scoreTag}>
										<Ionicons name="ribbon-outline" size={12} color="#0088cc" />
										<Text style={reviewStyles.scoreTagText}>{review.user.score}</Text>
									</View>
								)}
							</View>

							<Text style={styles.description}>{review.description}</Text>
						</View>
					))}
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
	},
	avatarCircle: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: '#0088cc',
		alignItems: 'center',
		justifyContent: 'center',
	},
	otherAvatarCircle: {
		backgroundColor: '#64748b',
	},
	avatarText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 15,
	},
	nameBadgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
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
	starRow: {
		flexDirection: 'row',
		gap: 2,
		marginTop: 2,
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
		backgroundColor: '#ffffff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#f1f5f9',
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
