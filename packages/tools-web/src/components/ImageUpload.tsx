import React, {useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync} from 'expo-image-picker';
import {UploadImageFileInput} from '@northernexplorer/types';

interface Props<T extends string> {
	fieldName: T;
	label?: string;
	updateField: (name: T, value: UploadImageFileInput[]) => void;
	value?: UploadImageFileInput[];
	multiple?: boolean;
	maxImages?: number;
	error?: string;
	loading?: boolean;
	renderOverlay?: (item: UploadImageFileInput, index: number) => React.ReactNode;
}

export function ImageUpload<T extends string>({
	fieldName,
	label,
	updateField,
	value = [],
	multiple = false,
	maxImages = 10,
	error,
	loading = false,
	renderOverlay,
}: Props<T>) {
	const [isPicking, setIsPicking] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);

	const requestPermission = async (): Promise<boolean> => {
		const {status} = await requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
			return false;
		}
		return true;
	};

	const handlePickImages = async () => {
		if (loading || isPicking) return;

		const hasPermission = await requestPermission();
		if (!hasPermission) return;
		setIsPicking(true);
		const remainingSlots = maxImages - value.length;

		if (multiple && remainingSlots <= 0) {
			Alert.alert('Limit Reached', `You can only upload up to ${maxImages} images.`);
			setIsPicking(false);
			return;
		}

		const result = await launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsMultipleSelection: multiple,
			selectionLimit: multiple ? remainingSlots : 1,
			quality: 0.8,
		});

		if (!result.canceled && result.assets.length > 0) {
			const existingUris = new Set(value.map(item => item.uri));
			const existingFilenames = new Set(value.map(item => item.filename));

			const newFormattedImages: UploadImageFileInput[] = [];
			let duplicateCount = 0;

			for (const asset of result.assets) {
				const filename = asset.fileName || asset.uri.split('/').pop() || 'image.jpg';
				const fileExtension = filename.split('.').pop()?.toLowerCase() || 'jpg';

				if (existingUris.has(asset.uri) || existingFilenames.has(filename)) {
					duplicateCount++;
					continue;
				}

				existingUris.add(asset.uri);
				existingFilenames.add(filename);

				newFormattedImages.push({
					uri: asset.uri,
					filename,
					mimeType: asset.mimeType || 'image/jpeg',
					size: asset.fileSize || 0,
					fileExtension,
				});
			}

			if (duplicateCount > 0) {
				Alert.alert(
					'Duplicate Images Skipped',
					`${duplicateCount} ${duplicateCount === 1 ? 'image was' : 'images were'} already selected and ${duplicateCount === 1 ? 'was' : 'were'} skipped.`,
				);
			}

			if (newFormattedImages.length > 0) {
				if (multiple) {
					updateField(fieldName, [...value, ...newFormattedImages]);
				} else {
					updateField(fieldName, [newFormattedImages[0]]);
				}
			}
		}
		setIsPicking(false);
	};

	const handleRemoveImage = (indexToRemove: number) => {
		if (loading) return;
		const updated = value.filter((_, index) => index !== indexToRemove);
		updateField(fieldName, updated);
	};

	const handleWebFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsDragOver(false);
		const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
		if (files.length === 0) return;

		const remainingSlots = maxImages - value.length;
		if (multiple && remainingSlots <= 0) return;

		const filesToProcess = multiple ? files.slice(0, remainingSlots) : [files[0]];
		const existingUris = new Set(value.map(item => item.uri));
		const existingFilenames = new Set(value.map(item => item.filename));

		const newFormattedImages: UploadImageFileInput[] = [];

		for (const file of filesToProcess) {
			const uri = URL.createObjectURL(file);
			const filename = file.name || 'image.jpg';
			if (existingUris.has(uri) || existingFilenames.has(filename)) continue;

			newFormattedImages.push({
				uri,
				filename,
				mimeType: file.type || 'image/jpeg',
				size: file.size || 0,
				fileExtension: filename.split('.').pop()?.toLowerCase() || 'jpg',
			});
		}

		if (newFormattedImages.length > 0) {
			updateField(fieldName, multiple ? [...value, ...newFormattedImages] : [newFormattedImages[0]]);
		}

		e.target.value = '';
	};

	const showPickButton = multiple ? value.length < maxImages : value.length === 0;

	return (
		<View style={styles.field}>
			{label ? <Text style={styles.label}>{label}</Text> : null}

			<View style={[styles.container, loading && styles.disabledContainer]}>
				{value.length > 0 && (
					<FlatList
						data={value}
						horizontal
						showsHorizontalScrollIndicator={false}
						keyExtractor={(item, index) => `${item.uri}-${index}`}
						contentContainerStyle={styles.listContainer}
						renderItem={({item, index}) => (
							<View style={styles.imageWrapper}>
								<Image source={{uri: item.uri}} style={styles.previewImage} />
								{renderOverlay ? renderOverlay(item, index) : null}
								{!loading && (
									<TouchableOpacity
										style={styles.removeButton}
										onPress={() => handleRemoveImage(index)}
										hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
										activeOpacity={0.8}
									>
										<Ionicons name="close-circle" size={20} color="#ef4444" />
									</TouchableOpacity>
								)}
							</View>
						)}
					/>
				)}

				{showPickButton && (
					<TouchableOpacity
						style={[styles.uploadButton, value.length > 0 && styles.uploadButtonCompact, isDragOver && styles.uploadButtonActive]}
						onPress={Platform.OS === 'web' ? undefined : handlePickImages}
						disabled={loading || isPicking}
						activeOpacity={0.7}
					>
						{Platform.OS === 'web' && (
							<input
								type="file"
								accept="image/*"
								multiple={multiple}
								onChange={handleWebFileInput}
								onDragEnter={() => setIsDragOver(true)}
								onDragOver={e => e.preventDefault()}
								onDragLeave={() => setIsDragOver(false)}
								onDrop={() => setIsDragOver(false)}
								style={webInputStyle}
								disabled={loading || isPicking}
							/>
						)}

						{isPicking ? (
							<ActivityIndicator color="#0284c7" />
						) : (
							<>
								<Ionicons
									name={isDragOver ? 'arrow-down-circle-outline' : 'cloud-upload-outline'}
									size={24}
									color={isDragOver ? '#0284c7' : '#64748b'}
								/>
								<Text style={[styles.uploadText, isDragOver && styles.uploadTextActive]}>
									{isDragOver ? 'Drop images here' : multiple ? (value.length > 0 ? 'Add More' : 'Select Images') : 'Select Image'}
								</Text>
							</>
						)}
					</TouchableOpacity>
				)}
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
		</View>
	);
}

const webInputStyle: React.CSSProperties = {
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	width: '100%',
	height: '100%',
	opacity: 0,
	cursor: 'pointer',
	zIndex: 5,
};

const styles = StyleSheet.create({
	field: {
		gap: 6,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#0f172a',
	},
	container: {
		borderRadius: 10,
		backgroundColor: '#ffffff',
		gap: 10,
	},
	disabledContainer: {
		opacity: 0.5,
	},
	listContainer: {
		gap: 8,
		paddingVertical: 4,
	},
	imageWrapper: {
		position: 'relative',
		overflow: 'hidden',
		borderRadius: 8,
	},
	previewImage: {
		width: 76,
		height: 76,
		borderRadius: 8,
		backgroundColor: '#f1f5f9',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	removeButton: {
		position: 'absolute',
		top: 2,
		right: 2,
		backgroundColor: '#ffffff',
		borderRadius: 10,
		zIndex: 10,
		elevation: 1,
	},
	uploadButton: {
		position: 'relative',
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: '#cbd5e1',
		borderRadius: 10,
		height: 84,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 6,
		backgroundColor: '#f8fafc',
	},
	uploadButtonCompact: {
		height: 76,
	},
	uploadButtonActive: {
		borderColor: '#0284c7',
		backgroundColor: '#e0f2fe',
	},
	uploadText: {
		fontSize: 13,
		color: '#64748b',
		fontWeight: '600',
	},
	uploadTextActive: {
		color: '#0284c7',
	},
	errorText: {
		color: '#ef4444',
		fontSize: 12,
		marginTop: 2,
	},
});
