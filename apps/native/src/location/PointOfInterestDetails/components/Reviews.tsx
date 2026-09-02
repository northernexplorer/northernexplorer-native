import {View, Text} from 'react-native';
import {PointOfInterestType} from '@northernexplorer/types';
import {Spinner} from '@northernexplorer/tools';
import CreateReview from './ReviewForm';
import {styles} from '~/location/PointOfInterestDetails/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type ReviewDetailsProps = {
	data: PointOfInterestType;
	loading: boolean;
	refetch: () => void;
};

export function ReviewDetails({data, loading, refetch}: ReviewDetailsProps) {
	const authentication = useAuthentication();

	if (loading) return <Spinner />;

	const myReviews = data.reviews?.filter(review => review.user.id === authentication?.userId);
	const otherReviews = data.reviews?.filter(review => review.user.id !== authentication?.userId);

	const noReviews = !data.reviews || data.reviews.length === 0;

	return (
		<>
			<CreateReview refetch={refetch} />
			{noReviews ? (
				<Text style={styles.body}>No Reviews yet...</Text>
			) : (
				<View style={[styles.reviewCard, {flex: 1}]}>
					{myReviews?.map(review => (
						<View key={review.id}>
							<Text style={styles.title}>{review.rating}</Text>
							<Text style={styles.userName}>{review.user.username}</Text>
							<Text style={styles.score}>user score:{review.user.score}</Text>
							<Text style={styles.description}>{review.description}</Text>
						</View>
					))}
					{otherReviews?.map(review => (
						<View key={review.id}>
							<Text style={styles.title}>{review.rating}</Text>
							<Text style={styles.userName}>{review.user.username}</Text>
							<Text style={styles.score}>user score:{review.user.score}</Text>
							<Text style={styles.description}>{review.description}</Text>
						</View>
					))}
				</View>
			)}
		</>
	);
}
