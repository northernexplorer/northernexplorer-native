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
				/>

				{avatar && (
					<Pressable
						style={[styles.removeButton, (isUploading || isRemoving) && styles.disabledButton]}
						onPress={handleRemoveAvatar}
						disabled={isUploading || isRemoving}
					>
						<Ionicons name="trash-outline" size={18} color="#ef4444" style={styles.buttonIcon} />
						<Text style={styles.removeButtonText}>{isRemoving ? 'Removing...' : 'Remove Avatar'}</Text>
					</Pressable>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginVertical: 16,
		gap: 12,
	},
	avatarPreviewWrapper: {
		position: 'relative',
		width: 96,
		height: 96,
		borderRadius: 48,
		overflow: 'hidden',
		backgroundColor: '#e2e8f0',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: '#cbd5e1',
	},
	avatarImage: {
		width: 96,
		height: 96,
		borderRadius: 48,
	},
	avatarPlaceholder: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: '#0088cc',
		alignItems: 'center',
		justifyContent: 'center',
	},
	placeholderText: {
		fontSize: 36,
		fontWeight: '700',
		color: '#ffffff',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFill,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonsContainer: {
		flexDirection: 'column',
		gap: 8,
		alignItems: 'center',
		width: '100%',
	},
	removeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fee2e2',
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 8,
	},
	removeButtonText: {
		color: '#ef4444',
		fontWeight: '600',
		fontSize: 14,
	},
	buttonIcon: {
		marginRight: 6,
	},
	disabledButton: {
		opacity: 0.6,
	},
});
