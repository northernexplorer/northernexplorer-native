import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
	bannerContainer: {
		position: 'relative',
		height: 240,
		width: '100%',
	},
	banner: {
		width: '100%',
		height: '100%',
	},
	mapCard: {
		position: 'absolute',
		bottom: 16,
		right: 16,
		width: 120,
		height: 120,
		borderRadius: 12,
		overflow: 'hidden',
		borderWidth: 2,
		borderColor: '#ffffff',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 6,
	},
	content: {
		padding: 24,
	},
	breadcrumbs: {
		color: '#0088cc',
		fontSize: 12,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
	title: {
		color: '#1a1a1a',
		fontSize: 26,
		fontWeight: '700',
		marginTop: 8,
	},
	metaContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
	},

	metaLabel: {
		color: '#1a1a1a',
		fontSize: 13,
		marginTop: 6,
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
		paddingRight: 20,
	},
	divider: {
		height: 1,
		backgroundColor: '#333333',
		marginVertical: 20,
	},
	body: {
		fontSize: 16,
		lineHeight: 26,
	},
	errorText: {
		color: '#ff4444',
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'center',
		padding: 24,
	},

	reviewCard: {
		borderColor: 'black',
		flexDirection: 'column',
		flexWrap: 'wrap',
	},

	userName: {
		fontSize: 20,
		fontWeight: 600,
	},
	score: {
		fontSize: 15,
	},
	description: {
		marginTop: 30,
		fontSize: 20,
		fontWeight: 300,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	editButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#0088cc',
		borderRadius: 6,
	},
	editButtonText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: 14,
	},

	reviewForm: {
		padding: 10,
		borderRadius: 10,
		width: '50%',
		gap: 10,
		backgroundColor: '#555555',
	},

	reviewTitle: {
		fontWeight: 600,
		fontSize: 22,
		color: 'white',
	},

	submitReview: {
		marginTop: 10,
		width: 80,
		textAlign: 'center',
		borderRadius: 6,
		padding: 5,
		color: 'white',
		fontWeight: '500',
		backgroundColor: 'black',
	},
});
