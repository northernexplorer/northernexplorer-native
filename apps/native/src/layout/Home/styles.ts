import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
	hero: {
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
	},
	heroRow: {
		flexDirection: 'row',
		alignItems: 'stretch',
		gap: 16,
		width: '100%',
	},
	weatherSection: {
		flex: 1,
		minWidth: 0,
	},
	fieldNote: {
		flex: 1,
		minWidth: 280,
	},
	lunarSection: {
		width: 140,
	},
	// Glassmorphism card container
	tile: {
		marginRight: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.06)',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
		flexShrink: 0,
		overflow: 'hidden',
	},
	// Forecast Tile
	forecastTile: {
		width: 84,
		paddingVertical: 14,
		paddingHorizontal: 8,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	hourDay: {
		color: 'rgba(255, 255, 255, 0.6)',
		fontSize: 13,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	hourTemp: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
	},
	// Historic Site Card
	siteCard: {
		width: 200,
		height: 220,
	},
	siteImage: {
		width: '100%',
		height: 120,
	},
	siteContent: {
		padding: 12,
		flex: 1,
		justifyContent: 'space-between',
	},
	siteTitle: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
		letterSpacing: -0.2,
	},
	siteDesc: {
		color: 'rgba(255, 255, 255, 0.55)',
		fontSize: 12,
		marginTop: 4,
		lineHeight: 16,
	},
	// Section Headers
	exploreHeader: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '700',
		letterSpacing: -0.3,
		marginTop: 28,
		marginBottom: 14,
	},
	forecastSection: {
		width: '100%',
	},
	historicSitesSection: {
		width: '100%',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	// Mobile layouts
	mobileHeroRow: {
		flexDirection: 'row',
		gap: 12,
	},
	mobileLunarSection: {
		width: 130,
	},
	mobileFieldNoteSection: {
		marginTop: 12,
	},
	metricPill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
	},
	metricText: {
		color: 'rgba(255, 255, 255, 0.75)',
		fontSize: 12,
		fontWeight: '500',
	},
});
