import React, {useState} from 'react';
import {ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {AvatarHeaderType, FileUpload, UploadImageFileInput} from '@northernexplorer/types';
import {getImageUrl, ImageUpload} from '@northernexplorer/tools-web';
import {useApiMutation} from '~/core/useApiMutation';
import {config} from '~/config';

interface Props {
	username: string;
	initialAvatar?: AvatarHeaderType;
	onAvatarChange?: (avatar?: AvatarHeaderType) => void;
}

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

export function AvatarUpload({username, initialAvatar, onAvatarChange}: Props) {
	const [avatar, setAvatar] = useState<AvatarHeaderType | undefined>(initialAvatar);
	const [isUploading, setIsUploading] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);

	const {mutate: uploadMutation} = useApiMutation('user', 'UserController', 'uploadAvatar');
	const {mutate: removeMutation} = useApiMutation('user', 'UserController', 'removeAvatar');

	const handleImageSelected = async (_fieldName: string, images: UploadImageFileInput[]) => {
		if (images.length === 0 || isUploading || isRemoving) return;

		const file = images[0];
		const maxSizeBytes = 10 * 1024 * 1024;
		if (file.size > maxSizeBytes) {
			Alert.alert('File Too Large', 'Please select an image smaller than 10 MB.');
			return;
		}

		setIsUploading(true);
		try {
			const base64 = await uriToBase64(file.uri);
			const preparedFile: FileUpload = {
				...file,
				base64,
			};

			const response = await uploadMutation({file: preparedFile});
			if (response?.success) {
				setAvatar(response.avatar);
				onAvatarChange?.(response.avatar);
			} else {
				Alert.alert('Upload Failed', 'Failed to upload avatar. Please try again.');
			}
		} catch {
			Alert.alert('Upload Error', 'An error occurred while uploading your avatar.');
		} finally {
			setIsUploading(false);
		}
	};

	const handleRemoveAvatar = async () => {
		if (isUploading || isRemoving) return;

		setIsRemoving(true);
		try {
			const response = await removeMutation({});
			if (response?.success) {
				setAvatar(undefined);
				onAvatarChange?.(undefined);
			} else {
				Alert.alert('Removal Failed', 'Failed to remove avatar. Please try again.');
			}
		} catch {
			Alert.alert('Removal Error', 'An error occurred while removing your avatar.');
		} finally {
			setIsRemoving(false);
		}
	};

	const avatarUrl = avatar?.url
		? getImageUrl({
				path: avatar.url,
				cdn: config.CONTENT_DELIVERY_NETWORK || '',
				size: 'thumbnail',
				processed: avatar.processed,
			})
		: undefined;

	const initial = (username || 'U').charAt(0).toUpperCase();

	return (
		<View style={styles.container}>
			<View style={styles.avatarPreviewWrapper}>
				{avatarUrl ? (
					<Image source={{uri: avatarUrl}} style={styles.avatarImage} />
				) : (
					<View style={styles.avatarPlaceholder}>
						<Text style={styles.placeholderText}>{initial}</Text>
					</View>
				)}

				<View style={styles.cameraBadge}>
					<Ionicons name="camera" size={16} color="#ffffff" />
				</View>

				{(isUploading || isRemoving) && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="small" color="#ffffff" />
					</View>
				)}
			</View>

			<View style={styles.buttonsContainer}>
				<ImageUpload
					fieldName="avatar"
					label=""
					value={[]}
					updateField={handleImageSelected}
					multiple={false}
					maxImages={1}
					loading={isUploading || isRemoving}
					buttonText={avatar ? 'Change Image' : 'Select Image'}
					icon="camera-outline"
					iconSize={16}
					buttonStyle={styles.selectImageButton}
					buttonTextStyle={styles.selectImageText}
					containerStyle={styles.imageUploadContainer}
				/>

				{avatar && (
					<Pressable
						style={[styles.removeButton, (isUploading || isRemoving) && styles.disabledButton]}
						onPress={handleRemoveAvatar}
						disabled={isUploading || isRemoving}
					>
						<Ionicons name="trash-outline" size={16} color="#ef4444" />
						<Text style={styles.removeButtonText}>{isRemoving ? 'Removing...' : 'Remove Avatar'}</Text>
					</Pressable>
				)}
			</View>

			<Text style={styles.helpText}>JPG, PNG or GIF up to 10 MB</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginVertical: 18,
		gap: 12,
	},
	avatarPreviewWrapper: {
		position: 'relative',
		width: 104,
		height: 104,
		borderRadius: 52,
		backgroundColor: '#f1f5f9',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 3,
		borderColor: '#ffffff',
		shadowColor: '#0f172a',
		shadowOffset: {width: 0, height: 3},
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
	},
	avatarImage: {
		width: 98,
		height: 98,
		borderRadius: 49,
	},
	avatarPlaceholder: {
		width: 98,
		height: 98,
		borderRadius: 49,
		backgroundColor: '#0284c7',
		alignItems: 'center',
		justifyContent: 'center',
	},
	placeholderText: {
		fontSize: 38,
		fontWeight: '700',
		color: '#ffffff',
	},
	cameraBadge: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#0284c7',
		borderWidth: 2,
		borderColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFill,
		borderRadius: 52,
		backgroundColor: 'rgba(15, 23, 42, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 10,
	},
	buttonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flexWrap: 'wrap',
		gap: 10,
	},
	imageUploadContainer: {
		backgroundColor: 'transparent',
	},
	selectImageButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f0f9ff',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#bae6fd',
		borderRadius: 20,
		height: 38,
		paddingHorizontal: 16,
		gap: 6,
	},
	selectImageText: {
		color: '#0284c7',
		fontSize: 13,
		fontWeight: '600',
	},
	removeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fef2f2',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#fecaca',
		borderRadius: 20,
		height: 38,
		paddingHorizontal: 16,
		gap: 6,
	},
	removeButtonText: {
		color: '#ef4444',
		fontWeight: '600',
		fontSize: 13,
	},
	disabledButton: {
		opacity: 0.5,
	},
	helpText: {
		fontSize: 12,
		color: '#94a3b8',
		marginTop: -4,
	},
});
