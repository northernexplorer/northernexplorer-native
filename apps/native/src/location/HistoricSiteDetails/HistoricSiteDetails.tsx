import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Link, useLocalSearchParams} from 'expo-router';
import {getUrl, getUrlSafeString, Spinner} from '@northernexplorer/tools';
import {RolesEnum} from '@northernexplorer/types';
import {ReviewDetails} from './components/Reviews';
import {styles} from '~/location/HistoricSiteDetails/styles';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

export function HistoricSiteDetails() {
	const {id} = useLocalSearchParams<{id: string}>();
	const auth = useAuthentication();
	const {data, loading} = useApiFetch('location', 'HistoricSiteController', 'getHistoricSiteById', {id});

	if (loading || !data) return <Spinner />;

	return (
		<View>
			<Image source={{uri: getUrl({path: data.image, serverUrl: config.SERVER_URL})}} style={styles.banner} />
			<View style={styles.content}>
				<View style={styles.headerRow}>
					<Text style={styles.breadcrumbs}>
						{data.country.name} › {data.region.name}
					</Text>
					{auth?.roles?.includes(RolesEnum.Admin) && (
						<Link
							href={{
								pathname: '/[country]/[region]/[name]/[id]/edit',
								params: {
									country: getUrlSafeString(data.country.name),
									region: getUrlSafeString(data.region.name),
									id: getUrlSafeString(data.id),
									name: getUrlSafeString(data.name),
								},
							}}
							asChild
						>
							<TouchableOpacity style={styles.editButton}>
								<Text style={styles.editButtonText}>Edit</Text>
							</TouchableOpacity>
						</Link>
					)}
				</View>

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
				<ReviewDetails data={data} loading={loading} />
			</View>
		</View>
	);
}
