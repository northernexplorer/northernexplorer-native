import React, {Dispatch, SetStateAction} from 'react';
import {Marker} from 'react-map-gl/maplibre';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestType} from '@northernexplorer/types';
import {getMarkerConfig} from './getMarkerConfig';

interface Props {
	site: PointOfInterestType;
	longitude: number;
	latitude: number;
	selectedSite?: PointOfInterestType | null;
	setSelectedSite?: Dispatch<SetStateAction<PointOfInterestType | null>>;
	size?: number;
}

export function MapMarkerWeb({site, longitude, latitude, selectedSite, setSelectedSite, size}: Props) {
	const {iconName, backgroundColor} = getMarkerConfig(site.type);
	const isDraft = site.status === 'Draft';
	const markerSize = size || 48;

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
					backgroundColor,
					width: markerSize,
					height: markerSize,
					border: isDraft ? '2px dashed #e65100' : '2px solid #FFFFFF',
					opacity: isDraft ? 0.85 : 1,
				}}
			>
				<MaterialCommunityIcons name={iconName} size={size ? size / 2 : 28} color="#FFFFFF" />

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
	},
	draftBadge: {
		position: 'absolute',
		bottom: -6,
		backgroundColor: '#e65100',
		color: '#FFFFFF',
		fontSize: '9px',
		fontWeight: 'bold',
		padding: '1px 4px',
		borderRadius: '4px',
		boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
		textTransform: 'uppercase',
		lineHeight: '1',
		whiteSpace: 'nowrap',
	},
};
