import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	// Base Screen Wrapper
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#1a1a1a',
	},
	containerMobile: {
		flexDirection: 'column',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1a1a1a',
	},

	// Mobile Top Bar Styles
	topBar: {
		width: '100%',
		backgroundColor: '#1a1a1a',
		borderBottomWidth: 1,
		borderBottomColor: '#333333',
		paddingVertical: 5,
		paddingHorizontal: 16,
	},
	topBarTools: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	topBarTile: {
		width: 52,
		height: 52,
		backgroundColor: '#1a1a1a',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},

	// Left Sidebar / Tool Panel (Desktop Default)
	leftSidebar: {
		width: 64,
		backgroundColor: '#1a1a1a',
		borderRightWidth: 1,
		borderRightColor: '#333333',
		paddingVertical: 16,
		paddingHorizontal: 6,
		alignItems: 'center',
	},
	sidebarTools: {
		width: '100%',
		gap: 12,
		alignItems: 'center',
	},
	sidebarTile: {
		width: 52,
		height: 52,
		backgroundColor: '#1a1a1a',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},

	// Main Content Area
	mainContent: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		gap: 16,
	},

	// Header Components
	headerSubtitle: {
		color: 'rgba(255, 255, 255, 0.6)',
		fontSize: 10,
		fontWeight: '800',
		letterSpacing: 1.2,
	},

	// Section Titles and Controls
	sectionContainer: {
		width: '100%',
	},
	sectionHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},

	// Point of Interest Sections
	pointOfInterestsSection: {
		width: '100%',
	},
	loadingCard: {
		height: 160,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.08)',
	},
	emptyCard: {
		height: 160,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.08)',
		padding: 16,
	},
	emptyText: {
		color: 'rgba(255, 255, 255, 0.6)',
		fontSize: 12,
		textAlign: 'center',
	},

	// Dashboard Grid Layouts
	environmentGrid: {
		gap: 12,
	},
	gridRow: {
		flexDirection: 'row',
		gap: 12,
		width: '100%',
	},
	weatherSection: {
		flex: 2,
		minWidth: 0,
	},
	lunarSection: {
		flex: 1,
		minWidth: 0,
	},

	// Translucent Card / Tile Base
	tile: {
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.08)',
		overflow: 'hidden',
	},

	// Weather & Metric Utility Styles
	hourDay: {
		color: 'rgba(255, 255, 255, 0.5)',
		fontSize: 11,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	metricPill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.08)',
	},
	metricText: {
		color: 'rgba(255, 255, 255, 0.85)',
		fontSize: 10,
		fontWeight: '600',
	},
});
