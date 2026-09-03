import React, {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FormField} from '@northernexplorer/tools';
import {EntranceCostEnum, ReviewRatingEnum, ReviewType, SiteConditionEnum, SiteDifficultyEnum} from '@northernexplorer/types';
import {Link, useLocalSearchParams} from 'expo-router';
import {CONDITION_OPTIONS, COST_OPTIONS, DIFFICULTY_OPTIONS, RATING_MAPPING} from './reviewOptions';
import {useApiMutation} from '~/core/useApiMutation';
import {styles as globalStyles} from '~/location/PointOfInterestDetails/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type CreateReviewProps = {
	refetch: () => void;
	initialData?: ReviewType;
	onCancel?: () => void;
};

type RouteParams = {
	id: string;
};

type ReviewFormState = {
	pointOfInterestId: string;
	description: string;
	rating: ReviewRatingEnum;
	difficulty: SiteDifficultyEnum | null;
	entranceCost: EntranceCostEnum | null;
	conditions: SiteConditionEnum[];
};

type FormKeys = keyof ReviewFormState;

export function ReviewForm({refetch, initialData, onCancel}: CreateReviewProps) {
	const authentication = useAuthentication();
	const {id} = useLocalSearchParams<RouteParams>();

	const isEditing = Boolean(initialData);

	const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});
	const [submissionError, setSubmissionError] = useState<string | null>(null);

	const createMutation = useApiMutation('location', 'ReviewController', 'createNewReview');
	const updateMutation = useApiMutation('location', 'ReviewController', 'editReview');

	const mutation = isEditing ? updateMutation : createMutation;

	const [formData, setFormData] = useState<ReviewFormState>({
		pointOfInterestId: id || initialData?.pointOfInterest.id || '',
		description: initialData?.description ?? '',
		rating: initialData?.rating ?? ReviewRatingEnum.DEFAULT,
		difficulty: initialData?.difficulty ?? null,
		entranceCost: initialData?.entranceCost ?? null,
		conditions: initialData?.conditions ?? [],
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

	const toggleCondition = (condition: SiteConditionEnum) => {
		setFormData(prev => {
			const exists = prev.conditions.includes(condition);
			const conditions = exists ? prev.conditions.filter(item => item !== condition) : [...prev.conditions, condition];
			return {...prev, conditions};
		});
	};

	const validateForm = async () => {
		const newErrors: Partial<Record<FormKeys, string>> = {};
		setSubmissionError(null);

		if (formData.rating === ReviewRatingEnum.DEFAULT) {
			newErrors.rating = 'Please select an overall rating';
		}
		if (!formData.difficulty) {
			newErrors.difficulty = 'Please select access difficulty';
		}
		if (!formData.entranceCost) {
			newErrors.entranceCost = 'Please select entrance cost';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			await handleSubmit();
		}
	};

	const handleSubmit = async () => {
		try {
			let response;

			if (isEditing) {
				response = await updateMutation.mutate({
					id: initialData!.id,
					description: formData.description || '',
					rating: formData.rating,
					difficulty: formData.difficulty!,
					entranceCost: formData.entranceCost!,
					conditions: formData.conditions,
				});
			} else {
				response = await createMutation.mutate({
					pointOfInterestId: id,
					description: formData.description || '',
					rating: formData.rating,
					difficulty: formData.difficulty!,
					entranceCost: formData.entranceCost!,
					conditions: formData.conditions,
				});

				setFormData({
					pointOfInterestId: '',
					description: '',
					rating: ReviewRatingEnum.DEFAULT,
					difficulty: null,
					entranceCost: null,
					conditions: [],
				});
			}

			refetch();
			return response;
		} catch (error) {
			console.error(error);
			setSubmissionError(error instanceof Error ? error.message : 'An error occurred while submitting your review.');
		}
	};

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
				<View style={globalStyles.errorBanner}>
					<Text style={globalStyles.errorBannerText}>{submissionError}</Text>
				</View>
			)}

			{/* Overall Impression */}
			<View style={cardStyles.overallSection}>
				<Text style={cardStyles.sectionLabelBold}>{isEditing ? 'Edit Your Review' : 'Overall Impression'}</Text>
				<View style={cardStyles.ratingRow}>
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

					<View style={cardStyles.statusWrapper}>
						{errors.rating ? (
							<Text style={cardStyles.errorText}>{errors.rating}</Text>
						) : (
							<Text style={cardStyles.ratingStatusText}>{currentSelectedLabel ?? ''}</Text>
						)}
					</View>
				</View>
			</View>

			{/* Difficulty Selection */}
			<View style={cardStyles.section}>
				<View style={cardStyles.sectionHeaderRow}>
					<Text style={cardStyles.sectionLabel}>Difficulty to Access</Text>
					{errors.difficulty && <Text style={cardStyles.errorText}>{errors.difficulty}</Text>}
				</View>
				<View style={cardStyles.chipGroup}>
					{DIFFICULTY_OPTIONS.map(opt => {
						const selected = formData.difficulty === opt.value;
						return (
							<Pressable
								key={opt.value}
								onPress={() => updateField('difficulty', opt.value)}
								style={[
									cardStyles.chip,
									selected && {
										backgroundColor: opt.bgColor,
										borderColor: opt.borderColor,
									},
								]}
							>
								<Text style={[cardStyles.chipText, selected && cardStyles.chipTextSelected]}>{opt.label}</Text>
							</Pressable>
						);
					})}
				</View>
			</View>

			{/* Entrance Cost Selection */}
			<View style={cardStyles.section}>
				<View style={cardStyles.sectionHeaderRow}>
					<Text style={cardStyles.sectionLabel}>Entrance Cost</Text>
					{errors.entranceCost && <Text style={cardStyles.errorText}>{errors.entranceCost}</Text>}
				</View>
				<View style={cardStyles.chipGroup}>
					{COST_OPTIONS.map(opt => {
						const selected = formData.entranceCost === opt.value;
						return (
							<Pressable
								key={opt.value}
								onPress={() => updateField('entranceCost', opt.value)}
								style={[cardStyles.chip, selected && cardStyles.chipSelected]}
							>
								<Text style={[cardStyles.chipText, selected && cardStyles.chipTextSelected]}>{opt.label}</Text>
							</Pressable>
						);
					})}
				</View>
			</View>

			{/* Conditions Selection */}
			<View style={cardStyles.section}>
				<Text style={cardStyles.sectionLabel}>Current Conditions</Text>
				<View style={cardStyles.chipGroup}>
					{CONDITION_OPTIONS.map(opt => {
						const selected = formData.conditions.includes(opt.value);
						return (
							<Pressable
								key={opt.value}
								onPress={() => toggleCondition(opt.value)}
								style={[cardStyles.chip, cardStyles.iconChip, selected && cardStyles.chipSelectedWarning]}
							>
								<Ionicons name={opt.icon} size={14} color={selected ? '#ffffff' : '#64748b'} />
								<Text style={[cardStyles.chipText, selected && cardStyles.chipTextSelectedWarning]}>{opt.label}</Text>
							</Pressable>
						);
					})}
				</View>
			</View>

			{/* Description Field */}
			<View style={cardStyles.fieldWrapper}>
				<Text style={cardStyles.sectionLabel}>Written Review</Text>
				<FormField
					fieldName="description"
					placeholder="Share details about access, trail conditions, or recommendations..."
					value={formData.description}
					updateField={updateField}
					loading={mutation.loading}
					error={errors.description}
					multiline={true}
					numberOfLines={4}
					textAlignVertical="top"
					style={cardStyles.multilineInput}
				/>
			</View>

			{/* Action Buttons Row */}
			<View style={cardStyles.buttonRow}>
				{isEditing && onCancel && (
					<Pressable onPress={onCancel} style={[cardStyles.actionButton, cardStyles.cancelButton]} disabled={mutation.loading}>
						<Text style={cardStyles.cancelButtonText}>Cancel</Text>
					</Pressable>
				)}

				<Pressable
					onPress={validateForm}
					style={({pressed}) => [
						globalStyles.submitButton,
						cardStyles.actionButton,
						pressed && globalStyles.submitButtonPressed,
						mutation.loading && globalStyles.submitButtonDisabled,
						isEditing && cardStyles.flexButton,
					]}
					disabled={mutation.loading}
				>
					{mutation.loading ? (
						<ActivityIndicator color="#ffffff" size="small" />
					) : (
						<Text style={globalStyles.submitButtonText}>{isEditing ? 'Save Changes' : 'Submit Review'}</Text>
					)}
				</Pressable>
			</View>
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
	overallSection: {
		marginBottom: 12,
	},
	sectionLabelBold: {
		fontSize: 14,
		fontWeight: '700',
		color: '#0f172a',
		marginBottom: 4,
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	starRow: {
		flexDirection: 'row',
		gap: 2,
		alignItems: 'center',
	},
	starTouchable: {
		padding: 1,
	},
	starIconContainer: {
		padding: 2,
		borderRadius: 6,
	},
	activeStarHalo: {
		backgroundColor: '#fef3c7',
	},
	statusWrapper: {
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	ratingStatusText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#d97706',
	},
	errorText: {
		fontSize: 11,
		fontWeight: '500',
		color: '#ef4444',
	},
	section: {
		marginBottom: 12,
	},
	sectionHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 6,
	},
	sectionLabel: {
		fontSize: 13,
		fontWeight: '600',
		color: '#334155',
		marginBottom: 6,
	},
	chipGroup: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	chip: {
		backgroundColor: '#f1f5f9',
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 16,
		paddingVertical: 6,
		paddingHorizontal: 10,
	},
	iconChip: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
	chipSelected: {
		backgroundColor: '#0284c7',
		borderColor: '#0284c7',
	},
	chipSelectedWarning: {
		backgroundColor: '#ea580c',
		borderColor: '#ea580c',
	},
	chipText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#475569',
	},
	chipTextSelected: {
		color: '#ffffff',
		fontWeight: '600',
	},
	chipTextSelectedWarning: {
		color: '#ffffff',
		fontWeight: '600',
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
	buttonRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginTop: 8,
	},
	actionButton: {
		paddingVertical: 10,
	},
	flexButton: {
		flex: 1,
	},
	cancelButton: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 8,
		backgroundColor: '#f1f5f9',
		borderWidth: 1,
		borderColor: '#cbd5e1',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#475569',
	},
});
