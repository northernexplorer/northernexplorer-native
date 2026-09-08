import React from 'react';
import {ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {formatName, getImageUrl} from '@northernexplorer/tools';
import {ImageType} from '@northernexplorer/types';
import {config} from '~/config';

type PhotoPreviewModalProps = {
	visible: boolean;
	selectedImage: (ImageType & {likedByCurrentUser?: boolean}) | null;
	selectedIndex: number | null;
	totalImages: number;
	currentUserId?: string;
	isAdmin?: boolean;
	deletingImageId: string | null;
	onClose: () => void;
	onPrevious: () => void;
	onNext: () => void;
	onLike: (imageId: string) => void;
	onUnlike: (imageId: string) => void;
	onDelete: (imageId: string) => void;
};

export function PhotoPreviewModal({
	visible,
	selectedImage,
	selectedIndex,
	totalImages,
	currentUserId,
	isAdmin,
	deletingImageId,
	onClose,
	onPrevious,
	onNext,
	onLike,
	onUnlike,
	onDelete,
}: PhotoPreviewModalProps) {
	if (!selectedImage || selectedIndex === null) return null;

	const canManage = isAdmin || selectedImage.user.id === currentUserId;
	const isLiked = Boolean(selectedImage.likedByCurrentUser);

	const handleLikeToggle = () => {
		if (isLiked) {
			onUnlike(selectedImage.id);
		} else {
			onLike(selectedImage.id);
		}
	};

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View style={styles.modalContainer}>
				{/* 1. Header Area - Standard View, cannot trigger onClose */}
				<View style={styles.modalHeader}>
					<Text style={styles.modalCounterText}>
						{selectedIndex + 1} / {totalImages}
					</Text>

					<Pressable style={styles.modalCloseButton} onPress={onClose} hitSlop={12}>
						<Ionicons name="close" size={24} color="#ffffff" />
					</Pressable>
				</View>

				{/* 2. Middle Photo Display Area - ONLY clicking the image backdrop calls onClose */}
				<View style={styles.modalBody}>
					{selectedIndex > 0 && (
						<Pressable style={[styles.navButton, styles.navButtonLeft]} onPress={onPrevious} hitSlop={12}>
							<Ionicons name="chevron-back" size={28} color="#ffffff" />
						</Pressable>
					)}

					{/* Backdrop dismiss touch target */}
					<Pressable style={styles.modalImageWrapper} onPress={onClose}>
						<Image
							source={{uri: getImageUrl({path: selectedImage.url, cdn: config.CONTENT_DELIVERY_NETWORK})}}
							style={styles.modalImage}
							resizeMode="contain"
						/>
					</Pressable>

					{selectedIndex < totalImages - 1 && (
						<Pressable style={[styles.navButton, styles.navButtonRight]} onPress={onNext} hitSlop={12}>
							<Ionicons name="chevron-forward" size={28} color="#ffffff" />
						</Pressable>
					)}
				</View>

				{/* 3. Footer Bar - Standard View, completely decoupled from dismiss handlers */}
				<View style={styles.modalFooter}>
					<View style={styles.userInfo}>
						<View style={styles.avatarCircle}>
							<Text style={styles.avatarText}>{selectedImage.user.username.charAt(0).toUpperCase()}</Text>
						</View>
						<View>
							<Text style={styles.userName}>{formatName(selectedImage.user)}</Text>
							{selectedImage.altText && <Text style={styles.altText}>{selectedImage.altText}</Text>}
						</View>
					</View>

					<View style={styles.modalActions}>
						<Pressable style={[styles.likeButton, isLiked && styles.likeButtonActive]} onPress={handleLikeToggle}>
							<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#ef4444' : '#0088cc'} />
							<Text style={styles.likeCount}>{selectedImage.likes}</Text>
						</Pressable>

						{canManage && (
							<Pressable
								style={styles.modalDeleteButton}
								onPress={() => onDelete(selectedImage.id)}
								disabled={deletingImageId === selectedImage.id}
							>
								{deletingImageId === selectedImage.id ? (
									<ActivityIndicator size="small" color="#ef4444" />
								) : (
									<Ionicons name="trash-outline" size={20} color="#ef4444" />
								)}
							</Pressable>
						)}
					</View>
				</View>
			</View>
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
	avatarCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#0284c7',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 14,
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
