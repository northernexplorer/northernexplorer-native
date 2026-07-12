import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {styles} from '~/layout/Home/styles';
import {getUrl, getUrlSafeString} from '@northernexplorer/tools';
import {config} from '~/config';

type Props = {
	id: number;
	name: string;
	description: string;
	image: string;
	country: string;
	region?: string | null;
};

export function HistoricSitePreview({id, name, description, image, country, region}: Props) {
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
			<Pressable>
				<View style={[styles.tile, {width: 160, height: 175, overflow: 'hidden'}]}>
					<Image
						source={{uri: getUrl({path: image, serverUrl: config.SERVER_URL})}}
						style={{
							width: '100%',
							height: 90,
						}}
						resizeMode="cover"
					/>
					<View style={{padding: 10, flex: 1, justifyContent: 'flex-start'}}>
						<Text
							style={{
								color: 'rgba(255,255,255,0.9)',
								fontSize: 14,
								fontWeight: '600',
							}}
							numberOfLines={1}
						>
							{name}
						</Text>

						<Text
							style={{
								color: 'rgba(255,255,255,0.6)',
								fontSize: 12,
								marginTop: 6,
								lineHeight: 16,
							}}
							numberOfLines={2}
						>
							{description}
						</Text>
					</View>
				</View>
			</Pressable>
		</Link>
	);
}
