import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Column, Spinner, Table} from '@northernexplorer/tools';
import {RolesEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

export function PendingReviews() {
	const router = useRouter();
	const authentication = useAuthentication();
	const {data: reviews, loading} = useApiFetch('location', 'ReviewController', 'getPendingReviews', {});

	if (!authentication) return <Redirect href="/profile/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	type ReviewItem = NonNullable<typeof reviews>[number];

	const columns: Column<ReviewItem>[] = [
		{
			key: 'user',
			title: 'User',
			flex: 2,
			render: review => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.userName} numberOfLines={1}>
						{review.user.username || `${review.user.firstName} ${review.user.lastName}`.trim() || 'Anonymous'}
					</Text>
					<Text style={styles.userScore}>Score: {review.user.score}</Text>
				</View>
			),
		},
		{
			key: 'pointOfInterest',
			title: 'Point of Interest',
			flex: 3,
			render: review => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.poiName} numberOfLines={1}>
						{review.pointOfInterest.name}
					</Text>
					<Text style={styles.reviewDescription} numberOfLines={1}>
						{review.description || 'No comment provided'}
					</Text>
				</View>
			),
		},
		{
			key: 'rating',
			title: 'Rating',
			width: 80,
			render: review => (
				<View style={styles.ratingContainer}>
					<Ionicons name="star" size={14} color="#f59e0b" />
					<Text style={styles.ratingText}>{review.rating}/5</Text>
				</View>
			),
		},
		{
			key: 'metadata',
			title: 'Details',
			flex: 3,
			render: review => (
				<View style={{paddingRight: 12}}>
					<Text style={styles.metaText} numberOfLines={1}>
						Diff: {review.difficulty} | Cost: {review.entranceCost}
					</Text>
					<Text style={styles.conditionsText} numberOfLines={1}>
						{Array.isArray(review.conditions) && review.conditions.length > 0 ? review.conditions.join(', ') : 'No conditions reported'}
					</Text>
				</View>
			),
		},
		{
			key: 'action',
			width: 30,
			align: 'right',
			render: () => <Ionicons name="chevron-forward" size={18} color="#adb5bd" />,
		},
	];

	return (
		<Table
			data={reviews}
			columns={columns}
			keyExtractor={review => review.id}
			emptyText="No pending reviews awaiting moderation."
			emptyIcon="chatbox-ellipses-outline"
			onRowPress={review => router.push(`/admin/pending-reviews/${review.id}`)}
		/>
	);
}

const styles = StyleSheet.create({
	userName: {fontSize: 14, fontWeight: '600', color: '#212529'},
	userScore: {fontSize: 11, color: '#868e96', marginTop: 1},
	poiName: {fontSize: 14, fontWeight: '600', color: '#212529'},
	reviewDescription: {fontSize: 12, color: '#6c757d', marginTop: 2},
	ratingContainer: {flexDirection: 'row', alignItems: 'center', gap: 4},
	ratingText: {fontSize: 13, fontWeight: '600', color: '#343a40'},
	metaText: {fontSize: 12, fontWeight: '500', color: '#495057'},
	conditionsText: {fontSize: 11, color: '#868e96', marginTop: 1},
});
