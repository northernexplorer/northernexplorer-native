import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FormField} from './FormField';

export interface CaptchaFieldProps<T extends string = 'captchaAnswer'> {
	fieldName?: T;
	label?: string;
	placeholder?: string;
	value: string;
	updateField: (name: T, value: string) => void;
	image?: string;
	svg?: string;
	onRefresh?: () => void;
	error?: string;
	loading?: boolean;
	refreshing?: boolean;
}

export function CaptchaField<T extends string = 'captchaAnswer'>({
	fieldName = 'captchaAnswer' as T,
	label = 'Security Verification',
	placeholder = 'Enter the code above',
	value,
	updateField,
	image,
	svg,
	onRefresh,
	error,
	loading = false,
	refreshing = false,
}: CaptchaFieldProps<T>) {
	const renderCaptchaImage = () => {
		if (refreshing || (loading && !image && !svg)) {
			return (
				<View style={styles.placeholderContainer}>
					<ActivityIndicator size="small" color="#0088cc" />
				</View>
			);
		}

		if (Platform.OS === 'web' && svg) {
			return (
				<View style={styles.imageContainer}>
					<div
						dangerouslySetInnerHTML={{__html: svg}}
						style={{
							width: 180,
							height: 50,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							userSelect: 'none',
						}}
					/>
				</View>
			);
		}

		if (image) {
			return (
				<View style={styles.imageContainer}>
					<Image source={{uri: image}} style={styles.image} resizeMode="contain" />
				</View>
			);
		}

		return (
			<View style={styles.placeholderContainer}>
				<Text style={styles.placeholderText}>No captcha loaded</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{label ? <Text style={styles.label}>{label}</Text> : null}

			<View style={styles.captchaRow}>
				{renderCaptchaImage()}

				{onRefresh && (
					<TouchableOpacity
						style={[styles.refreshButton, (loading || refreshing) && styles.disabledButton]}
						onPress={onRefresh}
						disabled={loading || refreshing}
						accessibilityLabel="Refresh security code"
						accessibilityRole="button"
						activeOpacity={0.7}
					>
						<Ionicons name="refresh-outline" size={20} color="#0088cc" />
						<Text style={styles.refreshText}>Refresh</Text>
					</TouchableOpacity>
				)}
			</View>

			<FormField
				fieldName={fieldName}
				placeholder={placeholder}
				value={value}
				updateField={updateField}
				error={error}
				loading={loading}
				autoCapitalize="characters"
				autoCorrect={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 8,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#333333',
	},
	captchaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	imageContainer: {
		width: 180,
		height: 50,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#f8fafc',
		borderWidth: 1,
		borderColor: '#cbd5e1',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 180,
		height: 50,
	},
	placeholderContainer: {
		width: 180,
		height: 50,
		borderRadius: 8,
		backgroundColor: '#f1f5f9',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	placeholderText: {
		fontSize: 12,
		color: '#64748b',
	},
	refreshButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#0088cc',
		backgroundColor: '#f0f9ff',
	},
	disabledButton: {
		opacity: 0.5,
	},
	refreshText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#0088cc',
	},
});
