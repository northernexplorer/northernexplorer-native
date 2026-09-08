import React, {useEffect, useState} from 'react';
import {GestureResponderEvent, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getImageUrl} from '@northernexplorer/tools';
import {ImageStatusEnum, ImageType} from '@northernexplorer/types';
import {config} from '~/config';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';

type PhotoGridItemProps = {
	image: ImageType;
	isMine: boolean;
	canManage: boolean;
	likeCount?: number;
	onSelect: () => void;
	onDelete: (imageId: string) => void;
	onLikeChanged?: () => void;
};

export function PhotoGridItem({image, isMine, canManage, likeCount = 0, onSelect, onDelete, onLikeChanged}: PhotoGridItemProps) {
	const authentication = useAuthentication();
	const [isLiked, setIsLiked] = useState<boolean>(false);

	const {mutate: likeMutation} = useApiMutation('location', 'ImageController', 'like');
	const {mutate: unlikeMutation} = useApiMutation('location', 'ImageController', 'unLike');

	const {data: hasLikedData, refetch: refetchLikeState} = useApiFetch('location', 'ImageController', 'hasLiked', {id: image.id});

	useEffect(() => {
		setIsLiked(Boolean(hasLikedData?.liked));
	}, [hasLikedData]);

	const isPending = image.status === ImageStatusEnum.Pending;

	const handleDeletePress = (e: GestureResponderEvent) => {
		e.stopPropagation();
		onDelete(image.id);
	};

	const handleToggleLike = async (e: GestureResponderEvent) => {
		e.stopPropagation();
		if (!authentication) return;

		const nextState = !isLiked;
		setIsLiked(nextState); // Optimistic UI update

		try {
			if (isLiked) {
				await unlikeMutation({id: image.id});
			} else {
				await likeMutation({id: image.id});
			}
			await refetchLikeState();
			onLikeChanged?.();
		} catch {
			setIsLiked(!nextState); // Revert on failure
		}
	};

	return (
		<Pressable style={styles.gridItem} onPress={onSelect}>
			<Image source={{uri: getImageUrl({path: image.url, cdn: config.CONTENT_DELIVERY_NETWORK})}} style={styles.thumbnail} />

			{isMine && (
				<View style={styles.gridMineBadge}>
					<Text style={styles.gridBadgeText}>Your Photo</Text>
				</View>
			)}

			{isPending && (
				<View style={styles.gridPendingBadge}>
					<Text style={styles.gridBadgeText}>Pending</Text>
				</View>
			)}

			{authentication && (
				<Pressable style={styles.gridLikeButton} onPress={handleToggleLike} hitSlop={8}>
					<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={12} color={isLiked ? '#ef4444' : '#64748b'} />
					{likeCount > 0 && <Text style={[styles.likeCountText, isLiked && styles.likedText]}>{likeCount}</Text>}
				</Pressable>
			)}

			{canManage && (
				<Pressable style={styles.gridDeleteButton} onPress={handleDeletePress} hitSlop={8}>
					<Ionicons name="trash-outline" size={13} color="#ef4444" />
				</Pressable>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	gridItem: {
		width: '31.5%',
		aspectRatio: 1,
		borderRadius: 8,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: '#f1f5f9',
		borderWidth: 1,
		borderColor: '#cbd5e1',
	},
	thumbnail: {
		width: '100%',
		height: '100%',
	},
	gridMineBadge: {
		position: 'absolute',
		top: 4,
		left: 4,
		backgroundColor: '#0284c7',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	gridPendingBadge: {
		position: 'absolute',
		bottom: 4,
		left: 4,
		backgroundColor: '#ea580c',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	gridBadgeText: {
		color: '#ffffff',
		fontSize: 9,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	gridLikeButton: {
		position: 'absolute',
		bottom: 4,
		right: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.92)',
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
		shadowColor: '#0f172a',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.15,
		shadowRadius: 2,
		elevation: 2,
	},
	likeCountText: {
		fontSize: 10,
		fontWeight: '700',
		color: '#64748b',
	},
	likedText: {
		color: '#ef4444',
	},
	gridDeleteButton: {
		position: 'absolute',
		top: 4,
		right: 4,
		backgroundColor: '#ffffff',
		padding: 4,
		borderRadius: 12,
		shadowColor: '#0f172a',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.15,
		shadowRadius: 2,
		elevation: 2,
	},
});
