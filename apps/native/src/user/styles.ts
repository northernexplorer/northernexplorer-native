import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		maxWidth: 800,
		alignSelf: 'center',
		paddingHorizontal: 20,
		paddingVertical: 24,
		gap: 20,
	},
	tabBarContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
		marginBottom: 16,
	},
	tabBarContent: {
		flexDirection: 'row',
		gap: 8,
		paddingBottom: 2,
	},
	tabButton: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	activeTabButton: {
		borderBottomColor: '#0088cc',
	},
	tabText: {
		fontSize: 15,
		fontWeight: '500',
		color: '#64748b',
	},
	activeTabText: {
		color: '#0088cc',
		fontWeight: '600',
	},
	noticeBackground: {
		backgroundColor: '#fffaf3',
		borderWidth: 1,
		borderColor: '#573a08',
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
	},
	noticeText: {
		fontSize: 15,
		textAlign: 'center',
		lineHeight: 22,
		color: '#573a08',
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#333',
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 2,
	},
	field: {
		gap: 6,
	},
	button: {
		backgroundColor: '#0088cc',
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryButton: {
		borderWidth: 1,
		borderColor: '#0088cc',
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
	},
	secondaryButtonText: {
		color: '#0088cc',
		fontSize: 16,
		fontWeight: '600',
	},
	negativeButton: {
		backgroundColor: '#cc0000',
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
	},
	negativeButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	description: {
		fontSize: 15,
		textAlign: 'center',
		color: '#666',
		lineHeight: 22,
	},
	link: {
		color: '#0088cc',
		textAlign: 'center',
		fontSize: 15,
	},
	rememberRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	value: {
		fontSize: 17,
		fontWeight: '500',
	},
	switchRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 16,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	linkText: {
		color: '#0088cc',
		textDecorationLine: 'underline',
		fontWeight: 'bold',
	},
	categorySection: {
		gap: 12,
	},
	categoryHeader: {
		fontSize: 18,
		fontWeight: '700',
		color: '#111827',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
		paddingBottom: 6,
	},
});

export default styles;
