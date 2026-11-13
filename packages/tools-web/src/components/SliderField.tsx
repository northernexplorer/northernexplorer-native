import React, {ReactNode, useMemo, useRef, useState} from 'react';
import {LayoutChangeEvent, PanResponder, StyleSheet, Text, View} from 'react-native';

export interface SliderOption<V = unknown> {
	label: string;
	value?: V;
}

export type SliderFieldProps<V = unknown> = {
	label: string;
	minimumValue?: number;
	maximumValue?: number;
	step?: number;
	options?: (string | SliderOption<V>)[];
	value?: number;
	values?: [number, number];
	onValueChange?: (value: number) => void;
	onValuesChange?: (values: [number, number]) => void;
	getDisplayLabel?: (value: number) => string;
	getRangeDisplayLabel?: (values: [number, number]) => string;
	getDisplayContent?: (value: number | [number, number]) => ReactNode;
	minInteractiveValue?: number;
	maxInteractiveValue?: number;
	warningLabel?: string;
	disabled?: boolean;
};

const THUMB_SIZE = 20;

export function SliderField<V = unknown>({
	label,
	minimumValue,
	maximumValue,
	step = 1,
	options,
	value,
	values,
	onValueChange,
	onValuesChange,
	getDisplayLabel,
	getRangeDisplayLabel,
	getDisplayContent,
	minInteractiveValue,
	maxInteractiveValue,
	warningLabel,
	disabled = false,
}: SliderFieldProps<V>) {
	const min = minimumValue ?? 0;
	const max = maximumValue ?? (options ? Math.max(0, options.length - 1) : 100);
	const isRange = values !== undefined || onValuesChange !== undefined;

	const [trackWidth, setTrackWidth] = useState(280);

	const stateRef = useRef({
		min,
		max,
		step,
		disabled,
		isRange,
		value: value ?? min,
		values: values ?? [min, max],
		trackWidth,
		onValueChange,
		onValuesChange,
	});

	stateRef.current = {
		min,
		max,
		step,
		disabled,
		isRange,
		value: value ?? min,
		values: values ?? [min, max],
		trackWidth,
		onValueChange,
		onValuesChange,
	};

	const dragRef = useRef<{
		activeThumb: 'single' | 'min' | 'max' | null;
		startValues: [number, number];
		startSingleValue: number;
		startPosMin: number;
		startPosMax: number;
		startPosSingle: number;
	}>({
		activeThumb: null,
		startValues: [min, max],
		startSingleValue: min,
		startPosMin: 0,
		startPosMax: 0,
		startPosSingle: 0,
	});

	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => !stateRef.current.disabled,
				onMoveShouldSetPanResponder: () => !stateRef.current.disabled,
				onPanResponderGrant: evt => {
					const {
						min: sMin,
						max: sMax,
						step: sStep,
						isRange: sIsRange,
						value: sValue,
						values: sValues,
						trackWidth: sWidth,
						onValueChange: sOnVal,
						onValuesChange: sOnVals,
					} = stateRef.current;
					const usableWidth = Math.max(1, sWidth - THUMB_SIZE);
					const range = Math.max(1e-6, sMax - sMin);
					const touchX = evt.nativeEvent.locationX;

					if (!sIsRange) {
						const currentVal = sValue;
						const startPos = ((currentVal - sMin) / range) * usableWidth;
						dragRef.current = {
							activeThumb: 'single',
							startValues: [sMin, sMax],
							startSingleValue: currentVal,
							startPosMin: 0,
							startPosMax: 0,
							startPosSingle: startPos,
						};

						const ratio = Math.max(0, Math.min(1, (touchX - THUMB_SIZE / 2) / usableWidth));
						const rawVal = sMin + ratio * range;
						const steppedVal = Math.max(sMin, Math.min(sMax, Math.round((rawVal - sMin) / sStep) * sStep + sMin));
						if (sOnVal && steppedVal !== currentVal) {
							sOnVal(steppedVal);
						}
					} else {
						const [currMin, currMax] = sValues;
						const posMin = ((currMin - sMin) / range) * usableWidth;
						const posMax = ((currMax - sMin) / range) * usableWidth;

						const distMin = Math.abs(touchX - (posMin + THUMB_SIZE / 2));
						const distMax = Math.abs(touchX - (posMax + THUMB_SIZE / 2));

						let active: 'min' | 'max' = 'min';
						if (distMin < distMax) {
							active = 'min';
						} else if (distMax < distMin) {
							active = 'max';
						} else {
							active = touchX < posMin + THUMB_SIZE / 2 ? 'min' : 'max';
						}

						dragRef.current = {
							activeThumb: active,
							startValues: [currMin, currMax],
							startSingleValue: sMin,
							startPosMin: posMin,
							startPosMax: posMax,
							startPosSingle: 0,
						};

						const ratio = Math.max(0, Math.min(1, (touchX - THUMB_SIZE / 2) / usableWidth));
						const rawVal = sMin + ratio * range;
						const steppedVal = Math.max(sMin, Math.min(sMax, Math.round((rawVal - sMin) / sStep) * sStep + sMin));

						if (sOnVals) {
							if (active === 'min') {
								const newMin = Math.min(steppedVal, currMax);
								if (newMin !== currMin) {
									sOnVals([newMin, currMax]);
								}
							} else {
								const newMax = Math.max(steppedVal, currMin);
								if (newMax !== currMax) {
									sOnVals([currMin, newMax]);
								}
							}
						}
					}
				},
				onPanResponderMove: (_evt, gestureState) => {
					const {
						min: sMin,
						max: sMax,
						step: sStep,
						isRange: sIsRange,
						onValueChange: sOnVal,
						onValuesChange: sOnVals,
						trackWidth: sWidth,
					} = stateRef.current;
					const usableWidth = Math.max(1, sWidth - THUMB_SIZE);
					const range = Math.max(1e-6, sMax - sMin);
					const {activeThumb, startPosSingle, startPosMin, startPosMax, startValues} = dragRef.current;

					if (!sIsRange && activeThumb === 'single') {
						const targetX = startPosSingle + gestureState.dx;
						const ratio = Math.max(0, Math.min(1, targetX / usableWidth));
						const rawVal = sMin + ratio * range;
						const steppedVal = Math.max(sMin, Math.min(sMax, Math.round((rawVal - sMin) / sStep) * sStep + sMin));
						if (sOnVal && steppedVal !== stateRef.current.value) {
							sOnVal(steppedVal);
						}
					} else if (sIsRange && activeThumb) {
						if (activeThumb === 'min') {
							const targetX = startPosMin + gestureState.dx;
							const ratio = Math.max(0, Math.min(1, targetX / usableWidth));
							const rawVal = sMin + ratio * range;
							const steppedVal = Math.max(sMin, Math.min(startValues[1], Math.round((rawVal - sMin) / sStep) * sStep + sMin));
							if (sOnVals && (steppedVal !== stateRef.current.values[0] || startValues[1] !== stateRef.current.values[1])) {
								sOnVals([steppedVal, startValues[1]]);
							}
						} else if (activeThumb === 'max') {
							const targetX = startPosMax + gestureState.dx;
							const ratio = Math.max(0, Math.min(1, targetX / usableWidth));
							const rawVal = sMin + ratio * range;
							const steppedVal = Math.max(startValues[0], Math.min(sMax, Math.round((rawVal - sMin) / sStep) * sStep + sMin));
							if (sOnVals && (startValues[0] !== stateRef.current.values[0] || steppedVal !== stateRef.current.values[1])) {
								sOnVals([startValues[0], steppedVal]);
							}
						}
					}
				},
				onPanResponderRelease: () => {
					dragRef.current.activeThumb = null;
				},
				onPanResponderTerminate: () => {
					dragRef.current.activeThumb = null;
				},
			}),
		[],
	);

	const displayVal = useMemo(() => {
		if (isRange) {
			const currentValues = values ?? [min, max];
			if (getRangeDisplayLabel) {
				return getRangeDisplayLabel(currentValues);
			}
			const formatVal = (v: number) => {
				if (getDisplayLabel) {
					return getDisplayLabel(v);
				}
				if (options && v >= 0 && v < options.length) {
					const opt = options[v];
					return typeof opt === 'string' ? opt : opt.label;
				}
				return String(v);
			};
			if (currentValues[0] === currentValues[1]) {
				return formatVal(currentValues[0]);
			}
			return `${formatVal(currentValues[0])} – ${formatVal(currentValues[1])}`;
		}

		const currentVal = value ?? min;
		if (getDisplayLabel) {
			return getDisplayLabel(currentVal);
		}
		if (options && currentVal >= 0 && currentVal < options.length) {
			const opt = options[currentVal];
			return typeof opt === 'string' ? opt : opt.label;
		}
		return String(currentVal);
	}, [isRange, values, min, max, getRangeDisplayLabel, getDisplayLabel, options, value]);

	const isRestricted = isRange
		? (maxInteractiveValue !== undefined && (values?.[1] ?? max) > maxInteractiveValue) ||
			(minInteractiveValue !== undefined && (values?.[0] ?? min) < minInteractiveValue)
		: (maxInteractiveValue !== undefined && (value ?? min) > maxInteractiveValue) ||
			(minInteractiveValue !== undefined && (value ?? min) < minInteractiveValue);

	const usableWidth = Math.max(1, trackWidth - THUMB_SIZE);
	const range = Math.max(1e-6, max - min);

	const activeColor = disabled ? '#666666' : isRestricted ? '#e67e22' : '#0088cc';

	const posMin = isRange ? (((values?.[0] ?? min) - min) / range) * usableWidth : 0;
	const posMax = isRange ? (((values?.[1] ?? max) - min) / range) * usableWidth : (((value ?? min) - min) / range) * usableWidth;

	const activeTrackLeft = isRange ? posMin + THUMB_SIZE / 2 : THUMB_SIZE / 2;
	const activeTrackWidth = isRange ? Math.max(0, posMax - posMin) : posMax;

	const handleLayout = (e: LayoutChangeEvent) => {
		const width = e.nativeEvent.layout.width;
		if (width > 0 && width !== trackWidth) {
			setTrackWidth(width);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.label}>{label}</Text>
				<View style={styles.valueContainer}>
					{getDisplayContent ? (
						getDisplayContent(isRange ? (values ?? [min, max]) : (value ?? min))
					) : (
						<Text style={[styles.valueText, isRestricted && styles.restrictedValueText]}>{displayVal}</Text>
					)}
					{isRestricted && <Text style={[styles.valueText, styles.restrictedValueText]}>(Locked)</Text>}
				</View>
			</View>
			<View style={styles.sliderWrapper} onLayout={handleLayout} {...panResponder.panHandlers}>
				<View style={styles.trackBackground} />
				<View
					style={[
						styles.trackActive,
						{
							left: activeTrackLeft,
							width: activeTrackWidth,
							backgroundColor: activeColor,
						},
					]}
				/>
				{isRange && (
					<View
						style={[
							styles.thumb,
							{
								left: posMin,
								backgroundColor: activeColor,
							},
						]}
					/>
				)}
				<View
					style={[
						styles.thumb,
						{
							left: posMax,
							backgroundColor: activeColor,
						},
					]}
				/>
			</View>
			{isRestricted && warningLabel && <Text style={styles.warningText}>{warningLabel}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 4,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 2,
	},
	valueContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#EEE',
	},
	valueText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#0088cc',
	},
	restrictedValueText: {
		color: '#e67e22',
	},
	warningText: {
		fontSize: 11,
		color: '#e67e22',
		marginTop: -4,
		marginBottom: 4,
	},
	sliderWrapper: {
		width: '100%',
		height: 36,
		justifyContent: 'center',
		position: 'relative',
	},
	trackBackground: {
		position: 'absolute',
		left: THUMB_SIZE / 2,
		right: THUMB_SIZE / 2,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#333333',
	},
	trackActive: {
		position: 'absolute',
		height: 4,
		borderRadius: 2,
	},
	thumb: {
		position: 'absolute',
		top: (36 - THUMB_SIZE) / 2,
		width: THUMB_SIZE,
		height: THUMB_SIZE,
		borderRadius: THUMB_SIZE / 2,
		borderWidth: 2,
		borderColor: '#ffffff',
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 4,
	},
});
