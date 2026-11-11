import React from 'react';
import {Text, View} from 'react-native';
import {Link} from 'expo-router';
import {formatDate, Spinner} from '@northernexplorer/tools-web';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';

export function News() {
	const {data, loading} = useApiFetch('system', 'SupportController', 'getNewsHeadings', {});

	if (loading) return <Spinner />;

	return (
		<View style={styles.container}>
			<View style={styles.categorySection}>
				<Text style={styles.categoryHeader}>News</Text>
				{data?.length ? (
					data.map(article => (
						<View key={article.id}>
							<Link href={`/news/${article.url}`}>
								<Text style={styles.linkText}>{article.title}</Text>
							</Link>
							<Text>{formatDate(article.createdAt)}</Text>
						</View>
					))
				) : (
					<Text>No news articles are available right now.</Text>
				)}
			</View>
		</View>
	);
}
