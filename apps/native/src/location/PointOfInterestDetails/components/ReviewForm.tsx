import React, {useState} from 'react';
import {Pressable, View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FormField} from '@northernexplorer/tools';
import {ReviewRatingEnum} from '@northernexplorer/types';
import {Link, useLocalSearchParams} from 'expo-router';
import {styles} from '../styles';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type CreateReviewProps = {
	refetch: () => void;
};

type Review = {
	pointOfInterestId: string;
	description: string;
	rating: ReviewRatingEnum;
};

type RouteParams = {
	id: string;
};

type FormKeys = keyof Review;

const RATING_MAPPING = [
	{rating: ReviewRatingEnum.TERRIBLE, label: 'Terrible'},
	{rating: ReviewRatingEnum.POOR, label: 'Poor'},
	{rating: ReviewRatingEnum.AVERAGE, label: 'Average'},
	{rating: ReviewRatingEnum.GOOD, label: 'Good'},
	{rating: ReviewRatingEnum.EXCELLENT, label: 'Excellent'},
];

export default function CreateReview({refetch}: CreateReviewProps) {
	const authentication = useAuthentication();
	const {id} = useLocalSearchParams<RouteParams>();

	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
	const [submissionError, setSubmissionError] = useState<string | null>(null);

	const {mutate, loading: mutationLoading} = useApiMutation('location', 'ReviewController', 'createNewReview');

	const [formData, setFormData] = useState<Review>({
		pointOfInterestId: '',
		description: '',
		rating: ReviewRatingEnum.DEFAULT,
	});

	const updateField = (key: FormKeys, value: unknown) => {
		setFormData(prev => ({...prev, [key]: value}));
		if (errors[key]) {
			setErrors(prev => {
				const next = {...prev};
				delete next[key];
				return next;
			});
		}
	};

	const validateForm = async () => {
		const newErrors: Partial<Record<FormKeys, string>> = {};
		setSubmissionError(null);

		if (formData.description.trim().length < 10) {
			newErrors.description = 'Review must be at least 10 characters long';
		}
		if (formData.rating === ReviewRatingEnum.DEFAULT) {
			newErrors.rating = 'Please select a star rating';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			await handleSubmit();
		}
	};

	const handleSubmit = async () => {
		try {
			const response = await mutate({
				pointOfInterestId: id,
				description: formData.description,
				rating: formData.rating,
			});

			setFormData({
				pointOfInterestId: '',
				description: '',
				rating: ReviewRatingEnum.DEFAULT,
			});

			refetch();
			return response;
		} catch (error) {
			console.error(error);
			setSubmissionError(error instanceof Error ? error.message : 'An error occurred while submitting your review.');
		}
	};

	// Logged-out fallback state
	if (!authentication) {
		return (
			<Link href="profile/login" asChild>
				<View style={cardStyles.loggedOutCard}>
					<Ionicons name="chatbox-ellipses-outline" size={24} color="#64748b" />
					<Text style={cardStyles.loggedOutText}>Log in to leave a review</Text>
				</View>
			</Link>
		);
	}

	const currentSelectedLabel = RATING_MAPPING.find(r => r.rating === formData.rating)?.label;

	return (
		<View style={cardStyles.card}>
			{submissionError && (
				<View style={styles.errorBanner}>
					<Text style={styles.errorBannerText}>{submissionError}</Text>
				</View>
			)}

			{/* Header Row */}
			<View style={cardStyles.headerRow}>
				<Text style={cardStyles.title}>Write a Review</Text>

				<View style={cardStyles.starRow}>
					{RATING_MAPPING.map(item => {
						const isSelected = formData.rating !== ReviewRatingEnum.DEFAULT && formData.rating >= item.rating;

						return (
							<Pressable
								key={item.rating}
								onPress={() => updateField('rating', item.rating)}
								hitSlop={8}
								style={cardStyles.starTouchable}
							>
								<View style={[cardStyles.starIconContainer, isSelected && cardStyles.activeStarHalo]}>
									<Ionicons name={isSelected ? 'star' : 'star-outline'} size={24} color={isSelected ? '#f59e0b' : '#94a3b8'} />
								</View>
							</Pressable>
						);
					})}
				</View>
			</View>

			{/* Fixed-Height Rating Sub-Label / Error Row */}
			<View style={cardStyles.statusRow}>
				{errors.rating ? (
					<Text style={cardStyles.errorText}>{errors.rating}</Text>
				) : (
					<Text style={cardStyles.ratingStatusText}>{currentSelectedLabel ?? ''}</Text>
				)}
			</View>

			{/* Multiline Description Field */}
			<View style={cardStyles.fieldWrapper}>
				<FormField
					fieldName="description"
					placeholder="Share your experience visiting this location..."
					value={formData.description}
					updateField={updateField}
					loading={mutationLoading}
					error={errors.description}
					multiline={true}
					numberOfLines={4}
					textAlignVertical="top"
					style={cardStyles.multilineInput}
				/>
			</View>

			{/* Submit Button */}
			<Pressable
				onPress={validateForm}
				style={({pressed}) => [
					styles.submitButton,
					pressed && styles.submitButtonPressed,
					mutationLoading && styles.submitButtonDisabled,
					cardStyles.submitButton,
				]}
				disabled={mutationLoading}
			>
				{mutationLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.submitButtonText}>Submit Review</Text>}
			</Pressable>
		</View>
	);
}

const cardStyles = StyleSheet.create({
	card: {
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
	loggedOutCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderStyle: 'dashed',
		padding: 18,
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
	},
	loggedOutText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#64748b',
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 15,
		fontWeight: '700',
		color: '#0f172a',
	},
	starRow: {
		flexDirection: 'row',
		gap: 2,
		alignItems: 'center',
	},
	starTouchable: {
		padding: 2,
	},
	starIconContainer: {
		padding: 2,
		borderRadius: 6,
	},
	activeStarHalo: {
		backgroundColor: '#fef3c7',
	},
	statusRow: {
		minHeight: 18,
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginBottom: 6,
		marginTop: 2,
	},
	ratingStatusText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#d97706',
	},
	errorText: {
		fontSize: 11,
		fontWeight: '500',
		color: '#ef4444',
	},
	fieldWrapper: {
		marginBottom: 8,
	},
	multilineInput: {
		minHeight: 90,
		paddingTop: 10,
		paddingBottom: 10,
		textAlignVertical: 'top',
	},
	submitButton: {
		paddingVertical: 10,
		marginTop: 4,
	},
});
