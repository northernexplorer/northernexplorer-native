import {PointOfInterestTypeEnum} from '@northernexplorer/types';

export interface MarkerConfig {
	iconName: 'tunnel' | 'waterfall' | 'bank' | 'map-marker-path';
	backgroundColor: string;
}

export function getMarkerConfig(siteType: PointOfInterestTypeEnum[]): MarkerConfig {
	if (siteType.includes(PointOfInterestTypeEnum.Cave)) {
		return {iconName: 'tunnel', backgroundColor: '#1e1e1e'};
	}
	if (siteType.includes(PointOfInterestTypeEnum.Waterfall)) {
		return {iconName: 'waterfall', backgroundColor: '#0288D1'};
	}
	if (siteType.includes(PointOfInterestTypeEnum.HistoricSite)) {
		return {iconName: 'bank', backgroundColor: '#6D4C41'};
	}

	return {iconName: 'map-marker-path', backgroundColor: '#424242'};
}
