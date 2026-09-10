import React from 'react';
import {View, Text, ScrollView, Image, Pressable, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ImageType} from '@northernexplorer/types';

interface TopImagesWidgetProps {
	data: ImageType[];
}

export function TopImagesWidget({data}: TopImagesWidgetProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.headerTitle}>Top Photos</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
				{data.map(item => (
					<Link key={item.id} href={`/media/image/${item.id}`} asChild>
						<Pressable style={styles.card}>
							<Image source={{uri: item.url}} style={styles.image} resizeMode="cover" />
							<View style={styles.overlay}>
								<View style={styles.likeBadge}>
									<MaterialCommunityIcons name="heart" size={14} color="#FF4B4B" />
									<Text style={styles.likeText}>{item.likes}</Text>
								</View>
								<Text style={styles.authorText} numberOfLines={1}>
									by @{item.user.username}
								</Text>
							</View>
						</Pressable>
					</Link>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 12,
	},
	scrollContent: {
		gap: 12,
	},
	card: {
		width: 200,
		height: 140,
		borderRadius: 12,
		overflow: 'hidden',
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		position: 'relative',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	overlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 8,
		backgroundColor: 'rgba(0, 0, 0, 0.45)',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	likeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
	},
	likeText: {
		color: '#ffffff',
		fontSize: 12,
		fontWeight: '600',
	},
	authorText: {
		color: 'rgba(255, 255, 255, 0.85)',
		fontSize: 11,
		fontWeight: '500',
		flexShrink: 1,
		textAlign: 'right',
		marginLeft: 6,
	},
});
