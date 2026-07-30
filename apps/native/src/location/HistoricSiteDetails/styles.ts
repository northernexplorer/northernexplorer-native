import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
	banner: {
		width: '100%',
		height: 300,
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



	reviewCard:{
		
		borderColor:'black',
		flexDirection: 'column',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
	},
	
	userName:{
		fontSize:20,
     fontWeight:600
	},
	score:{
     fontSize:15
	},
	description:{
		marginTop:30,
        	fontSize:20,
     fontWeight:300
	}
});
