import React, {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ImageUpload} from '@northernexplorer/tools';
import {FileUpload, UploadImageFileInput} from '@northernexplorer/types';
import {alertStore} from '~/core/alertStore';
import {useApiMutation} from '~/core/useApiMutation';

type PhotoUploadCardProps = {
	pointOfInterestId: string;
	maxImages?: number;
	maxSizeBytes?: number;
	refetch: () => void;
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

export function PhotoUploadCard({
	pointOfInterestId,
	maxImages = DEFAULT_MAX_IMAGES,
	maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
	refetch,
}: PhotoUploadCardProps) {
	const [stagedUploads, setStagedUploads] = useState<UploadImageFileInput[]>([]);
	const [isUploading, setIsUploading] = useState(false);

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

		setIsUploading(true);

		const preparedFiles: FileUpload[] = await Promise.all(
			stagedUploads.map(async file => ({
				...file,
				base64: await uriToBase64(file.uri),
			})),
		);

		const totalBase64SizeBytes = preparedFiles.reduce((acc, file) => {
			const base64Length = file.base64 ? file.base64.length : 0;
			return acc + base64Length * (3 / 4);
		}, 0);

		if (totalBase64SizeBytes > maxSizeBytes) {
			alertStore.showAlert({
				title: 'Payload Too Large',
				message: 'The total size of the selected photos exceeds the 50 MB limit. Please remove some photos and try again.',
				type: 'warning',
			});
			setIsUploading(false);
			return;
		}

		await uploadMutation({
			pointOfInterestId,
			files: preparedFiles,
		});

		setStagedUploads([]);
		refetch();
		setIsUploading(false);
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
				updateField={(_, val) => setStagedUploads(val)}
			/>

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
});
