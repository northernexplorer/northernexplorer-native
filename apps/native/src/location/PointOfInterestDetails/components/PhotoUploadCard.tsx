import React, {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ImageUpload} from '@northernexplorer/tools-web';
import {FileUpload, ImageUploadStatus, UploadImageFileInput} from '@northernexplorer/types';
import {alertStore} from '~/core/alertStore';
import {useApiMutation} from '~/core/useApiMutation';

type PhotoUploadCardProps = {
	pointOfInterestId: string;
	maxImages?: number;
	maxImageSizeBytes?: number;
};

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

export function PhotoUploadCard({pointOfInterestId}: PhotoUploadCardProps) {
	const [stagedUploads, setStagedUploads] = useState<UploadImageFileInput[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const maxImages = 10;
	const maxImageSizeBytes = 12 * 1024 * 1024;

	// Track upload statuses mapped by file URI
	const [statusMap, setStatusMap] = useState<Record<string, ImageUploadStatus | undefined>>({});

	const {mutate: uploadMutation} = useApiMutation('location', 'ImageController', 'upload');

	// Filter to get only files that have not been uploaded yet or previously failed
	const pendingUploads = stagedUploads.filter(file => statusMap[file.uri] !== ImageUploadStatus.Success);

	const handleConfirmUpload = async () => {
		if (pendingUploads.length === 0) return;

		if (stagedUploads.length > maxImages) {
			const excessCount = stagedUploads.length - maxImages;
			const photoText = excessCount === 1 ? 'photo' : 'photos';

			alertStore.showAlert({
				title: 'Too Many Photos',
				message: `You can only upload a maximum of ${maxImages} photos at a time. Please remove ${excessCount} ${photoText}.`,
				type: 'warning',
			});
			return;
		}

		// Check individual image size limit
		const maxMbPerImage = Math.round(maxImageSizeBytes / (1024 * 1024));
		const oversizedFile = pendingUploads.find(file => file.size > maxImageSizeBytes);
		if (oversizedFile) {
			alertStore.showAlert({
				title: 'File Too Large',
				message: `One or more selected photos exceed the ${maxMbPerImage} MB limit per image. Please remove the large photo(s) and try again.`,
				type: 'warning',
			});
			return;
		}

		setIsUploading(true);

		for (const file of pendingUploads) {
			try {
				const base64 = await uriToBase64(file.uri);
				const preparedFile: FileUpload = {
					...file,
					base64,
				};

				const response = await uploadMutation({
					pointOfInterestId,
					file: preparedFile,
				});

				if (response) {
					setStatusMap(prev => ({
						...prev,
						[file.uri]: response.status,
					}));
				} else {
					setStatusMap(prev => ({
						...prev,
						[file.uri]: ImageUploadStatus.Error,
					}));
				}
			} catch {
				setStatusMap(prev => ({
					...prev,
					[file.uri]: ImageUploadStatus.Error,
				}));
			}
		}

		setIsUploading(false);
	};

	const handleFieldUpdate = (_: string, newValues: UploadImageFileInput[]) => {
		// Clean up status entries for removed photos
		const currentUris = new Set(newValues.map(v => v.uri));
		setStatusMap(prev => {
			const nextMap: Record<string, ImageUploadStatus | undefined> = {};
			Object.keys(prev).forEach(uri => {
				if (currentUris.has(uri)) {
					nextMap[uri] = prev[uri];
				}
			});
			return nextMap;
		});

		setStagedUploads(newValues);
	};

	return (
		<View style={styles.uploadCard}>
			<Text style={styles.uploadTitle}>Share Your Photos</Text>

			<ImageUpload
				fieldName="photos"
				label=""
				multiple
				maxImages={maxImages}
				value={stagedUploads}
				loading={isUploading}
				updateField={handleFieldUpdate}
				renderOverlay={item => {
					const status = statusMap[item.uri];
					if (!status) return null;

					const isSuccess = status === ImageUploadStatus.Success;
					const isDuplicate = status === ImageUploadStatus.Duplicate;

					let overlayStyle = styles.overlaySuccess;
					let iconName: keyof typeof Ionicons.glyphMap = 'checkmark-circle';
					let labelText = 'Uploaded';

					if (isDuplicate) {
						overlayStyle = styles.overlayDuplicate;
						iconName = 'alert-circle';
						labelText = 'Duplicate';
					} else if (!isSuccess) {
						overlayStyle = styles.overlayError;
						iconName = 'close-circle';
						labelText = 'Failed';
					}

					return (
						<View style={[styles.fullOverlay, overlayStyle]}>
							<Ionicons name={iconName} size={20} color="#ffffff" />
							<Text style={styles.overlayText}>{labelText}</Text>
						</View>
					);
				}}
			/>

			{pendingUploads.length > 0 && (
				<Pressable
					style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
					onPress={handleConfirmUpload}
					disabled={isUploading}
				>
					{isUploading ? (
						<ActivityIndicator size="small" color="#ffffff" />
					) : (
						<>
							<Ionicons name="cloud-upload" size={18} color="#ffffff" />
							<Text style={styles.submitButtonText}>
								Upload {pendingUploads.length} {pendingUploads.length === 1 ? 'Photo' : 'Photos'}
							</Text>
						</>
					)}
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
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
	fullOverlay: {
		...StyleSheet.absoluteFill,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 2,
		padding: 4,
	},
	overlaySuccess: {
		backgroundColor: 'rgba(22, 163, 74, 0.65)',
	},
	overlayDuplicate: {
		backgroundColor: 'rgba(217, 119, 6, 0.70)',
	},
	overlayError: {
		backgroundColor: 'rgba(220, 38, 38, 0.70)',
	},
	overlayText: {
		color: '#ffffff',
		fontSize: 10,
		fontWeight: '700',
		textAlign: 'center',
	},
});
