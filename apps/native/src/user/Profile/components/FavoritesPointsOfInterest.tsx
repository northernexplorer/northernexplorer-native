import {ScrollView, View} from 'react-native';
import {useApiFetch} from '~/core/useApiFetch';
import styles from '~/user/styles';
import {PointOfInterestPreviewWidget} from '~/layout/Home/components/PointOfInterestPreviewWidget';
export function FavoritePointsOfInterest() {
	const {data} = useApiFetch('location', 'PointOfInterestController', 'getPointOfInterestFavorites', {});

	return (
		<>
			<View style={styles.favoritesContainer}>
				{data?.map(site => (
				
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 12}} key={site.id}>
							<PointOfInterestPreviewWidget
								key={site.id}
								name={site.pointOfInterest.name}
								image={site.image}
								description={site.pointOfInterest.description}
								country={site.pointOfInterest.country}
								region={site.pointOfInterest.region}
								id={site.pointOfInterest.id}
								latitude={site.pointOfInterest.lat}
								longitude={site.pointOfInterest.lon}
								difficulty={site.pointOfInterest.difficulty}
								rating={site.pointOfInterest.rating}
							/>
						</ScrollView>
					
				))}
			</View>
		</>
	);
}
