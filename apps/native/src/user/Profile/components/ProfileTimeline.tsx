import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Link, useLocalSearchParams} from 'expo-router';
import React, {useMemo, useState} from 'react';
import {formatDate, getImageUrl, getUrlSafeString, ImageView, Pagination, Spinner} from '@northernexplorer/tools-web';
import {Ionicons} from '@expo/vector-icons';
import {useApiFetch} from '~/core/useApiFetch';
import {config} from '~/config';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';

type Props = {
	username: string;
};

const limit = 20;

export function ProfileTimeline({username}: Props) {
	const auth = useAuthentication();
	const params = useLocalSearchParams<{page?: string}>();
	const page = params.page ? parseInt(params.page, 10) : 1;
	const offset = (page - 1) * limit;

	const {data: events, loading} = useApiFetch('user', 'UserController', 'getTimeline', {
		username,
		limit,
		offset,
	});

	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

	const imageEvents = useMemo(() => {
		if (!events) return [];
		return events.filter(e => Boolean(e.image));
	}, [events]);

	const timelineGroups = useMemo(() => {
		if (!events) return [];

		const groups: {
			date: string;
			formattedDate: string;
			poiId?: string;
			poiEvents: typeof events;
			imageEvents: typeof events;
		}[] = [];

		for (const item of events) {
			const formattedDate = formatDate(item.date);
			const poiId = item.pointOfInterest?.id ?? item.image?.pointOfInterest?.id;

			const existingGroup = poiId ? groups.find(group => group.formattedDate === formattedDate && group.poiId === poiId) : null;

			if (existingGroup) {
				if (item.pointOfInterest) {
					existingGroup.poiEvents.push(item);
				}
				if (item.image) {
					existingGroup.imageEvents.push(item);
				}
			} else {
				groups.push({
					date: typeof item.date === 'string' ? item.date : new Date(item.date).toISOString(),
					formattedDate,
					poiId,
					poiEvents: item.pointOfInterest ? [item] : [],
					imageEvents: item.image ? [item] : [],
				});
			}
		}

		return groups;
	}, [events]);

	if (loading || !events) return <Spinner />;

	if (events.length === 0) {
		return (
			<View style={styles.container}>
				<View style={styles.emptyContainer}>
					<Ionicons name="time-outline" size={48} color="#94a3b8" />
					<Text style={styles.emptyText}>No timeline activity yet.</Text>
				</View>
				{page > 1 && <Pagination limit={limit} itemCount={0} />}
			</View>
		);
	}

	const selectedImageId = selectedImageIndex !== null ? imageEvents[selectedImageIndex]?.image?.id : null;

	return (
		<View style={styles.container}>
			<View style={styles.timelineList}>
				{timelineGroups.map((group, index) => {
					const isLast = index === timelineGroups.length - 1;
					const hasPoi = group.poiEvents.length > 0;

					return (
						<View key={`${group.date}-${group.poiId ?? index}-${index}`} style={styles.timelineRow}>
							{/* Left: Prominent Date Axis */}
							<View style={styles.dateColumn}>
								<Text style={styles.dateText}>{group.formattedDate}</Text>
							</View>

							{/* Middle: Vertical Spine & Node Bullet */}
							<View style={styles.spineColumn}>
								<View style={[styles.nodeBullet, hasPoi ? styles.poiNodeBullet : styles.imageNodeBullet]} />
								{!isLast && <View style={styles.spineLine} />}
							</View>

							{/* Right: Content Section */}
							<View style={styles.contentColumn}>
								{group.poiEvents.map((item, poiIdx) => {
									if (!item.pointOfInterest) return null;
									return (
										<View key={`poi-${item.pointOfInterest.id}-${poiIdx}`} style={styles.eventBody}>
											<View style={styles.eventHeader}>
												<Ionicons name="location-sharp" size={16} color="#0284c7" />
												<Text style={styles.eventTypeLabel}>Visited</Text>
											</View>
											<Link
												href={{
													pathname: '/[country]/[region]/[name]/[id]',
													params: {
														country: getUrlSafeString(item.pointOfInterest.country.name),
														region: getUrlSafeString(item.pointOfInterest.region.name),
														name: getUrlSafeString(item.pointOfInterest.name),
														id: item.pointOfInterest.id,
													},
												}}
												style={styles.poiLink}
											>
												<Text style={styles.poiTitle}>{item.pointOfInterest.name}</Text>
											</Link>
										</View>
									);
								})}

								{group.imageEvents.length > 0 && (
									<View style={[styles.eventBody, group.poiEvents.length > 0 && styles.eventBodyWithTopMargin]}>
										<View style={styles.eventHeader}>
											<Ionicons name="camera-sharp" size={16} color="#059669" />
											<Text style={styles.eventTypeLabel}>
												{group.imageEvents.length > 1 ? `${group.imageEvents.length} Photo Uploads` : 'Photo Upload'}
											</Text>
										</View>

										<View style={styles.photosContainer}>
											{group.imageEvents.map(item => {
												if (!item.image) return null;
												return (
													<View key={item.image.id} style={styles.photoContainer}>
														<Pressable
															onPress={() => {
																const imgIdx = imageEvents.findIndex(
																	imgEvent => imgEvent.image?.id === item.image?.id,
																);
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
												);
											})}
										</View>
									</View>
								)}
							</View>
						</View>
					);
				})}
			</View>

			<Pagination limit={limit} itemCount={events.length} />

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
	eventBodyWithTopMargin: {
		marginTop: 16,
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
	photosContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		marginTop: 6,
	},
	photoContainer: {
		width: 280,
		maxWidth: '100%',
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
