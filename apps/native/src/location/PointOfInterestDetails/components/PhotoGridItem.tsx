import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {getDynamicImageUrl} from '@northernexplorer/tools-web';
import {ImageStatusEnum, ImageType, PendingImageType} from '@northernexplorer/types';
import {config} from '~/config';

type PhotoGridItemProps = {
	image: ImageType | PendingImageType;
	isMine: boolean;
	onSelect: () => void;
};

export function PhotoGridItem({image, isMine, onSelect}: PhotoGridItemProps) {
	const isPending = image.status === ImageStatusEnum.Pending;

	return (
		<Pressable style={styles.gridItem} onPress={onSelect}>
			<Image
				source={{
					uri: getDynamicImageUrl({path: image.url, cdn: config.CONTENT_DELIVERY_NETWORK, size: 'thumbnail', processed: image.processed}),
				}}
				style={styles.thumbnail}
			/>

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
	gridLikeButton: {
		position: 'absolute',
		bottom: 4,
		right: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.92)',
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
		shadowColor: '#0f172a',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.15,
		shadowRadius: 2,
		elevation: 2,
	},
	likeCountText: {
		fontSize: 10,
		fontWeight: '700',
		color: '#64748b',
	},
	likedText: {
		color: '#ef4444',
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
