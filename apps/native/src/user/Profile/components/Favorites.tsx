import {Text, View} from 'react-native';
import {useApiFetch} from '~/core/useApiFetch';
import styles from '~/user/styles';

export function FavoritePointsOfInterest() {
	const {data} = useApiFetch('location', 'PointOfInterestController', 'getPointOfInterestFavorites', {});

	const FavoritesField = ({label, value}: {label: string; value: string | number}) => (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<Text style={styles.value}>{value}</Text>
		</View>
	);

	return (
		<>
			<View style={styles.favoritesContainer}>
				{data?.map(favorite => (
					<>
						<FavoritesField label="Country" value={favorite.pointOfInterest.country} />
						<FavoritesField label="Region" value={favorite.pointOfInterest.region} />
						<FavoritesField label="Description" value={favorite.pointOfInterest.description} />
						<View style={styles.underline} />
					</>
				))}
			</View>
		</>
	);
}
