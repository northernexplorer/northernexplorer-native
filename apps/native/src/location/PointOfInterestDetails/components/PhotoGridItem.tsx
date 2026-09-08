import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getImageUrl} from '@northernexplorer/tools';
import {ImageStatusEnum, ImageType} from '@northernexplorer/types';
import {config} from '~/config';

type PhotoGridItemProps = {
	image: ImageType;
	isMine: boolean;
	canManage: boolean;
	onSelect: () => void;
	onDelete: (imageId: string) => void;
};

export function PhotoGridItem({image, isMine, canManage, onSelect, onDelete}: PhotoGridItemProps) {
	const isPending = image.status === ImageStatusEnum.Pending;

	return (
		<Pressable style={styles.gridItem} onPress={onSelect}>
			<Image source={{uri: getImageUrl({path: image.url, cdn: config.CONTENT_DELIVERY_NETWORK})}} style={styles.thumbnail} />

			{isMine && (
				<View style={styles.gridMineBadge}>
					<Text style={styles.gridBadgeText}>Your Photo</Text>
				</View>
			)}

			{isPending && (
				<View style={styles.gridPendingBadge}>
					<Text style={styles.gridBadgeText}>Pending</Text>
				</View>
			)}

			{canManage && (
				<Pressable style={styles.gridDeleteButton} onPress={() => onDelete(image.id)} hitSlop={8}>
					<Ionicons name="trash-outline" size={13} color="#ef4444" />
				</Pressable>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
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
});
