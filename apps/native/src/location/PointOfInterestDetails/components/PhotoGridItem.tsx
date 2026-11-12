import React from 'react';
import {Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {getImageUrl, ImageView} from '@northernexplorer/tools-web';
import {ImageStatusEnum, ImageType, PendingImageType} from '@northernexplorer/types';
import {config} from '~/config';

type PhotoGridItemProps = {
	image: ImageType | PendingImageType;
	isMine: boolean;
	onSelect: () => void;
	style?: StyleProp<ViewStyle>;
};

export function PhotoGridItem({image, isMine, onSelect, style}: PhotoGridItemProps) {
	const isPending = image.status === ImageStatusEnum.Pending;

	return (
		<Pressable style={[styles.gridItem, style]} onPress={onSelect}>
			<ImageView
				source={{
					uri: getImageUrl({
						path: image.url,
						cdn: config.CONTENT_DELIVERY_NETWORK,
						size: 'thumbnail',
						processed: image.processed,
					}),
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
});
