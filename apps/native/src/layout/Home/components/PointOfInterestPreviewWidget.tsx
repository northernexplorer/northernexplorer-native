import React, {useMemo} from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import {calculateHaversineDistance, getImageUrl, getUrlSafeString} from '@northernexplorer/tools-web';
import {Ionicons} from '@expo/vector-icons';
import {styles} from '~/layout/Home/styles';
import {config} from '~/config';
import {useLocation} from '~/location/state/location/useLocation';
import {DIFFICULTY_CONFIG} from '~/location/PointOfInterestDetails/components/reviewOptions';

type Props = {
	id: string;
	name: string;
	description: string;
	image: string;
	country?: string | null;
	region?: string | null;
	latitude: number | string;
	longitude: number | string;
	rating?: number | string;
	difficulty?: keyof typeof DIFFICULTY_CONFIG;
	reviews?: {id: string; rating: number}[];
};

export function PointOfInterestPreviewWidget({
	id,
	name,
	description,
	image,
	country,
	region,
	latitude,
	longitude,
	rating,
	difficulty,
	reviews,
}: Props) {
	const coords = useLocation();

	const distance = useMemo(() => {
		if (!coords?.lat) return null;

		const userLat = Number(coords.lat);
		const userLon = Number(coords.lon);
		const siteLat = Number(latitude);
		const siteLon = Number(longitude);

		if (isNaN(userLat) || isNaN(userLon) || isNaN(siteLat) || isNaN(siteLon)) {
			return null;
		}

		const distInKm = calculateHaversineDistance(userLat, userLon, siteLat, siteLon);

		if (isNaN(distInKm)) {
			return null;
		}

		if (distInKm < 1) {
			return `${Math.round(distInKm * 1000)} m away`;
		}
		return `${distInKm.toFixed(1)} km away`;
	}, [coords, latitude, longitude]);

	const rawRating = rating ? (typeof rating === 'number' ? rating : parseFloat(String(rating))) : 0;
	const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;
	const reviewCount = reviews?.length ?? 0;
	const difficultyInfo = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

	return (
		<Link
			href={{
				pathname: '/[country]/[region]/[name]/[id]',
				params: {
					country: getUrlSafeString(country),
					region: getUrlSafeString(region),
					id: getUrlSafeString(id),
					name: getUrlSafeString(name),
				},
			}}
			asChild
		>
			<Pressable style={({pressed}) => [{opacity: pressed ? 0.85 : 1}]}>
				<View style={[styles.tile, styles.siteCard]}>
					<Image
						source={{uri: getImageUrl({path: image, cdn: config.CONTENT_DELIVERY_NETWORK})}}
						style={styles.siteImage}
						resizeMode="cover"
					/>
					<View style={styles.siteContent}>
						<View>
							<Text style={styles.siteTitle} numberOfLines={1}>
								{name}
							</Text>

							{/* Rating and Difficulty Row */}
							<View style={widgetStyles.metaRow}>
								{averageRating > 0 ? (
									<View style={widgetStyles.ratingRow}>
										<Ionicons name="star" size={12} color="#f59e0b" />
										<Text style={widgetStyles.ratingText}>{averageRating.toFixed(1)}</Text>
										<Text style={widgetStyles.countText}>({reviewCount})</Text>
									</View>
								) : (
									<Text style={widgetStyles.noReviewsText}>No reviews</Text>
								)}

								{difficultyInfo && (
									<View style={[widgetStyles.difficultyBadge, {backgroundColor: difficultyInfo.bgColor}]}>
										<Text style={[widgetStyles.difficultyText, {color: difficultyInfo.color}]}>
											{difficultyInfo.label.split(' ')[0]}
										</Text>
									</View>
								)}
							</View>

							<Text style={styles.siteDesc} numberOfLines={2}>
								{description}
							</Text>
						</View>

						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}>
							{region ? (
								<Text style={{color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase'}}>
									{region}
								</Text>
							) : (
								<View />
							)}

							{distance ? <Text style={{color: '#E0E0E0', fontSize: 10, fontWeight: '500'}}>{distance}</Text> : null}
						</View>
					</View>
				</View>
			</Pressable>
		</Link>
	);
}

const widgetStyles = StyleSheet.create({
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 4,
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
	},
	ratingText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#ffffff',
	},
	countText: {
		fontSize: 10,
		color: 'rgba(255,255,255,0.6)',
	},
	noReviewsText: {
		fontSize: 10,
		color: 'rgba(255,255,255,0.4)',
		fontStyle: 'italic',
	},
	difficultyBadge: {
		paddingHorizontal: 5,
		paddingVertical: 1,
		borderRadius: 4,
	},
	difficultyText: {
		fontSize: 9,
		fontWeight: '700',
	},
});
