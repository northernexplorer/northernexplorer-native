import React, {useMemo} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {calculateHaversineDistance, getUrl, getUrlSafeString} from '@northernexplorer/tools';
import {styles} from '~/layout/Home/styles';
import {config} from '~/config';
import {useLocation} from '~/location/state/location/useLocation';

type Props = {
	id: string;
	name: string;
	description: string;
	image: string;
	country?: string | null;
	region?: string | null;
	latitude: number | string;
	longitude: number | string;
};

export function PointOfInterestPreviewWidget({id, name, description, image, country, region, latitude, longitude}: Props) {
	const coords = useLocation();

	const distance = useMemo(() => {
		if (!coords?.lat) return null;

		const userLat = Number(coords.lat);
		const userLon = Number(coords.lon);
		const siteLat = Number(latitude);
		const siteLon = Number(longitude);

		// Guard against non-numeric values
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
					<Image source={{uri: getUrl({path: image, serverUrl: config.SERVER_URL})}} style={styles.siteImage} resizeMode="cover" />
					<View style={styles.siteContent}>
						<View>
							<Text style={styles.siteTitle} numberOfLines={1}>
								{name}
							</Text>
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
