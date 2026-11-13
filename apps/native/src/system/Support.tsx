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
		if (!data) return [];
		const groups = new Map<string, {key: string; label: string; items: ArticleHeadingType[]}>();

		for (const article of data) {
			const path = article.categoryPath;
			const key = path.map(category => category.id).join('/');
			const label =
				path.length > 1
					? path
							.slice(1)
							.map(category => category.name)
							.join(' › ')
					: 'General';
			const group = groups.get(key) ?? {key, label, items: []};
			group.items.push(article);
			groups.set(key, group);
		}

		return [...groups.values()];
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
				{groupedData.map(({key, label, items}) => (
					<View key={key}>
						<Text style={styles.categoryHeader}>{label}</Text>
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
