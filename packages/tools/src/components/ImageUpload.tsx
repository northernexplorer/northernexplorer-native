import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';

export interface SelectedImage {
	uri: string;
	filename?: string;
	mimeType?: string;
	size?: number;
}

interface Props<T extends string> {
	fieldName: T;
	label?: string;
	updateField: (name: T, value: SelectedImage[]) => void;
	value?: SelectedImage[];
	multiple?: boolean;
	maxImages?: number;
	error?: string;
	loading?: boolean;
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
}: Props<T>) {
	const [isPicking, setIsPicking] = useState(false);

	const requestPermission = async (): Promise<boolean> => {
		const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

		try {
			setIsPicking(true);
			const remainingSlots = maxImages - value.length;

			if (multiple && remainingSlots <= 0) {
				Alert.alert('Limit Reached', `You can only upload up to ${maxImages} images.`);
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: multiple,
				selectionLimit: multiple ? remainingSlots : 1,
				quality: 0.8,
			});

			if (!result.canceled && result.assets.length > 0) {
				const formattedImages: SelectedImage[] = result.assets.map(asset => ({
					uri: asset.uri,
					filename: asset.fileName || asset.uri.split('/').pop() || 'image.jpg',
					mimeType: asset.mimeType || 'image/jpeg',
					size: asset.fileSize,
				}));

				if (multiple) {
					updateField(fieldName, [...value, ...formattedImages]);
				} else {
					updateField(fieldName, [formattedImages[0]]);
				}
			}
		} catch (err) {
			Alert.alert('Error', 'An error occurred while picking images.');
		} finally {
			setIsPicking(false);
		}
	};

	const handleRemoveImage = (indexToRemove: number) => {
		if (loading) return;
		const updated = value.filter((_, index) => index !== indexToRemove);
		updateField(fieldName, updated);
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
								{!loading && (
									<TouchableOpacity
										style={styles.removeButton}
										onPress={() => handleRemoveImage(index)}
										hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
										activeOpacity={0.8}
									>
										<Ionicons name="close-circle" size={22} color="#FF3B30" />
									</TouchableOpacity>
								)}
							</View>
						)}
					/>
				)}

				{showPickButton && (
					<TouchableOpacity
						style={[styles.uploadButton, value.length > 0 && styles.uploadButtonCompact]}
						onPress={handlePickImages}
						disabled={loading || isPicking}
						activeOpacity={0.7}
					>
						{isPicking ? (
							<ActivityIndicator color="#888888" />
						) : (
							<>
								<Ionicons name="cloud-upload-outline" size={26} color="#888888" />
								<Text style={styles.uploadText}>{multiple ? (value.length > 0 ? 'Add More' : 'Select Images') : 'Select Image'}</Text>
							</>
						)}
					</TouchableOpacity>
				)}
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	field: {
		gap: 6,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#333',
	},
	container: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		backgroundColor: '#fefefe',
		padding: 10,
		gap: 10,
	},
	disabledContainer: {
		opacity: 0.5,
		backgroundColor: '#f5f5f5',
	},
	listContainer: {
		gap: 10,
		paddingRight: 4,
	},
	imageWrapper: {
		position: 'relative',
	},
	previewImage: {
		width: 80,
		height: 80,
		borderRadius: 6,
		backgroundColor: '#e1e1e1',
	},
	removeButton: {
		position: 'absolute',
		top: -6,
		right: -6,
		backgroundColor: '#fff',
		borderRadius: 12,
	},
	uploadButton: {
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: '#888888',
		borderRadius: 6,
		height: 90,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 6,
		backgroundColor: '#fafafa',
	},
	uploadButtonCompact: {
		height: 80,
	},
	uploadText: {
		fontSize: 14,
		color: '#888888',
		fontWeight: '500',
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 2,
	},
});
