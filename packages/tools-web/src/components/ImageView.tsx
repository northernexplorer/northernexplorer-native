import React from 'react';
import {Image, ImageProps, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

export interface ImageViewProps extends ImageProps {
	/** Style applied to the container (controls size, aspect ratio, borders, etc.) */
	style?: StyleProp<ViewStyle>;
	/** Optional inner Image component style overrides */
	imageStyle?: StyleProp<ViewStyle>;
}

/**
 * Reusable Image component that prevents right-clicking, image dragging,
 * and long-press saving across Web, iOS, and Android.
 */
export function ImageView({style, imageStyle, source, resizeMode = 'cover', ...props}: ImageViewProps) {
	return (
		<View
			style={[styles.container, style]}
			// Suppresses right-click context menu on Web
			// @ts-expect-error - onContextMenu is supported in React Native Web DOM nodes
			onContextMenu={(e: React.SyntheticEvent) => e.preventDefault()}
		>
			<Image
				source={source}
				resizeMode={resizeMode}
				style={[styles.image, imageStyle]}
				// Disables browser image drag behavior on Web
				{...({draggable: false} as Record<string, unknown>)}
				{...props}
			/>

			{/* Transparent overlay blocks direct interaction/long-press on the image element */}
			<View style={styles.protectionOverlay} pointerEvents="none" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	protectionOverlay: {
		...StyleSheet.absoluteFill,
		backgroundColor: 'transparent',
		zIndex: 1,
	},
});
