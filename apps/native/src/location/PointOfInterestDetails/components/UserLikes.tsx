import {Ionicons} from '@expo/vector-icons';
import {useEffect, useState} from 'react';
import {Pressable, Text, GestureResponderEvent, StyleSheet} from 'react-native';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';

type UserLikesProps = {
	currentUserId: string;
	reviewId: string;
};

export default function UserLikes({currentUserId, reviewId}: UserLikesProps) {
	const [isLiked, setIsLiked] = useState<boolean>(false);

	const {mutate: likeMutation} = useApiMutation('location', 'ReviewController', 'like');

	const {mutate: unlikeMutation} = useApiMutation('location', 'ReviewController', 'unLike');

	const {data: hasLikedData, refetch: refetchLikeState} = useApiFetch('location', 'ReviewController', 'hasLiked', {id: reviewId});
	const {data: reviewData, refetch: refetchReview} = useApiFetch('location', 'ReviewController', 'getReviewById', {id: reviewId});

	useEffect(() => {
		setIsLiked(Boolean(hasLikedData?.liked));
	}, [hasLikedData]);

	const handleLikeToggle = async (e: GestureResponderEvent) => {
		e.stopPropagation();
		if (!currentUserId || !reviewData) return;

		const nextState = !isLiked;
		setIsLiked(nextState);

		if (isLiked) {
			await unlikeMutation({id: reviewData.id});
		} else {
			await likeMutation({id: reviewData.id});
		}
		await Promise.all([refetchLikeState(), refetchReview()]);
	};

	return (
		<>
			{currentUserId && (
				<Pressable onPress={handleLikeToggle} style={[styles.likeButton, isLiked && styles.likeButtonActive]}>
					<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#ef4444' : '#0088cc'} />
					<Text style={styles.likeCount}>{reviewData?.likes}</Text>
				</Pressable>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	likeButton: {
		marginTop: 10,
		width: 60,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(7, 12, 32, 0.12)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	likeButtonActive: {
		backgroundColor: 'rgba(239, 68, 68, 0.15)',
	},
	likeCount: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
	},
});
