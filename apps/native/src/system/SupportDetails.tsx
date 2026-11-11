import React from 'react';
import {Text, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {formatDate, Spinner} from '@northernexplorer/tools-web';
import {Markdown} from '~/layout/Layout';
import {useApiFetch} from '~/core/useApiFetch';
import {styles} from '~/location/PointOfInterestDetails/styles';

export function SupportDetails() {
	const {url} = useLocalSearchParams<{url: string}>();
	const {data, loading} = useApiFetch('system', 'SupportController', 'getByUrl', {url});

	if (loading || !data) return <Spinner />;

	return (
		<View>
			<View style={styles.content}>
				<View style={styles.headerRow}>
					<Text style={styles.breadcrumbs}>{data.categoryPath.map(category => category.name).join(' › ')}</Text>
				</View>
				<Text style={styles.title}>{data.title}</Text>

				<View style={styles.metaContainer}>
					<Text style={styles.metaLabel}>Created At: {formatDate(data.createdAt)}</Text>
					<Text style={styles.metaLabel}>Updated At: {formatDate(data.updatedAt)}</Text>
					<Text style={styles.metaLabel}>Category: {data.category.name}</Text>
				</View>

				<View style={styles.divider} />
				<Markdown content={data.content} />
			</View>
		</View>
	);
}
