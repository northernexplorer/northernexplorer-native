import React from 'react';
import {View, Text} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {Spinner} from '@northernexplorer/tools';
import {Markdown} from '~/layout/Layout';
import {useApiFetch} from '~/core/useApiFetch';
import styles from '~/user/styles';

export function SupportDetails() {
	const {url} = useLocalSearchParams<{url: string}>();
	const {data, loading} = useApiFetch('system', 'SupportController', 'getByUrl', {url});

	if (loading || !data) return <Spinner />;

	return (
		<View style={styles.container}>
			<Text>{data.title}</Text>
			<Markdown content={data.content} />
		</View>
	);
}
