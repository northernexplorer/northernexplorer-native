import React, {useEffect, useState} from 'react';
import {ActivityIndicator, GestureResponderEvent, Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {formatName, getImageUrl} from '@northernexplorer/tools';
import {config} from '~/config';
import {useApiMutation} from '~/core/useApiMutation';
import {useApiFetch} from '~/core/useApiFetch';
import {UserAvatar} from '~/layout/Layout/components/UserAvatar';
import {alertStore} from '~/core/alertStore';

type PhotoPreviewModalProps = {
	selectedImageId: string;
	selectedIndex: number;
	totalImages: number;
	currentUserId?: string;
	isAdmin?: boolean;
	deletingImageId: string | null;
	approvingImageId?: string | null;
	onClose: () => void;
	onPrevious: () => void;
	onNext: () => void;
	onDelete: (imageId: string) => void;
	onApprove?: (imageId: string) => void;
	onReject?: (imageId: string) => void;
};

export function PhotoPreviewModal({
	selectedImageId,
	selectedIndex,
	totalImages,
	currentUserId,
	isAdmin,
	deletingImageId,
	approvingImageId,
	onClose,
	onPrevious,
	onNext,
	onDelete,
	onApprove,
	onReject,
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

	const canManage = isAdmin || imageData.user.id === currentUserId;
	const isDeleting = deletingImageId === imageData.id;
	const isApproving = approvingImageId === imageData.id;

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

	const handleApprove = (e: GestureResponderEvent) => {
		e.stopPropagation();
		if (!onApprove) return;

		alertStore.showAlert({
			title: 'Approve Image',
			message: 'Are you sure you want to approve this image for public display?',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Approve',
					style: 'default',
					onPress: () => onApprove(imageData.id),
				},
			],
		});
	};

	const handleReject = (e: GestureResponderEvent) => {
		e.stopPropagation();
		if (!onReject) return;

		alertStore.showAlert({
			title: 'Reject Image',
			message: 'Are you sure you want to reject this image?',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Reject',
					style: 'destructive',
					onPress: () => onReject(imageData.id),
				},
			],
		});
	};

	const handleDelete = (e: GestureResponderEvent) => {
		e.stopPropagation();

		alertStore.showAlert({
			title: 'Delete Photo',
			message: 'Are you sure you want to delete this photo? This action cannot be undone.',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => onDelete(imageData.id),
				},
			],
		});
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
						<View style={styles.userDetails}>
							<Text style={styles.userName}>{formatName(imageData.user)}</Text>
							{imageData.altText && <Text style={styles.altText}>{imageData.altText}</Text>}
						</View>
					</View>

					<View style={styles.modalActions}>
						{/* Admin Moderation Actions */}
						{isAdmin && onApprove && (
							<Pressable
								style={[styles.actionButton, styles.approveButton]}
								onPress={handleApprove}
								disabled={isApproving || isDeleting}
							>
								{isApproving ? (
									<ActivityIndicator size="small" color="#ffffff" />
								) : (
									<>
										<Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
										<Text style={styles.actionButtonText}>Approve</Text>
									</>
								)}
							</Pressable>
						)}

						{isAdmin && onReject && (
							<Pressable style={[styles.actionButton, styles.rejectButton]} onPress={handleReject} disabled={isApproving || isDeleting}>
								{isDeleting ? (
									<ActivityIndicator size="small" color="#ffffff" />
								) : (
									<>
										<Ionicons name="close-circle-outline" size={18} color="#ffffff" />
										<Text style={styles.actionButtonText}>Reject</Text>
									</>
								)}
							</Pressable>
						)}

						{/* Like Button */}
						{currentUserId && (
							<Pressable style={[styles.likeButton, isLiked && styles.likeButtonActive]} onPress={handleLikeToggle}>
								<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#ef4444' : '#ffffff'} />
								<Text style={styles.likeCount}>{imageData.likes}</Text>
							</Pressable>
						)}

						{/* Standard Delete Button (When not using dedicated reject) */}
						{canManage && !onReject && (
							<Pressable style={styles.modalDeleteButton} onPress={handleDelete} disabled={isDeleting || isApproving}>
								{isDeleting ? (
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
		paddingHorizontal: 16,
		paddingTop: 16,
		gap: 8,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		flexShrink: 1,
	},
	userDetails: {
		flexShrink: 1,
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
		gap: 8,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 10,
		paddingVertical: 7,
		borderRadius: 16,
	},
	approveButton: {
		backgroundColor: '#16a34a',
	},
	rejectButton: {
		backgroundColor: '#dc2626',
	},
	actionButtonText: {
		color: '#ffffff',
		fontSize: 12,
		fontWeight: '600',
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
