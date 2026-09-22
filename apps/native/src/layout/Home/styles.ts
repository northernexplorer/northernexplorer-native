import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	// Base Screen Wrapper
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#1a1a1a',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1a1a1a',
	},

	// Left Sidebar / Tool Panel (Restored)
	leftSidebar: {
		width: 64,
		backgroundColor: '#1a1a1a',
		borderRightWidth: 1,
		borderRightColor: '#333333',
		paddingVertical: 16,
		paddingHorizontal: 6,
		alignItems: 'center',
	},
	sidebarLabel: {
		color: 'rgba(255,255,255,0.45)',
		fontSize: 10,
		fontWeight: '800',
		letterSpacing: 1.5,
		marginBottom: 16,
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

	// Main Content Area (Compact Mobile Padding)
	mainContent: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		gap: 16,
	},

	// Header Components
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginBottom: 0,
	},
	headerSubtitle: {
		color: 'rgba(255, 255, 255, 0.6)',
		fontSize: 10,
		fontWeight: '800',
		letterSpacing: 1.2,
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: 24,
		fontWeight: '700',
		letterSpacing: -0.5,
	},
	locationBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.12)',
	},
	dotIndicator: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#34D399',
	},
	locationText: {
		color: 'rgba(255, 255, 255, 0.85)',
		fontSize: 11,
		fontWeight: '600',
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
	sectionTitle: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
	},
	sectionAction: {
		color: 'rgba(255, 255, 255, 0.72)',
		fontSize: 12,
		fontWeight: '600',
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
	fieldNoteSection: {
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

	// Tile inner content padding helper
	tilePadding: {
		padding: 12,
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
