import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	hero: {
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
	},
	heroRow: {
		flexDirection: 'row',
		alignItems: 'stretch',
		gap: 12,
		width: '100%',
	},
	// Row 1 & Row 2 proportional flex columns (2:1 ratio)
	weatherSection: {
		flex: 2,
		minWidth: 0,
	},
	fieldNote: {
		flex: 2,
		minWidth: 0,
	},
	lunarSection: {
		flex: 1,
		minWidth: 0,
	},
	compassSection: {
		flex: 1,
		minWidth: 0,
	},

	// Base Glassmorphism Tile
	tile: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
		overflow: 'hidden',
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

	// Point of Interest Card
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

	// Section Headers & Layout Wrappers
	exploreHeader: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '700',
		letterSpacing: -0.3,
		marginTop: 24,
		marginBottom: 12,
	},
	pointOfInterestsSection: {
		width: '100%',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
