import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {Link} from 'expo-router';
import {Spinner} from '@northernexplorer/tools-web';
import {ArticleHeadingType} from '@northernexplorer/types';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';

export function Support() {
	const {data, loading} = useApiFetch('system', 'SupportController', 'getHeadings', {});

	const groupedData = useMemo(() => {
		if (!data) return {};
		return data.reduce(
			(acc, item) => {
				const subcategory = item.subcategory ?? 'General';
				if (!(subcategory in acc)) {
					acc[subcategory] = [];
				}
				acc[subcategory].push(item);
				return acc;
			},
			{} as Record<string, ArticleHeadingType[]>,
		);
	}, [data]);

	if (loading) return <Spinner />;

	return (
		<View style={styles.container}>
			<View style={styles.categorySection}>
				<Text style={styles.categoryHeader}>Get in Touch</Text>
				<Link href="/contact">
					<Text style={styles.linkText}>Contact Us</Text>
				</Link>
			</View>

			<View style={styles.categorySection}>
				<Text style={styles.categoryHeader}>Support</Text>
				{Object.entries(groupedData).map(([subcategory, items]) => (
					<View key={subcategory}>
						<Text style={styles.categoryHeader}>{subcategory}</Text>
						{items.map(article => (
							<Link href={`/support/${article.url}`} key={article.id}>
								<Text style={styles.linkText}>{article.title}</Text>
							</Link>
						))}
					</View>
				))}
			</View>
		</View>
	);
}
