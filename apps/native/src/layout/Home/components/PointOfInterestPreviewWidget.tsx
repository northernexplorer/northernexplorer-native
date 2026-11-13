import React, {useMemo} from 'react';
import {GestureResponderEvent, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Link} from 'expo-router';
import {calculateHaversineDistance, getImageUrl, getUrlSafeString} from '@northernexplorer/tools-web';
import {Ionicons} from '@expo/vector-icons';
import {ImageHeaderType} from '@northernexplorer/types';
import {styles as globalStyles} from '~/layout/Home/styles';
import {config} from '~/config';
import {useLocation} from '~/location/state/location/useLocation';
import {DIFFICULTY_CONFIG} from '~/location/PointOfInterestDetails/components/reviewOptions';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {hasSiteDifficultyAccess} from '~/location/lib/siteDifficulty';
import {usePermissions} from '~/user/state/subscription';
import {SubscriptionRequiredNotice} from '~/location/components/SubscriptionRequiredNotice';
import {DifficultyLabel} from '~/location/components/DifficultyLabel';

type PreviewProps = {
	name: string;
	description: string;
	image: ImageHeaderType;
	region?: string | null;
	latitude: number | string;
	longitude: number | string;
	rating?: number | string;
	difficulty?: keyof typeof DIFFICULTY_CONFIG;
	reviews?: {id: string; rating: number}[];
};

type Props = PreviewProps & {
	id: string;
	country?: string | null;
	onPress?: (event: GestureResponderEvent) => void;
};

export function PointOfInterestPreviewWidget({id, country, onPress, ...previewProps}: Props) {
	const {isOffline} = useIsOffline();
	const card = (
		<Pressable disabled={isOffline} onPress={onPress} style={({pressed}) => [{opacity: pressed ? 0.85 : 1}]}>
			<PointOfInterestPreview {...previewProps} />
		</Pressable>
	);

	if (isOffline || onPress) {
		return card;
	}

	return (
		<Link
			href={{
				pathname: '/[country]/[region]/[name]/[id]',
				params: {
					country: getUrlSafeString(country),
					region: getUrlSafeString(previewProps.region),
					id: getUrlSafeString(id),
					name: getUrlSafeString(previewProps.name),
				},
			}}
			asChild
		>
			{card}
		</Link>
	);
}

export function PointOfInterestPreview({name, description, image, region, latitude, longitude, rating, difficulty, reviews}: PreviewProps) {
	const coords = useLocation();
	const permissions = usePermissions();
	const canAccessRemoteDifficulty = permissions?.navigation.useRemoteDifficulty ?? false;
	const isRestricted = !hasSiteDifficultyAccess(difficulty, canAccessRemoteDifficulty);

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
		<View style={[globalStyles.tile, widgetStyles.card]}>
			<Image
				source={{
					uri: getImageUrl({
						path: image.url,
						cdn: config.CONTENT_DELIVERY_NETWORK,
						processed: image.processed,
						size: 'thumbnail',
					}),
				}}
				style={widgetStyles.image}
				blurRadius={isRestricted ? 10 : 0}
				resizeMode="cover"
			/>
			{isRestricted ? (
				<View style={[widgetStyles.content, widgetStyles.restrictedContent]}>
					<SubscriptionRequiredNotice />
				</View>
			) : (
				<View style={widgetStyles.content}>
					<View>
						<Text style={widgetStyles.title} numberOfLines={1}>
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
									<DifficultyLabel
										difficulty={difficulty as keyof typeof DIFFICULTY_CONFIG}
										iconSize={10}
										textStyle={widgetStyles.difficultyText}
									/>
								</View>
							)}
						</View>

						<Text style={widgetStyles.description} numberOfLines={2}>
							{description}
						</Text>
					</View>

					<View style={widgetStyles.footer}>
						{region ? (
							<Text style={widgetStyles.regionText} numberOfLines={1}>
								{region}
							</Text>
						) : (
							<View />
						)}

						{distance ? <Text style={widgetStyles.distanceText}>{distance}</Text> : null}
					</View>
				</View>
			)}
		</View>
	);
}

const widgetStyles = StyleSheet.create({
	card: {
		backgroundColor: '#232323',
		padding: 0,
		overflow: 'hidden',
		flexDirection: 'column',
		width: 200,
		height: 240,
	},
	image: {
		width: '100%',
		height: 120,
	},
	content: {
		padding: 12,
		justifyContent: 'space-between',
		flex: 1,
	},
	title: {
		color: '#ffffff',
		fontSize: 15,
		fontWeight: '700',
	},
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		marginVertical: 4,
		gap: 4,
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
		color: '#94a3b8',
	},
	noReviewsText: {
		fontSize: 10,
		color: '#64748b',
		fontStyle: 'italic',
	},
	difficultyBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	difficultyText: {
		fontSize: 9,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	description: {
		color: '#94a3b8',
		fontSize: 12,
		lineHeight: 16,
		marginTop: 2,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
	},
	regionText: {
		color: '#38bdf8',
		fontSize: 10,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	distanceText: {
		color: '#cbd5e1',
		fontSize: 10,
		fontWeight: '600',
	},
	restrictedContent: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});
