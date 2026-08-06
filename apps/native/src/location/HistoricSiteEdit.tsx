import React from 'react';
import {View, Text, Image} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {getUrl} from '@northernexplorer/tools';
import {styles} from '~/location/HistoricSiteDetails/styles';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/elements/Spinner';

export function HistoricSiteEdit() {
	const {id} = useLocalSearchParams<{id: string}>();
	const {data, loading} = useApiFetch('location', 'HistoricSiteController', 'getHistoricSiteById', {id});

	if (loading || !data) return <Spinner />;

	return (
		<View>
			<Image source={{uri: getUrl({path: data.image, serverUrl: config.SERVER_URL})}} style={styles.banner} />
			<View style={styles.content}>
				<Text style={styles.breadcrumbs}>
					{data.country?.name} › {data.region?.name}
				</Text>

				<Text style={styles.title}>{data.name}</Text>

				<View style={styles.metaContainer}>
					<Text style={styles.metaLabel}>
						Coordinates: {data.lat}°, {data.lon}°
					</Text>
					<Text style={styles.metaLabel}>
						Dates: {data.startDate || 'Unknown'} - {data.endDate || 'Unknown'}
					</Text>
				</View>

				<View style={styles.divider} />

				<Text style={styles.body}>{data.description}</Text>
				<View style={styles.divider} />
			</View>
		</View>
	);
}
