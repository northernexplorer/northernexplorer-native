import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Animated, ImageProps, ImageStyle, LayoutChangeEvent, PanResponder, Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ImageView} from '@northernexplorer/tools-web';

export type ZoomableImageRef = {
	zoomIn: () => void;
	zoomOut: () => void;
	resetZoom: (animated?: boolean) => void;
	getScale: () => number;
};

export type ZoomableImageProps = {
	source: ImageProps['source'];
	style?: StyleProp<ViewStyle>;
	imageStyle?: StyleProp<ImageStyle>;
	resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
	minScale?: number;
	maxScale?: number;
	onScaleChange?: (scale: number) => void;
};

function getDistance(touch1: {pageX: number; pageY: number}, touch2: {pageX: number; pageY: number}) {
	const dx = touch1.pageX - touch2.pageX;
	const dy = touch1.pageY - touch2.pageY;
	return Math.hypot(dx, dy);
}

export const ZoomableImage = forwardRef<ZoomableImageRef, ZoomableImageProps>(function ZoomableImage(
	{source, style, imageStyle, resizeMode = 'contain', minScale = 1, maxScale = 5, onScaleChange}: ZoomableImageProps,
	ref,
) {
	const [, setDimensions] = useState({width: 0, height: 0});
	const containerDimensions = useRef({width: 0, height: 0});

	const scale = useRef(new Animated.Value(1)).current;
	const translateX = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(0)).current;

	const currentScale = useRef(1);
	const currentTranslateX = useRef(0);
	const currentTranslateY = useRef(0);

	const isPinching = useRef(false);
	const initialDistance = useRef(0);
	const initialScale = useRef(1);
	const initialTouchX = useRef(0);
	const initialTouchY = useRef(0);
	const lastTapTime = useRef(0);

	useEffect(() => {
		const scaleId = scale.addListener(({value}) => {
			currentScale.current = value;
			onScaleChange?.(value);
		});
		const txId = translateX.addListener(({value}) => {
			currentTranslateX.current = value;
		});
		const tyId = translateY.addListener(({value}) => {
			currentTranslateY.current = value;
		});

		return () => {
			scale.removeListener(scaleId);
			translateX.removeListener(txId);
			translateY.removeListener(tyId);
		};
	}, [onScaleChange, scale, translateX, translateY]);

	const resetZoom = (animated = true) => {
		if (animated) {
			Animated.parallel([
				Animated.spring(scale, {toValue: 1, useNativeDriver: false, friction: 7}),
				Animated.spring(translateX, {toValue: 0, useNativeDriver: false, friction: 7}),
				Animated.spring(translateY, {toValue: 0, useNativeDriver: false, friction: 7}),
			]).start();
		} else {
			scale.setValue(1);
			translateX.setValue(0);
			translateY.setValue(0);
			currentScale.current = 1;
			currentTranslateX.current = 0;
			currentTranslateY.current = 0;
			onScaleChange?.(1);
		}
	};

	useEffect(() => {
		resetZoom(false);
	}, [source]);

	const animateToScale = (targetScale: number) => {
		const clampedScale = Math.min(Math.max(targetScale, minScale), maxScale);
		const {width, height} = containerDimensions.current;
		const maxTx = Math.max(0, (width * (clampedScale - 1)) / 2);
		const maxTy = Math.max(0, (height * (clampedScale - 1)) / 2);

		const targetTx = clampedScale <= 1 ? 0 : Math.min(Math.max(currentTranslateX.current, -maxTx), maxTx);
		const targetTy = clampedScale <= 1 ? 0 : Math.min(Math.max(currentTranslateY.current, -maxTy), maxTy);

		Animated.parallel([
			Animated.spring(scale, {toValue: clampedScale, useNativeDriver: false, friction: 7}),
			Animated.spring(translateX, {toValue: targetTx, useNativeDriver: false, friction: 7}),
			Animated.spring(translateY, {toValue: targetTy, useNativeDriver: false, friction: 7}),
		]).start();
	};

	const clampAndAnimate = () => {
		let targetScale = currentScale.current;
		if (targetScale < minScale) targetScale = minScale;
		if (targetScale > maxScale) targetScale = maxScale;

		const {width, height} = containerDimensions.current;
		const maxTx = Math.max(0, (width * (targetScale - 1)) / 2);
		const maxTy = Math.max(0, (height * (targetScale - 1)) / 2);

		let targetTx = currentTranslateX.current;
		let targetTy = currentTranslateY.current;

		if (targetScale <= 1) {
			targetTx = 0;
			targetTy = 0;
		} else {
			targetTx = Math.min(Math.max(targetTx, -maxTx), maxTx);
			targetTy = Math.min(Math.max(targetTy, -maxTy), maxTy);
		}

		Animated.parallel([
			Animated.spring(scale, {toValue: targetScale, useNativeDriver: false, friction: 7}),
			Animated.spring(translateX, {toValue: targetTx, useNativeDriver: false, friction: 7}),
			Animated.spring(translateY, {toValue: targetTy, useNativeDriver: false, friction: 7}),
		]).start();
	};

	const zoomIn = () => {
		const newScale = Math.min(Math.round((currentScale.current + 0.5) * 10) / 10, maxScale);
		animateToScale(newScale);
	};

	const zoomOut = () => {
		const newScale = Math.max(Math.round((currentScale.current - 0.5) * 10) / 10, minScale);
		animateToScale(newScale);
	};

	const handleDoubleTap = () => {
		if (currentScale.current > 1.05) {
			resetZoom(true);
		} else {
			animateToScale(2.5);
		}
	};

	useImperativeHandle(ref, () => ({
		zoomIn,
		zoomOut,
		resetZoom: () => resetZoom(true),
		getScale: () => currentScale.current,
	}));

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, gestureState) => {
				return (
					gestureState.numberActiveTouches === 2 ||
					currentScale.current > 1 ||
					Math.abs(gestureState.dx) > 3 ||
					Math.abs(gestureState.dy) > 3
				);
			},
			onPanResponderGrant: evt => {
				const touches = evt.nativeEvent.touches;
				if (touches.length === 2) {
					isPinching.current = true;
					initialDistance.current = getDistance(touches[0], touches[1]);
					initialScale.current = currentScale.current;
				} else if (touches.length === 1) {
					isPinching.current = false;
					initialTouchX.current = currentTranslateX.current;
					initialTouchY.current = currentTranslateY.current;

					const now = Date.now();
					if (now - lastTapTime.current < 300) {
						handleDoubleTap();
						lastTapTime.current = 0;
					} else {
						lastTapTime.current = now;
					}
				}
			},
			onPanResponderMove: (evt, gestureState) => {
				const touches = evt.nativeEvent.touches;
				if (touches.length === 2 && initialDistance.current > 0) {
					const dist = getDistance(touches[0], touches[1]);
					const rawScale = initialScale.current * (dist / initialDistance.current);
					const clampedScale = Math.min(Math.max(rawScale, minScale * 0.8), maxScale * 1.2);
					scale.setValue(clampedScale);
				} else if (touches.length === 1 && !isPinching.current && currentScale.current > 1) {
					const {width, height} = containerDimensions.current;
					const maxTx = Math.max(0, (width * (currentScale.current - 1)) / 2);
					const maxTy = Math.max(0, (height * (currentScale.current - 1)) / 2);

					const newTx = Math.min(Math.max(initialTouchX.current + gestureState.dx, -maxTx), maxTx);
					const newTy = Math.min(Math.max(initialTouchY.current + gestureState.dy, -maxTy), maxTy);

					translateX.setValue(newTx);
					translateY.setValue(newTy);
				}
			},
			onPanResponderRelease: () => {
				isPinching.current = false;
				initialDistance.current = 0;
				clampAndAnimate();
			},
			onPanResponderTerminate: () => {
				isPinching.current = false;
				initialDistance.current = 0;
				clampAndAnimate();
			},
		}),
	).current;

	const onLayout = (event: LayoutChangeEvent) => {
		const {width, height} = event.nativeEvent.layout;
		containerDimensions.current = {width, height};
		setDimensions({width, height});
	};

	const handleWheel = (e: React.WheelEvent) => {
		if (typeof e.deltaY === 'number') {
			e.preventDefault();
			e.stopPropagation();
			const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
			const nextScale = Math.min(Math.max(currentScale.current * zoomFactor, minScale), maxScale);
			animateToScale(nextScale);
		}
	};

	return (
		<View
			style={[styles.container, style]}
			onLayout={onLayout}
			{...panResponder.panHandlers}
			// @ts-expect-error - onWheel is supported in React Native Web DOM nodes
			onWheel={Platform.OS === 'web' ? handleWheel : undefined}
		>
			<Animated.View
				style={[
					styles.imageContainer,
					{
						transform: [{scale}, {translateX}, {translateY}],
					},
				]}
			>
				<ImageView source={source} resizeMode={resizeMode} style={[styles.image, imageStyle]} />
			</Animated.View>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	imageContainer: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '100%',
		height: '100%',
	},
});
