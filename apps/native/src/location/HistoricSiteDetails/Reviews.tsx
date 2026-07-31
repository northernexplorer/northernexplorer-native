import {View, Text} from 'react-native';
import {HistoricSiteType} from '@northernexplorer/types';
import {styles} from '~/location/HistoricSiteDetails/styles';
import {Spinner} from '~/layout/Layout/components/Spinner';

type ReviewDetailsProps = {
	data: HistoricSiteType;
	loading: boolean;
	error: Error | null;
};

export function ReviewDetails({data, loading}: ReviewDetailsProps) {
	if (loading) return <Spinner />;

	if (data.reviews?.length === 0) {
		return <Text style={styles.body}>No Reviews yet...</Text>;
	}

	return (
		<>
			<View style={styles.reviewCard}>
				{data.reviews?.map(review => (
					<View key={review.id}>
						<Text style={styles.title}>{review.rating}</Text>
						<Text style={styles.userName}>{review.user.username}</Text>
						<Text style={styles.score}>user score:{review.user.score}</Text>
						<Text style={styles.description}>{review.description}</Text>
					</View>
				))}
			</View>
		</>
	);
}
