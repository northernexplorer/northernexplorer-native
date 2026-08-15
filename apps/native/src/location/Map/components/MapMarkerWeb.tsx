import React, {Dispatch, SetStateAction} from 'react';
import {Marker} from 'react-map-gl/maplibre';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestType} from '@northernexplorer/types';
import {getMarkerConfig} from './getMarkerConfig';

interface Props {
	site: PointOfInterestType;
	longitude: number;
	latitude: number;
	selectedSite: PointOfInterestType | null;
	setSelectedSite: Dispatch<SetStateAction<PointOfInterestType | null>>;
}

export function MapMarkerWeb({site, longitude, latitude, selectedSite, setSelectedSite}: Props) {
	const {iconName, backgroundColor} = getMarkerConfig(site.type);

	return (
		<Marker
			key={site.id}
			longitude={longitude}
			latitude={latitude}
			anchor="bottom"
			onClick={e => {
				e.originalEvent.stopPropagation();
				if (selectedSite && selectedSite.id === site.id) {
					setSelectedSite(null);
				} else {
					setSelectedSite(site);
				}
			}}
		>
			<div
				style={{
					...styles.iconCircle,
					backgroundColor,
				}}
			>
				<MaterialCommunityIcons name={iconName} size={28} color="#FFFFFF" />
			</div>
		</Marker>
	);
}

const styles = {
	iconCircle: {
		width: 48,
		height: 48,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
		cursor: 'pointer',
		border: '2px solid #FFFFFF',
	},
};
