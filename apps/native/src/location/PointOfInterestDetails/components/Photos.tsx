import React, {useMemo, useState} from 'react';
import {Platform, Pressable, StyleSheet, Text, View, LayoutChangeEvent, DimensionValue, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {PointOfInterestType, RolesEnum} from '@northernexplorer/types';
import {Link} from 'expo-router';
import {formatDate, getImageUrl, ImageView} from '@northernexplorer/tools-web';
import {PhotoUploadCard} from './PhotoUploadCard';
import {PhotoGridItem} from './PhotoGridItem';
import {PhotoPreviewModal} from './PhotoPreviewModal';
import {useApiMutation} from '~/core/useApiMutation';
import {styles as globalStyles} from '~/location/PointOfInterestDetails/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {config} from '~/config';

type PhotosProps = {
	data: PointOfInterestType;
	refetch: () => void;
	selectedImageId?: string | null;
	setSelectedImageId?: (id: string | null) => void;
};

type TabOption = 'top' | 'timeline';

const GRID_GAP = 8;

export function Photos({data, refetch, selectedImageId: externalSelectedImageId, setSelectedImageId: externalSetSelectedImageId}: PhotosProps) {
	const authentication = useAuthentication();
	const [activeTab, setActiveTab] = useState<TabOption>('top');
	const [containerWidth, setContainerWidth] = useState<number>(0);
	const [internalSelectedImageId, setInternalSelectedImageId] = useState<string | null>(null);
	const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

	const selectedImageId = externalSelectedImageId !== undefined ? externalSelectedImageId : internalSelectedImageId;
	const setSelectedImageId = externalSetSelectedImageId || setInternalSelectedImageId;

	const {mutate: deleteMutation} = useApiMutation('location', 'ImageController', 'deleteById');

	const images = data.images || [];
	const isAdmin = authentication?.roles?.includes(RolesEnum.Admin);

	const topImages = useMemo(() => {
		return [...images].sort((a, b) => b.likes - a.likes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
	}, [images]);

	const timelineImages = useMemo(() => {
		return [...images].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [images]);

	const timelineGroups = useMemo(() => {
		const groups: {
			date: string;
			formattedDate: string;
			images: typeof images;
		}[] = [];

		for (const image of timelineImages) {
			const formattedDate = formatDate(image.createdAt);

			if (groups.length > 0 && groups[groups.length - 1].formattedDate === formattedDate) {
				groups[groups.length - 1].images.push(image);
			} else {
				groups.push({
					date: typeof image.createdAt === 'string' ? image.createdAt : new Date(image.createdAt).toISOString(),
					formattedDate,
					images: [image],
				});
			}
		}

		return groups;
	}, [timelineImages]);

	const displayedImages = activeTab === 'top' ? topImages : timelineImages;

	const imageList = useMemo(() => {
		if (selectedImageId && displayedImages.findIndex(img => img.id === selectedImageId) === -1) {
			if (timelineImages.findIndex(img => img.id === selectedImageId) !== -1) {
				return timelineImages;
			}
		}
		return displayedImages;
	}, [selectedImageId, displayedImages, timelineImages]);

	const selectedIndex = selectedImageId !== null ? imageList.findIndex(img => img.id === selectedImageId) : -1;

	// Determine columns based on measured container width
	const columns = containerWidth >= 1024 ? 5 : containerWidth >= 640 ? 4 : 3;

	const handleLayout = (event: LayoutChangeEvent) => {
		const {width} = event.nativeEvent.layout;
		if (width > 0 && width !== containerWidth) {
			setContainerWidth(width);
		}
	};

	// Calculate item width based on exact container inner width
	const getItemWidth = () => {
		if (!containerWidth) return undefined;

		if (Platform.OS === 'web') {
			return `calc(${100 / columns}% - ${(GRID_GAP * (columns - 1)) / columns}px)`;
		}

		const totalGapSpace = GRID_GAP * (columns - 1);
		return Math.floor((containerWidth - totalGapSpace) / columns);
	};

	const itemWidth = getItemWidth();

	const handleDelete = async (imageId: string) => {
		setDeletingImageId(imageId);
		try {
			await deleteMutation({id: imageId});
			if (selectedImageId === imageId) {
				setSelectedImageId(null);
			}
			refetch();
		} finally {
			setDeletingImageId(null);
		}
	};

	const handlePreviousImage = () => {
		if (selectedIndex > 0) {
			setSelectedImageId(imageList[selectedIndex - 1].id);
		}
	};

	const handleNextImage = () => {
		if (selectedIndex !== -1 && selectedIndex < imageList.length - 1) {
			setSelectedImageId(imageList[selectedIndex + 1].id);
		}
	};

	return (
		<View style={styles.container}>
			{!authentication ? (
				<Link href="user/login" asChild>
					<Pressable style={styles.loggedOutCard}>
						<Ionicons name="images-outline" size={24} color="#64748b" />
						<Text style={styles.loggedOutText}>Log in to share photos</Text>
					</Pressable>
				</Link>
			) : (
				<PhotoUploadCard pointOfInterestId={data.id} />
			)}

			<View style={styles.headerSection}>
				<Text style={globalStyles.reviewTitle}>Community Photos ({images.length})</Text>

				<View style={styles.tabBarContainer}>
					<View style={styles.tabBarContent}>
						<TouchableOpacity
							style={[styles.tabButton, activeTab === 'top' && styles.activeTabButton]}
							onPress={() => setActiveTab('top')}
						>
							<Text style={activeTab === 'top' ? styles.activeTabText : styles.tabText}>Top Images</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.tabButton, activeTab === 'timeline' && styles.activeTabButton]}
							onPress={() => setActiveTab('timeline')}
						>
							<Text style={activeTab === 'timeline' ? styles.activeTabText : styles.tabText}>Timeline</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{images.length === 0 ? (
				<View style={styles.emptyState}>
					<Ionicons name="images-outline" size={44} color="#cbd5e1" />
					<Text style={styles.emptyTitle}>No photos yet</Text>
					<Text style={styles.emptySubtitle}>Be the first to share photos of this location with the community.</Text>
				</View>
			) : activeTab === 'top' ? (
				<View style={styles.gridContainer} onLayout={handleLayout}>
					{containerWidth > 0 &&
						topImages.map((image, index) => {
							const isMine = Boolean(authentication?.userId && image.user.id === authentication.userId);
							const isLastInRow = (index + 1) % columns === 0;

							return (
								<PhotoGridItem
									key={image.id}
									image={image}
									isMine={isMine}
									onSelect={() => setSelectedImageId(image.id)}
									style={{width: itemWidth as DimensionValue, marginRight: isLastInRow ? 0 : GRID_GAP, marginBottom: GRID_GAP}}
								/>
							);
						})}
				</View>
			) : (
				<View style={styles.timelineList}>
					{timelineGroups.map((group, index) => {
						const isLast = index === timelineGroups.length - 1;

						return (
							<View key={`${group.date}-${index}`} style={styles.timelineRow}>
								{/* Left: Prominent Date Axis */}
								<View style={styles.dateColumn}>
									<Text style={styles.dateText}>{group.formattedDate}</Text>
								</View>

								{/* Middle: Vertical Spine & Node Bullet */}
								<View style={styles.spineColumn}>
									<View style={[styles.nodeBullet, styles.imageNodeBullet]} />
									{!isLast && <View style={styles.spineLine} />}
								</View>

								{/* Right: Content Section */}
								<View style={styles.contentColumn}>
									<View style={styles.eventBody}>
										<View style={styles.eventHeader}>
											<Ionicons name="camera-sharp" size={16} color="#059669" />
											<Text style={styles.eventTypeLabel}>
												{group.images.length > 1 ? `${group.images.length} Photo Uploads` : 'Photo Upload'}
											</Text>
										</View>

										<View style={styles.photosContainer}>
											{group.images.map(image => (
												<View key={image.id} style={styles.photoContainer}>
													<Pressable onPress={() => setSelectedImageId(image.id)}>
														<ImageView
															source={{
																uri: getImageUrl({
																	path: image.url,
																	size: 'thumbnail',
																	processed: image.processed,
																	cdn: config.CONTENT_DELIVERY_NETWORK,
																}),
															}}
															style={styles.timelineImage}
															resizeMode="cover"
														/>
													</Pressable>

													<View style={styles.likesRow}>
														<Ionicons name="heart" size={15} color="#ef4444" />
														<Text style={styles.likesCount}>{image.likes}</Text>
													</View>
												</View>
											))}
										</View>
									</View>
								</View>
							</View>
						);
					})}
				</View>
			)}

			{selectedImageId && (
				<PhotoPreviewModal
					selectedImageId={selectedImageId}
					selectedIndex={selectedIndex !== -1 ? selectedIndex : 0}
					totalImages={imageList.length > 0 ? imageList.length : 1}
					currentUserId={authentication?.userId}
					isAdmin={isAdmin}
					deletingImageId={deletingImageId}
					onClose={() => setSelectedImageId(null)}
					onPrevious={handlePreviousImage}
					onNext={handleNextImage}
					onDelete={handleDelete}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	loggedOutCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderStyle: 'dashed',
		padding: 18,
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
	},
	loggedOutText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#64748b',
	},
	headerSection: {
		marginTop: 8,
		marginBottom: 12,
	},
	tabBarContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
		marginTop: 12,
		marginBottom: 16,
	},
	tabBarContent: {
		flexDirection: 'row',
		gap: 8,
		paddingBottom: 2,
	},
	tabButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	activeTabButton: {
		borderBottomColor: '#0088cc',
	},
	tabText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#64748b',
	},
	activeTabText: {
		color: '#0088cc',
		fontWeight: '600',
	},
	gridContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '100%',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderStyle: 'dashed',
		marginVertical: 8,
	},
	emptyTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#0f172a',
		marginTop: 10,
	},
	emptySubtitle: {
		fontSize: 13,
		color: '#64748b',
		textAlign: 'center',
		marginTop: 4,
		maxWidth: 280,
	},
	/* Timeline styles matching ProfileTimeline */
	timelineList: {
		paddingVertical: 12,
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
});
