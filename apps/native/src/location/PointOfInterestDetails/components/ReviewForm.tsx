import React, {useState} from 'react';
import {DropdownField, FormField} from '@northernexplorer/tools';
import {Pressable, View, Text} from 'react-native';
import {ReviewRatingEnum} from '@northernexplorer/types';
import {useLocalSearchParams} from 'expo-router';
import {styles} from '../styles';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
type CreateReviewProps = {
	refetch: () => void;
};

export default function CreateReview({refetch}: CreateReviewProps) {
	type Review = {
		pointOfInterestId: string;
		description: string;
		rating: ReviewRatingEnum;
	};

	type RouteParams = {
		id: string;
	};

	type FormKeys = keyof Review;

	const ratingOptions = [
		{label: 'select a rating', value: ReviewRatingEnum.DEFAULT},
		{label: 'terrible', value: ReviewRatingEnum.TERRIBLE},
		{label: 'poor', value: ReviewRatingEnum.POOR},
		{label: 'average', value: ReviewRatingEnum.AVERAGE},
		{label: 'good', value: ReviewRatingEnum.GOOD},
		{label: 'excellent', value: ReviewRatingEnum.EXCELLENT},
	];

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

		if (formData.description.trim().length < 40) newErrors.description = 'Description must be at least 40 characters long';
		if (formData.rating === 0) newErrors.rating = 'you must add a rating';

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

			refetch();

			return response;
		} catch (error) {
			console.error(error);
			setSubmissionError(error instanceof Error ? error.message : 'An error occurred while submitting your review.');
		}
	};
	if (authentication) {
		return (
			<>
				<View style={styles.reviewForm}>
					{submissionError && <Text style={[styles.errorText, {textAlign: 'center', marginVertical: 10}]}>{submissionError}</Text>}
					<Text style={styles.reviewTitle}>Leave a review below</Text>
					<FormField
						fieldName="description"
						label=""
						placeholder="leave a review.."
						value={formData.description}
						updateField={updateField}
						loading={mutationLoading}
						error={errors.description}
					/>
					<DropdownField
						fieldName="rating"
						value={formData.rating}
						label=""
						options={ratingOptions}
						updateField={updateField}
						loading={mutationLoading}
						error={errors.rating}
					/>

					<Pressable onPress={validateForm} style={[mutationLoading && {opacity: 0.6}]} disabled={mutationLoading}>
						<Text style={styles.submitReview}>{mutationLoading ? 'Submitting' : 'Submit'}</Text>
					</Pressable>
				</View>
			</>
		);
	}
}
