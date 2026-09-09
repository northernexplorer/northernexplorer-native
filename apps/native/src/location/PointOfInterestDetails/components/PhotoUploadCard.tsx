import React, {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ImageUpload} from '@northernexplorer/tools';
import {FileUpload, ImageUploadStatus, UploadImageFileInput} from '@northernexplorer/types';
import {alertStore} from '~/core/alertStore';
import {useApiMutation} from '~/core/useApiMutation';

type PhotoUploadCardProps = {
	pointOfInterestId: string;
	maxImages?: number;
	maxSizeBytes?: number;
};

type UploadResultItem = {
	file: string;
	status: ImageUploadStatus;
};

const DEFAULT_MAX_IMAGES = 10;
const DEFAULT_MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

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

export function PhotoUploadCard({pointOfInterestId, maxImages = DEFAULT_MAX_IMAGES, maxSizeBytes = DEFAULT_MAX_SIZE_BYTES}: PhotoUploadCardProps) {
	const [stagedUploads, setStagedUploads] = useState<UploadImageFileInput[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadResults, setUploadResults] = useState<UploadResultItem[]>([]);

	const {mutate: uploadMutation} = useApiMutation('location', 'ImageController', 'upload');

	const handleConfirmUpload = async () => {
		if (stagedUploads.length === 0) return;

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

		const rawTotalBytes = stagedUploads.reduce((acc, file) => acc + file.size, 0);
		if (rawTotalBytes > maxSizeBytes) {
			alertStore.showAlert({
				title: 'Payload Too Large',
				message: 'The total size of the selected photos exceeds the 50 MB limit. Please remove some photos and try again.',
				type: 'warning',
			});
			return;
		}

		setIsUploading(true);
		setUploadResults([]);

		try {
			const preparedFiles: FileUpload[] = await Promise.all(
				stagedUploads.map(async file => ({
					...file,
					base64: await uriToBase64(file.uri),
				})),
			);

			// uploadMutation directly returns Array<{ file: string; status: ImageUploadStatus }>
			const response = await uploadMutation({
				pointOfInterestId,
				files: preparedFiles,
			});

			if (Array.isArray(response)) {
				setUploadResults(response);
			}

			setStagedUploads([]);
		} catch (error) {
			alertStore.showAlert({
				title: 'Upload Failed',
				message: error instanceof Error ? error.message : 'An error occurred during upload. Please try again.',
				type: 'error',
			});
		} finally {
			setIsUploading(false);
		}
	};

	const handleClearResults = () => {
		setUploadResults([]);
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
				updateField={(_, val) => {
					if (uploadResults.length > 0) setUploadResults([]);
					setStagedUploads(val);
				}}
			/>

			{uploadResults.length > 0 && (
				<View style={styles.resultsContainer}>
					<View style={styles.resultsHeader}>
						<Text style={styles.resultsTitle}>Upload Summary</Text>
						<Pressable onPress={handleClearResults} hitSlop={8}>
							<Ionicons name="close-circle" size={18} color="#64748b" />
						</Pressable>
					</View>

					{uploadResults.map((res, idx) => {
						const isSuccess = res.status === ImageUploadStatus.Success;
						const filename = stagedUploads.find(f => f.uri === res.file)?.filename || `Photo ${idx + 1}`;

						return (
							<View key={`${res.file}-${idx}`} style={styles.resultRow}>
								<Ionicons
									name={isSuccess ? 'checkmark-circle' : 'alert-circle'}
									size={16}
									color={isSuccess ? '#16a34a' : '#d97706'}
								/>
								<Text style={styles.resultFilename} numberOfLines={1} ellipsizeMode="middle">
									{filename}
								</Text>
								<Text style={[styles.resultBadge, isSuccess ? styles.badgeSuccess : styles.badgeDuplicate]}>
									{isSuccess ? 'Uploaded' : 'Duplicate'}
								</Text>
							</View>
						);
					})}
				</View>
			)}

			{stagedUploads.length > 0 && (
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
								Upload {stagedUploads.length} {stagedUploads.length === 1 ? 'Photo' : 'Photos'}
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
	resultsContainer: {
		marginTop: 12,
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#cbd5e1',
		padding: 10,
		gap: 6,
	},
	resultsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	resultsTitle: {
		fontSize: 12,
		fontWeight: '700',
		color: '#334155',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	resultRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	resultFilename: {
		flex: 1,
		fontSize: 13,
		color: '#1e293b',
	},
	resultBadge: {
		fontSize: 11,
		fontWeight: '600',
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 4,
		overflow: 'hidden',
	},
	badgeSuccess: {
		backgroundColor: '#dcfce7',
		color: '#15803d',
	},
	badgeDuplicate: {
		backgroundColor: '#fef3c7',
		color: '#b45309',
	},
});
