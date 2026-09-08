import React, {useState} from 'react';
import {ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {formatName, getImageUrl, ImageUpload, Spinner} from '@northernexplorer/tools';
import {ImageStatusEnum, PointOfInterestType, RolesEnum, UploadImageFileInput, FileUpload} from '@northernexplorer/types';
import {Link} from 'expo-router';
import {useApiMutation} from '~/core/useApiMutation';
import {styles as globalStyles} from '~/location/PointOfInterestDetails/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {alertStore} from '~/core/alertStore';
import {config} from '~/config';

type PhotosProps = {
	data: PointOfInterestType;
	refetch: () => void;
	loading: boolean;
};

export function Photos({data, refetch, loading}: PhotosProps) {
	const authentication = useAuthentication();
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [stagedUploads, setStagedUploads] = useState<UploadImageFileInput[]>([]);

	const {mutate: deleteMutation} = useApiMutation('location', 'ImageController', 'deleteById');
	const {mutate: uploadMutation} = useApiMutation('location', 'ImageController', 'upload');
	const {mutate: likeMutation} = useApiMutation('location', 'ImageController', 'like');

	if (loading) return <Spinner />;

	const images = data.images || [];
	const isAdmin = authentication?.roles?.includes(RolesEnum.Admin);
	const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

	const uriToBase64 = async (uri: string): Promise<string> => {
		const response = await fetch(uri);
		const blob = await response.blob();

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => {
				const dataUrl = reader.result as string;
				const base64 = dataUrl.split(',')[1];
				resolve(base64);
			};
			reader.readAsDataURL(blob);
		});
	};

	const handleConfirmUpload = async () => {
		if (stagedUploads.length === 0) return;

		setIsUploading(true);

		const preparedFiles: FileUpload[] = await Promise.all(
			stagedUploads.map(async file => {
				const base64 = await uriToBase64(file.uri);

				return {
					...file,
					base64,
				};
			}),
		);

		await uploadMutation({
			pointOfInterestId: data.id,
			files: preparedFiles,
		});

		setStagedUploads([]);
		refetch();
		setIsUploading(false);
	};

	const handleDelete = (imageId: string) => {
		alertStore.showAlert({
			title: 'Delete Photo',
			message: 'Are you sure you want to delete this photo? This action cannot be undone.',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setDeletingImageId(imageId);
						try {
							await deleteMutation({id: imageId});
							if (selectedImage?.id === imageId) {
								setSelectedImageIndex(null);
							}
							refetch();
						} finally {
							setDeletingImageId(null);
						}
					},
				},
			],
		});
	};

	const handleLike = async (imageId: string) => {
		await likeMutation({id: imageId});
		refetch();
	};

	const handlePreviousImage = () => {
		if (selectedImageIndex !== null && selectedImageIndex > 0) {
			setSelectedImageIndex(selectedImageIndex - 1);
		}
	};

	const handleNextImage = () => {
		if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
			setSelectedImageIndex(selectedImageIndex + 1);
		}
	};

	return (
		<View style={photoStyles.container}>
			{!authentication ? (
				<Link href="profile/login" asChild>
					<Pressable style={photoStyles.loggedOutCard}>
						<Ionicons name="images-outline" size={24} color="#64748b" />
						<Text style={photoStyles.loggedOutText}>Log in to share photos</Text>
					</Pressable>
				</Link>
			) : (
				<View style={photoStyles.uploadCard}>
					<Text style={photoStyles.uploadTitle}>Share Your Photos</Text>

					<ImageUpload
						fieldName="photos"
						label=""
						multiple
						maxImages={5}
						value={stagedUploads}
						loading={isUploading}
						updateField={(_, val) => setStagedUploads(val)}
					/>

					{stagedUploads.length > 0 && (
						<Pressable
							style={[photoStyles.submitButton, isUploading && photoStyles.submitButtonDisabled]}
							onPress={handleConfirmUpload}
							disabled={isUploading}
						>
							{isUploading ? (
								<ActivityIndicator size="small" color="#ffffff" />
							) : (
								<>
									<Ionicons name="cloud-upload" size={18} color="#ffffff" />
									<Text style={photoStyles.submitButtonText}>
										Upload {stagedUploads.length} {stagedUploads.length === 1 ? 'Photo' : 'Photos'}
									</Text>
								</>
							)}
						</Pressable>
					)}
				</View>
			)}

			{/* Header */}
			<View style={photoStyles.headerSection}>
				<Text style={globalStyles.reviewTitle}>Community Photos ({images.length})</Text>
			</View>

			{/* Empty State */}
			{images.length === 0 ? (
				<View style={photoStyles.emptyState}>
					<Ionicons name="images-outline" size={44} color="#cbd5e1" />
					<Text style={photoStyles.emptyTitle}>No photos yet</Text>
					<Text style={photoStyles.emptySubtitle}>Be the first to share photos of this location with the community.</Text>
				</View>
			) : (
				/* Photo Grid */
				<View style={photoStyles.gridContainer}>
					{images.map((image, index) => {
						const isMine = image.user.id === authentication?.userId;
						const isPending = image.status === ImageStatusEnum.Pending;
						const canManage = isAdmin || isMine;

						return (
							<Pressable key={image.id} style={photoStyles.gridItem} onPress={() => setSelectedImageIndex(index)}>
								<Image
									source={{uri: getImageUrl({path: image.url, cdn: config.CONTENT_DELIVERY_NETWORK})}}
									style={photoStyles.thumbnail}
								/>

								{isMine && (
									<View style={photoStyles.gridMineBadge}>
										<Text style={photoStyles.gridBadgeText}>Your Photo</Text>
									</View>
								)}

								{isPending && (
									<View style={photoStyles.gridPendingBadge}>
										<Text style={photoStyles.gridBadgeText}>Pending</Text>
									</View>
								)}

								{canManage && (
									<Pressable style={photoStyles.gridDeleteButton} onPress={() => handleDelete(image.id)} hitSlop={8}>
										<Ionicons name="trash-outline" size={13} color="#ef4444" />
									</Pressable>
								)}
							</Pressable>
						);
					})}
				</View>
			)}

			{/* Fullscreen Photo Modal Preview */}
			<Modal visible={selectedImageIndex !== null} transparent animationType="fade" onRequestClose={() => setSelectedImageIndex(null)}>
				{selectedImage && selectedImageIndex !== null && (
					<View style={photoStyles.modalContainer}>
						{/* Fullscreen pressable backdrop */}
						<Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedImageIndex(null)} />

						{/* Header controls */}
						<View style={photoStyles.modalHeader} pointerEvents="box-none">
							<Text style={photoStyles.modalCounterText}>
								{selectedImageIndex + 1} / {images.length}
							</Text>

							<Pressable style={photoStyles.modalCloseButton} onPress={() => setSelectedImageIndex(null)} hitSlop={12}>
								<Ionicons name="close" size={24} color="#ffffff" />
							</Pressable>
						</View>

						{/* Center photo display area with navigation arrows */}
						<View style={photoStyles.modalBody} pointerEvents="box-none">
							{selectedImageIndex > 0 && (
								<Pressable style={[photoStyles.navButton, photoStyles.navButtonLeft]} onPress={handlePreviousImage} hitSlop={12}>
									<Ionicons name="chevron-back" size={28} color="#ffffff" />
								</Pressable>
							)}

							<Pressable style={photoStyles.modalImageWrapper} onPress={() => setSelectedImageIndex(null)}>
								<Image
									source={{uri: getImageUrl({path: selectedImage.url, cdn: config.CONTENT_DELIVERY_NETWORK})}}
									style={photoStyles.modalImage}
									resizeMode="contain"
								/>
							</Pressable>

							{selectedImageIndex < images.length - 1 && (
								<Pressable style={[photoStyles.navButton, photoStyles.navButtonRight]} onPress={handleNextImage} hitSlop={12}>
									<Ionicons name="chevron-forward" size={28} color="#ffffff" />
								</Pressable>
							)}
						</View>

						{/* Footer controls */}
						<View style={photoStyles.modalFooter} pointerEvents="box-none">
							<View style={photoStyles.userInfo}>
								<View style={photoStyles.avatarCircle}>
									<Text style={photoStyles.avatarText}>{selectedImage.user.username.charAt(0).toUpperCase()}</Text>
								</View>
								<View>
									<Text style={photoStyles.userName}>{formatName(selectedImage.user)}</Text>
									{selectedImage.altText && <Text style={photoStyles.altText}>{selectedImage.altText}</Text>}
								</View>
							</View>

							<View style={photoStyles.modalActions}>
								<Pressable style={photoStyles.likeButton} onPress={() => handleLike(selectedImage.id)}>
									<Ionicons name="heart-outline" size={20} color="#0088cc" />
									<Text style={photoStyles.likeCount}>{selectedImage.likes}</Text>
								</Pressable>

								{(isAdmin || selectedImage.user.id === authentication?.userId) && (
									<Pressable
										style={photoStyles.modalDeleteButton}
										onPress={() => handleDelete(selectedImage.id)}
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
				)}
			</Modal>
		</View>
	);
}

const photoStyles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
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
		zIndex: 10,
	},
	modalCounterText: {
		color: '#94a3b8',
		fontSize: 14,
		fontWeight: '600',
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
	uploadCard: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		padding: 14,
		marginVertical: 10,
		shadowColor: '#0f172a',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	uploadTitle: {
		fontSize: 14,
		fontWeight: '700',
		color: '#0f172a',
		marginBottom: 8,
	},
	submitButton: {
		marginTop: 12,
		backgroundColor: '#0284c7',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
	submitButtonDisabled: {
		opacity: 0.6,
	},
	submitButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
	},
	loggedOutCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderStyle: 'dashed',
		padding: 18,
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
	},
	loggedOutText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#64748b',
	},
	headerSection: {
		marginTop: 8,
		marginBottom: 12,
	},
	gridContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
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
	modalCloseButton: {
		paddingTop: 10,
	},
	modalFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingTop: 16,
		zIndex: 10,
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
