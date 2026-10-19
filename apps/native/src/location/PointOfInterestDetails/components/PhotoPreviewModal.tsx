import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, GestureResponderEvent, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {formatName, getImageUrl, ImageView} from '@northernexplorer/tools-web';
import {ReportTypeEnum} from '@northernexplorer/types';
import {useRouter} from 'expo-router';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import {config} from '~/config';
import {useApiMutation} from '~/core/useApiMutation';
import {useApiFetch} from '~/core/useApiFetch';
import {UserAvatar} from '~/layout/Layout/components/UserAvatar';
import {alertStore} from '~/core/alertStore';
import {ReportModal} from '~/system/ReportModal';

type PhotoPreviewModalProps = {
	selectedImageId: string;
	selectedIndex: number;
	totalImages: number;
	currentUserId?: string;
	isAdmin?: boolean;
	deletingImageId?: string | null;
	approvingImageId?: string | null;
	onClose: () => void;
	onPrevious: () => void;
	onNext: () => void;
	onDelete?: (imageId: string) => void;
	onApprove?: (imageId: string) => void;
	onReject?: (imageId: string) => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;

const SPRING_CONFIG = {
	damping: 18,
	stiffness: 140,
	mass: 0.8,
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
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const {width: windowWidth, height: windowHeight} = useWindowDimensions();

	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isReporting, setIsReporting] = useState<boolean>(false);
	const [isZoomed, setIsZoomed] = useState<boolean>(false);

	const {mutate: likeMutation} = useApiMutation('location', 'ImageController', 'like');
	const {mutate: unlikeMutation} = useApiMutation('location', 'ImageController', 'unLike');

	const {data: hasLikedData, refetch: refetchLikeState} = useApiFetch('location', 'ImageController', 'hasLiked', {
		id: selectedImageId,
	});
	const {data: imageData, refetch: refetchImage} = useApiFetch('location', 'ImageController', 'getById', {
		id: selectedImageId,
	});

	const navRef = useRef({selectedIndex, totalImages, onPrevious, onNext});
	navRef.current = {selectedIndex, totalImages, onPrevious, onNext};

	// Shared values for transformation state
	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);

	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const savedTranslateX = useSharedValue(0);
	const savedTranslateY = useSharedValue(0);

	const focalX = useSharedValue(0);
	const focalY = useSharedValue(0);

	const resetZoom = (animated = true) => {
		'worklet';
		if (animated) {
			scale.value = withSpring(MIN_SCALE, SPRING_CONFIG);
			translateX.value = withSpring(0, SPRING_CONFIG);
			translateY.value = withSpring(0, SPRING_CONFIG);
		} else {
			scale.value = MIN_SCALE;
			translateX.value = 0;
			translateY.value = 0;
		}
		savedScale.value = MIN_SCALE;
		savedTranslateX.value = 0;
		savedTranslateY.value = 0;
	};

	// Reset zoom whenever image selection changes
	useEffect(() => {
		resetZoom(false);
		setIsZoomed(false);
	}, [selectedImageId, selectedIndex]);

	useEffect(() => {
		setIsLiked(Boolean(hasLikedData?.liked));
	}, [hasLikedData]);

	const handleZoomStateUpdate = (zoomed: boolean) => {
		setIsZoomed(zoomed);
	};

	const handleSwipeCompletion = (isSwipeLeft: boolean, isSwipeRight: boolean) => {
		const {selectedIndex: idx, totalImages: total, onPrevious: prevFn, onNext: nextFn} = navRef.current;
		if (isSwipeLeft && idx < total - 1) {
			nextFn();
		} else if (isSwipeRight && idx > 0) {
			prevFn();
		} else {
			translateX.value = withSpring(0, SPRING_CONFIG);
		}
	};

	// Clamp translation so zoomed image boundaries stay within viewport
	const clampAndApplyBoundaries = () => {
		'worklet';
		const currentScale = scale.value;
		if (currentScale <= 1) {
			translateX.value = withSpring(0, SPRING_CONFIG);
			translateY.value = withSpring(0, SPRING_CONFIG);
			savedTranslateX.value = 0;
			savedTranslateY.value = 0;
			return;
		}

		const maxTransX = (windowWidth * (currentScale - 1)) / 2;
		const maxTransY = (windowHeight * (currentScale - 1)) / 2;

		const clampedX = Math.min(Math.max(translateX.value, -maxTransX), maxTransX);
		const clampedY = Math.min(Math.max(translateY.value, -maxTransY), maxTransY);

		translateX.value = withSpring(clampedX, SPRING_CONFIG);
		translateY.value = withSpring(clampedY, SPRING_CONFIG);

		savedTranslateX.value = clampedX;
		savedTranslateY.value = clampedY;
	};

	// Pinch Gesture Handler
	const pinchGesture = Gesture.Pinch()
		.onStart(e => {
			focalX.value = e.focalX - windowWidth / 2;
			focalY.value = e.focalY - windowHeight / 2;
		})
		.onUpdate(e => {
			const newScale = Math.min(Math.max(savedScale.value * e.scale, 0.8), MAX_SCALE + 0.5);
			scale.value = newScale;
		})
		.onEnd(() => {
			if (scale.value < MIN_SCALE + 0.05) {
				resetZoom(true);
				runOnJS(handleZoomStateUpdate)(false);
			} else {
				const finalScale = Math.min(scale.value, MAX_SCALE);
				scale.value = withSpring(finalScale, SPRING_CONFIG);
				savedScale.value = finalScale;
				clampAndApplyBoundaries();
				runOnJS(handleZoomStateUpdate)(true);
			}
		});

	// Pan Gesture Handler
	const panGesture = Gesture.Pan()
		.averageTouches(true)
		.onUpdate(e => {
			if (scale.value > 1) {
				translateX.value = savedTranslateX.value + e.translationX;
				translateY.value = savedTranslateY.value + e.translationY;
			} else {
				translateX.value = e.translationX;
			}
		})
		.onEnd(e => {
			if (scale.value > 1) {
				clampAndApplyBoundaries();
			} else {
				const isSwipeLeft = e.translationX < -50 || (e.velocityX < -300 && e.translationX < -20);
				const isSwipeRight = e.translationX > 50 || (e.velocityX > 300 && e.translationX > 20);
				runOnJS(handleSwipeCompletion)(isSwipeLeft, isSwipeRight);
			}
		});

	// Double Tap Gesture Handler
	const doubleTapGesture = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd(e => {
			if (scale.value > 1.1) {
				resetZoom(true);
				runOnJS(handleZoomStateUpdate)(false);
			} else {
				const targetScale = 2.5;
				const tapX = e.x - windowWidth / 2;
				const tapY = e.y - windowHeight / 2;

				const targetX = -tapX * (targetScale - 1);
				const targetY = -tapY * (targetScale - 1);

				scale.value = withSpring(targetScale, SPRING_CONFIG);
				translateX.value = withSpring(targetX, SPRING_CONFIG);
				translateY.value = withSpring(targetY, SPRING_CONFIG);

				savedScale.value = targetScale;
				savedTranslateX.value = targetX;
				savedTranslateY.value = targetY;

				runOnJS(handleZoomStateUpdate)(true);
			}
		});

	const composedGesture = Gesture.Simultaneous(pinchGesture, Gesture.Race(doubleTapGesture, panGesture));

	// Top Zoom Increment / Decrement Handlers
	const handleZoomIn = () => {
		let nextScale = 2.5;
		if (scale.value >= 2.5) nextScale = 4.0;
		if (scale.value >= 4.0) nextScale = 5.0;

		scale.value = withSpring(nextScale, SPRING_CONFIG);
		savedScale.value = nextScale;
		clampAndApplyBoundaries();
		setIsZoomed(true);
	};

	const handleZoomOut = () => {
		let nextScale = 1.0;
		if (scale.value > 4.0) nextScale = 4.0;
		else if (scale.value > 2.5) nextScale = 2.5;

		if (nextScale === 1.0) {
			resetZoom(true);
			setIsZoomed(false);
		} else {
			scale.value = withSpring(nextScale, SPRING_CONFIG);
			savedScale.value = nextScale;
			clampAndApplyBoundaries();
		}
	};

	const animatedImageStyle = useAnimatedStyle(() => ({
		transform: [{translateX: translateX.value}, {translateY: translateY.value}, {scale: scale.value}],
	}));

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
	const isDeleting = deletingImageId === imageData.id;
	const isApproving = approvingImageId === imageData.id;

	const handleUserProfileNavigation = () => {
		onClose();
		router.push(`/user/${imageData.user.username}`);
	};

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
					onPress: () => onDelete && onDelete(imageData.id),
				},
			],
		});
	};

	return (
		<Modal transparent animationType="fade" onRequestClose={onClose}>
			<GestureHandlerRootView style={{flex: 1}}>
				<Pressable
					style={[
						styles.modalContainer,
						{
							paddingTop: Math.max(insets.top, 20),
							paddingBottom: Math.max(insets.bottom, 16),
						},
					]}
					onPress={onClose}
				>
					{/* Header */}
					<Pressable style={styles.modalHeader} onPress={e => e.stopPropagation()}>
						<View style={styles.headerLeftGroup}>
							<Text style={styles.modalCounterText}>
								{selectedIndex + 1} / {totalImages}
							</Text>

							{/* Zoom Action Controls */}
							<View style={styles.zoomControlPill}>
								<Pressable
									style={styles.zoomButton}
									onPress={e => {
										e.stopPropagation();
										handleZoomIn();
									}}
									hitSlop={8}
									accessibilityLabel="Zoom in"
								>
									<Ionicons name="add" size={16} color="#ffffff" />
								</Pressable>

								{isZoomed && (
									<>
										<Pressable
											style={styles.zoomButton}
											onPress={e => {
												e.stopPropagation();
												handleZoomOut();
											}}
											hitSlop={8}
											accessibilityLabel="Zoom out"
										>
											<Ionicons name="remove" size={16} color="#ffffff" />
										</Pressable>

										<View style={styles.zoomDivider} />

										<Pressable
											style={styles.zoomButton}
											onPress={e => {
												e.stopPropagation();
												resetZoom(true);
												setIsZoomed(false);
											}}
											hitSlop={8}
											accessibilityLabel="Reset zoom"
										>
											<Ionicons name="refresh-outline" size={14} color="#94a3b8" />
										</Pressable>
									</>
								)}
							</View>
						</View>

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
						{selectedIndex > 0 && !isZoomed && (
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

						<GestureDetector gesture={composedGesture}>
							<Animated.View style={[styles.modalImageWrapper, animatedImageStyle]}>
								<ImageView
									source={{
										uri: getImageUrl({
											processed: imageData.processed,
											size: 'large',
											path: imageData.url,
											cdn: config.CONTENT_DELIVERY_NETWORK,
										}),
									}}
									style={styles.modalImage}
									resizeMode="contain"
								/>
							</Animated.View>
						</GestureDetector>

						{selectedIndex < totalImages - 1 && !isZoomed && (
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
							<UserAvatar username={imageData.user.username} onPress={handleUserProfileNavigation} />
							<Pressable style={styles.userDetails} onPress={handleUserProfileNavigation}>
								<Text style={styles.userName}>{formatName(imageData.user)}</Text>
								{imageData.altText && <Text style={styles.altText}>{imageData.altText}</Text>}
							</Pressable>
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
								<Pressable
									style={[styles.actionButton, styles.rejectButton]}
									onPress={handleReject}
									disabled={isApproving || isDeleting}
								>
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
							<Pressable style={[styles.likeButton, isLiked && styles.likeButtonActive]} onPress={handleLikeToggle}>
								<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#ef4444' : '#ffffff'} />
								<Text style={styles.likeCount}>{hasLikedData?.likeCount ?? imageData.likes}</Text>
							</Pressable>

							{/* Report Button */}
							{imageData.user.id !== currentUserId && (
								<Pressable
									style={styles.modalReportButton}
									onPress={e => {
										e.stopPropagation();
										setIsReporting(true);
									}}
									hitSlop={8}
									accessibilityLabel="Report photo"
								>
									<Ionicons name="flag-outline" size={18} color="#94a3b8" />
								</Pressable>
							)}

							{/* Delete Button */}
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

					{isReporting && (
						<ReportModal
							visible={isReporting}
							type={ReportTypeEnum.Image}
							targetId={imageData.id}
							onClose={() => setIsReporting(false)}
						/>
					)}
				</Pressable>
			</GestureHandlerRootView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.92)',
		justifyContent: 'space-between',
	},
	modalHeader: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
	},
	headerLeftGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	modalCounterText: {
		color: '#94a3b8',
		fontSize: 14,
		fontWeight: '600',
	},
	zoomControlPill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.12)',
		borderRadius: 16,
		paddingHorizontal: 8,
		paddingVertical: 4,
		gap: 6,
	},
	zoomButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 4,
		paddingVertical: 2,
	},
	zoomResetText: {
		color: '#94a3b8',
		fontSize: 12,
		fontWeight: '500',
	},
	zoomDivider: {
		width: 1,
		height: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
		overflow: 'hidden',
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
		paddingTop: 12,
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
	modalReportButton: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalDeleteButton: {
		backgroundColor: 'rgba(239, 68, 68, 0.2)',
		padding: 8,
		borderRadius: 16,
	},
});
