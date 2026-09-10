import React, {useEffect, useState} from 'react';
import {ActivityIndicator, GestureResponderEvent, Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {formatName, getImageUrl} from '@northernexplorer/tools';
import {config} from '~/config';
import {useApiMutation} from '~/core/useApiMutation';
import {useApiFetch} from '~/core/useApiFetch';
import {UserAvatar} from '~/layout/Layout/components/UserAvatar';

type PhotoPreviewModalProps = {
	selectedImageId: string;
	selectedIndex: number;
	totalImages: number;
	currentUserId?: string;
	isAdmin?: boolean;
	deletingImageId?: string | null;
	onClose: () => void;
	onPrevious: () => void;
	onNext: () => void;
	onDelete?: (imageId: string) => void;
};

export function PhotoPreviewModal({
	selectedImageId,
	selectedIndex,
	totalImages,
	currentUserId,
	isAdmin,
	deletingImageId,
	onClose,
	onPrevious,
	onNext,
	onDelete,
}: PhotoPreviewModalProps) {
	const [isLiked, setIsLiked] = useState<boolean>(false);

	const {mutate: likeMutation} = useApiMutation('location', 'ImageController', 'like');
	const {mutate: unlikeMutation} = useApiMutation('location', 'ImageController', 'unLike');

	const {data: hasLikedData, refetch: refetchLikeState} = useApiFetch('location', 'ImageController', 'hasLiked', {id: selectedImageId});
	const {data: imageData, refetch: refetchImage} = useApiFetch('location', 'ImageController', 'getById', {id: selectedImageId});

	useEffect(() => {
		setIsLiked(Boolean(hasLikedData?.liked));
	}, [hasLikedData]);

	if (!imageData) {
		return (
			<Modal transparent animationType="fade" onRequestClose={onClose}>
				<View style={[styles.modalContainer, {justifyContent: 'center', alignItems: 'center'}]}>
					<ActivityIndicator size="large" color="#ffffff" />
				</View>
			</Modal>
		);
	}

	const canManage = Boolean(onDelete) && (isAdmin || imageData.user.id === currentUserId);

	const handleLikeToggle = async (e: GestureResponderEvent) => {
		e.stopPropagation();
		if (!currentUserId) return;

		const nextState = !isLiked;
		setIsLiked(nextState);

		if (isLiked) {
			await unlikeMutation({id: imageData.id});
		} else {
			await likeMutation({id: imageData.id});
		}
		await Promise.all([refetchLikeState(), refetchImage()]);
	};

	return (
		<Modal transparent animationType="fade" onRequestClose={onClose}>
			<Pressable style={styles.modalContainer} onPress={onClose}>
				{/* Header */}
				<Pressable style={styles.modalHeader} onPress={e => e.stopPropagation()}>
					<Text style={styles.modalCounterText}>
						{selectedIndex + 1} / {totalImages}
					</Text>

					<Pressable
						style={styles.modalCloseButton}
						onPress={e => {
							e.stopPropagation();
							onClose();
						}}
						hitSlop={12}
					>
						<Ionicons name="close" size={24} color="#ffffff" />
					</Pressable>
				</Pressable>

				{/* Middle Area */}
				<View style={styles.modalBody}>
					{selectedIndex > 0 && (
						<Pressable
							style={[styles.navButton, styles.navButtonLeft]}
							onPress={e => {
								e.stopPropagation();
								onPrevious();
							}}
							hitSlop={12}
						>
							<Ionicons name="chevron-back" size={28} color="#ffffff" />
						</Pressable>
					)}

					<View style={styles.modalImageWrapper} pointerEvents="box-none">
						<Image
							source={{uri: getImageUrl({path: imageData.url, cdn: config.CONTENT_DELIVERY_NETWORK})}}
							style={styles.modalImage}
							resizeMode="contain"
						/>
					</View>

					{selectedIndex < totalImages - 1 && (
						<Pressable
							style={[styles.navButton, styles.navButtonRight]}
							onPress={e => {
								e.stopPropagation();
								onNext();
							}}
							hitSlop={12}
						>
							<Ionicons name="chevron-forward" size={28} color="#ffffff" />
						</Pressable>
					)}
				</View>

				{/* Footer Bar */}
				<Pressable style={styles.modalFooter} onPress={e => e.stopPropagation()}>
					<View style={styles.userInfo}>
						<UserAvatar username={imageData.user.username} />
						<View>
							<Text style={styles.userName}>{formatName(imageData.user)}</Text>
							{imageData.altText && <Text style={styles.altText}>{imageData.altText}</Text>}
						</View>
					</View>

					<View style={styles.modalActions}>
						{currentUserId && (
							<Pressable style={[styles.likeButton, isLiked && styles.likeButtonActive]} onPress={handleLikeToggle}>
								<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#ef4444' : '#ffffff'} />
								<Text style={styles.likeCount}>{imageData.likes}</Text>
							</Pressable>
						)}

						{canManage && (
							<Pressable
								style={styles.modalDeleteButton}
								onPress={e => {
									e.stopPropagation();
									onDelete?.(imageData.id);
								}}
								disabled={deletingImageId === imageData.id}
							>
								{deletingImageId === imageData.id ? (
									<ActivityIndicator size="small" color="#ef4444" />
								) : (
									<Ionicons name="trash-outline" size={20} color="#ef4444" />
								)}
							</Pressable>
						)}
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.92)',
		justifyContent: 'space-between',
		paddingVertical: 40,
	},
	modalHeader: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
	},
	modalCounterText: {
		color: '#94a3b8',
		fontSize: 14,
		fontWeight: '600',
	},
	modalCloseButton: {
		paddingTop: 10,
	},
	modalBody: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	modalImageWrapper: {
		width: '100%',
		height: '100%',
		paddingHorizontal: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalImage: {
		width: '100%',
		height: '100%',
	},
	navButton: {
		position: 'absolute',
		zIndex: 20,
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	navButtonLeft: {
		left: 12,
	},
	navButtonRight: {
		right: 12,
	},
	modalFooter: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingTop: 16,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	userName: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
	},
	altText: {
		color: '#94a3b8',
		fontSize: 12,
	},
	modalActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	likeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(255, 255, 255, 0.12)',
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
	modalDeleteButton: {
		backgroundColor: 'rgba(239, 68, 68, 0.2)',
		padding: 8,
		borderRadius: 16,
	},
});
