import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import {Link} from 'expo-router';
import {Spinner} from '@northernexplorer/tools';
import {SupportHeadingType} from '@northernexplorer/types';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';

export function Support() {
	const {data, loading} = useApiFetch('system', 'SupportController', 'getHeadings', {});

	const groupedData = useMemo(() => {
		if (!data) return {};
		return data.reduce(
			(acc, item) => {
				const category = item.category;
				if (!(category in acc)) {
					acc[category] = [];
				}
				acc[category].push(item);
				return acc;
			},
			{} as Record<string, SupportHeadingType[]>,
		);
	}, [data]);

	if (loading) return <Spinner />;

	return (
		<View style={styles.container}>
			{Object.entries(groupedData).map(([category, items]) => (
				<View key={category} style={styles.categorySection}>
					<Text style={styles.categoryHeader}>{category}</Text>
					{items.map(support => (
						<Link href={`/support/${support.url}`} key={support.id}>
							<Text style={styles.linkText}>{support.title}</Text>
						</Link>
					))}
				</View>
			))}
		</View>
	);
}
