import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import React, {useMemo, useState} from 'react';
import {formatDate, getImageUrl, ImageView, Spinner} from '@northernexplorer/tools-web';
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

	const imageEvents = useMemo(() => {
		if (!events) return [];
		return events.filter(e => Boolean(e.image));
	}, [events]);

	if (loading || !events) return <Spinner />;

	if (events.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Ionicons name="time-outline" size={48} color="#94a3b8" />
				<Text style={styles.emptyText}>No timeline activity yet.</Text>
			</View>
		);
	}

	const selectedImageId = selectedImageIndex !== null ? imageEvents[selectedImageIndex]?.image?.id : null;

	return (
		<View style={styles.container}>
			<View style={styles.timelineList}>
				{events.map((item, index) => {
					const eventDate = formatDate(item.date);
					const isLast = index === events.length - 1;

					return (
						<View key={`${item.date}-${index}`} style={styles.timelineRow}>
							{/* Left: Prominent Date Axis */}
							<View style={styles.dateColumn}>
								<Text style={styles.dateText}>{eventDate}</Text>
							</View>

							{/* Middle: Vertical Spine & Node Bullet */}
							<View style={styles.spineColumn}>
								<View style={[styles.nodeBullet, item.pointOfInterest ? styles.poiNodeBullet : styles.imageNodeBullet]} />
								{!isLast && <View style={styles.spineLine} />}
							</View>

							{/* Right: Content Section */}
							<View style={styles.contentColumn}>
								{item.pointOfInterest && (
									<View style={styles.eventBody}>
										<View style={styles.eventHeader}>
											<Ionicons name="location-sharp" size={16} color="#0284c7" />
											<Text style={styles.eventTypeLabel}>POI Visit</Text>
										</View>
										<Link href={`/poi/${item.pointOfInterest.id}`} style={styles.poiLink}>
											<Text style={styles.poiTitle}>{item.pointOfInterest.name}</Text>
										</Link>
									</View>
								)}

								{item.image && (
									<View style={styles.eventBody}>
										<View style={styles.eventHeader}>
											<Ionicons name="camera-sharp" size={16} color="#059669" />
											<Text style={styles.eventTypeLabel}>Photo Upload</Text>
										</View>

										<View style={styles.photoContainer}>
											<Pressable
												onPress={() => {
													const imgIdx = imageEvents.findIndex(imgEvent => imgEvent.image?.id === item.image?.id);
													setSelectedImageIndex(imgIdx);
												}}
											>
												<ImageView
													source={{
														uri: getImageUrl({
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
												<Ionicons name="heart" size={15} color="#ef4444" />
												<Text style={styles.likesCount}>{item.image.likes}</Text>
											</View>
										</View>
									</View>
								)}
							</View>
						</View>
					);
				})}
			</View>

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
	container: {
		flex: 1,
	},
	timelineList: {
		paddingVertical: 20,
	},
	timelineRow: {
		flexDirection: 'row',
		minHeight: 90,
	},
	/* 1. Date Column */
	dateColumn: {
		width: 100,
		alignItems: 'flex-end',
		paddingRight: 16,
		paddingTop: 2,
	},
	dateText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#334155',
		textAlign: 'right',
	},
	/* 2. Central Timeline Axis Spine */
	spineColumn: {
		alignItems: 'center',
		width: 24,
	},
	nodeBullet: {
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 3,
		borderColor: '#ffffff',
		zIndex: 2,
		marginTop: 4,
	},
	poiNodeBullet: {
		backgroundColor: '#0284c7',
	},
	imageNodeBullet: {
		backgroundColor: '#059669',
	},
	spineLine: {
		position: 'absolute',
		top: 18,
		bottom: 0,
		width: 2,
		backgroundColor: '#cbd5e1',
		zIndex: 1,
	},
	/* 3. Event Details Content Column */
	contentColumn: {
		flex: 1,
		paddingLeft: 16,
		paddingBottom: 32,
	},
	eventBody: {
		gap: 6,
	},
	eventHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	eventTypeLabel: {
		fontSize: 12,
		fontWeight: '600',
		color: '#64748b',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	poiLink: {
		marginTop: 2,
	},
	poiTitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#0f172a',
	},
	photoContainer: {
		marginTop: 6,
		maxWidth: 320,
	},
	timelineImage: {
		width: '100%',
		height: 180,
		borderRadius: 10,
	},
	likesRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 6,
	},
	likesCount: {
		fontSize: 13,
		fontWeight: '600',
		color: '#64748b',
	},
	emptyContainer: {
		padding: 48,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
	},
	emptyText: {
		fontSize: 15,
		color: '#64748b',
		fontWeight: '500',
	},
});
