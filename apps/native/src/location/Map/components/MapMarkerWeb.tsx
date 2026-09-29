import React, {Dispatch, SetStateAction} from 'react';
import {Marker} from 'react-map-gl/maplibre';
import {ImageHeaderType, PointOfInterestType, SiteDifficultyEnum} from '@northernexplorer/types';
import {getImageUrl} from '@northernexplorer/tools-web';
import {config} from '~/config';

interface Props {
	site: PointOfInterestType;
	longitude: number;
	latitude: number;
	selectedSite?: PointOfInterestType | null;
	setSelectedSite?: Dispatch<SetStateAction<PointOfInterestType | null>>;
	size?: number;
	image: ImageHeaderType;
	difficulty?: SiteDifficultyEnum;
	canAccessOffTrailDifficulty?: boolean;
	canAccessExpeditionDifficulty?: boolean;
}

export function MapMarkerWeb({
	site,
	longitude,
	latitude,
	selectedSite,
	setSelectedSite,
	size,
	image,
	difficulty,
	canAccessOffTrailDifficulty = false,
	canAccessExpeditionDifficulty = false,
}: Props) {
	const isDraft = site.status === 'Draft';
	const markerSize = size || 48;

	const isOffTrail = difficulty === SiteDifficultyEnum.OFF_TRAIL_REMOTE;
	const isExpedition = difficulty === SiteDifficultyEnum.EXPEDITION_ONLY;

	const isLocked = (isOffTrail && !canAccessOffTrailDifficulty) || (isExpedition && !canAccessExpeditionDifficulty);

	return (
		<Marker
			key={site.id}
			longitude={longitude}
			latitude={latitude}
			anchor="bottom"
			onClick={e => {
				e.originalEvent.stopPropagation();
				if (setSelectedSite) {
					if (selectedSite && selectedSite.id === site.id) {
						setSelectedSite(null);
					} else {
						setSelectedSite(site);
					}
				}
			}}
		>
			<div
				style={{
					...styles.iconCircle,
					width: markerSize,
					height: markerSize,
					border: isDraft ? '2px dashed #e65100' : isLocked ? '2px solid #e67e22' : '2px solid #FFFFFF',
					backgroundColor: isLocked ? '#fff5ec' : '#FFFFFF',
					opacity: isDraft ? 0.85 : 1,
				}}
				title={isLocked ? 'Sign in or upgrade your account to view site details' : undefined}
			>
				{isLocked ? (
					<svg width={markerSize * 0.45} height={markerSize * 0.45} viewBox="0 0 24 24" fill="#e67e22">
						{/* Lock Icon */}
						<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
					</svg>
				) : (
					<img
						src={getImageUrl({
							path: image.url,
							size: 'thumbnail',
							cdn: config.CONTENT_DELIVERY_NETWORK,
							processed: image.processed,
						})}
						alt={site.name || 'Marker image'}
						style={styles.image}
					/>
				)}

				{isDraft && <div style={styles.draftBadge}>DRAFT</div>}
			</div>
		</Marker>
	);
}

const styles: Record<string, React.CSSProperties> = {
	iconCircle: {
		position: 'relative',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
		cursor: 'pointer',
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
	draftBadge: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#e65100',
		color: '#FFFFFF',
		fontSize: '8px',
		fontWeight: 'bold',
		textAlign: 'center',
		padding: '1px 0',
		textTransform: 'uppercase',
		lineHeight: '1',
		whiteSpace: 'nowrap',
		zIndex: 1,
	},
};
