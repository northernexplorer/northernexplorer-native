import {View, Text, FlatList, Pressable, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import React, {useMemo, useState} from 'react';
import {formatDate, getDynamicImageUrl, ImageView, Spinner} from '@northernexplorer/tools-web';
import {Ionicons} from '@expo/vector-icons';
import {useApiFetch} from '~/core/useApiFetch';
import {config} from '~/config';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';

type Props = {
	username: string;
};

export function ProfileTimeline({username}: Props) {
	const auth = useAuthentication();
	const {data: events, loading} = useApiFetch('user', 'UserController', 'getTimeline', {
		username,
	});

	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

	// Extract images into a list for modal index/navigation tracking
	const imageEvents = useMemo(() => {
		if (!events) return [];
		return events.filter(e => Boolean(e.image));
	}, [events]);

	if (loading || !events) return <Spinner />;

	if (events.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>No timeline activity yet.</Text>
			</View>
		);
	}

	const selectedImageId = selectedImageIndex !== null ? imageEvents[selectedImageIndex]?.image?.id : null;

	return (
		<View style={{flex: 1}}>
			<FlatList
				data={events}
				keyExtractor={(item, index) => `${item.date}-${index}`}
				contentContainerStyle={styles.timelineList}
				renderItem={({item}) => {
					const eventDate = formatDate(item.date);

					if (item.pointOfInterest) {
						const poi = item.pointOfInterest;
						return (
							<View style={styles.timelineCard}>
								<View style={styles.timelineHeader}>
									<Ionicons name="location-outline" size={20} color="#0284c7" />
									<Text style={styles.timelineDate}>{eventDate}</Text>
								</View>
								<Text style={styles.timelineAction}>Visited a Point of Interest</Text>
								<Link href={`/poi/${poi.id}`} style={styles.poiTitle}>
									{poi.name}
								</Link>
							</View>
						);
					}

					if (item.image) {
						const imageIndex = imageEvents.findIndex(imgEvent => imgEvent.image?.id === item.image?.id);

						return (
							<View style={styles.timelineCard}>
								<View style={styles.timelineHeader}>
									<Ionicons name="image-outline" size={20} color="#0284c7" />
									<Text style={styles.timelineDate}>{eventDate}</Text>
								</View>
								<Text style={styles.timelineAction}>Uploaded a new photo</Text>

								<Pressable onPress={() => setSelectedImageIndex(imageIndex)}>
									<ImageView
										source={{
											uri: getDynamicImageUrl({
												path: item.image.url,
												size: 'thumbnail',
												processed: item.image.processed,
												cdn: config.CONTENT_DELIVERY_NETWORK,
											}),
										}}
										style={styles.timelineImage}
										resizeMode="cover"
									/>
								</Pressable>

								<View style={styles.likesRow}>
									<Ionicons name="heart" size={16} color="#ef4444" />
									<Text style={styles.likesCount}>{item.image.likes}</Text>
								</View>
							</View>
						);
					}

					return null;
				}}
			/>

			{selectedImageId && selectedImageIndex !== null && (
				<PhotoPreviewModal
					selectedImageId={selectedImageId}
					selectedIndex={selectedImageIndex}
					totalImages={imageEvents.length}
					currentUserId={auth?.userId}
					onClose={() => setSelectedImageIndex(null)}
					onPrevious={() => setSelectedImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
					onNext={() => setSelectedImageIndex(prev => (prev !== null && prev < imageEvents.length - 1 ? prev + 1 : prev))}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	timelineList: {
		paddingVertical: 12,
		gap: 16,
	},
	timelineCard: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		gap: 8,
	},
	timelineHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	timelineDate: {
		fontSize: 12,
		color: '#64748b',
		fontWeight: '500',
	},
	timelineAction: {
		fontSize: 14,
		fontWeight: '600',
		color: '#0f172a',
	},
	poiTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#0284c7',
		marginTop: 2,
	},
	timelineImage: {
		width: '100%',
		height: 200,
		borderRadius: 8,
		backgroundColor: '#f1f5f9',
		marginTop: 4,
	},
	likesRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 4,
	},
	likesCount: {
		fontSize: 13,
		fontWeight: '600',
		color: '#64748b',
	},
	emptyContainer: {
		padding: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyText: {
		fontSize: 14,
		color: '#64748b',
	},
});
