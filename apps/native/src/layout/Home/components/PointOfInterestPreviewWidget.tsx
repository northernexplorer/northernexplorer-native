import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {getUrl, getUrlSafeString} from '@northernexplorer/tools';
import {styles} from '~/layout/Home/styles';
import {config} from '~/config';

type Props = {
	id: string;
	name: string;
	description: string;
	image: string;
	country?: string | null;
	region?: string | null;
};

export function PointOfInterestPreviewWidget({id, name, description, image, country, region}: Props) {
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
						{region ? (
							<Text style={{color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase'}}>
								{region}
							</Text>
						) : null}
					</View>
				</View>
			</Pressable>
		</Link>
	);
}
