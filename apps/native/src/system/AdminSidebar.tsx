import {Text, StyleSheet} from 'react-native';
import {Link} from 'expo-router';

export function AdminSidebar() {
	return (
		<Link href="/admin/add-point-of-interest/" style={styles.button}>
			<Text style={styles.buttonText}>+ Add New POI</Text>
		</Link>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#0088cc',
		borderRadius: 6,
		paddingVertical: 10,
		paddingHorizontal: 16,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 140,
		textAlign: 'center',
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
		letterSpacing: 0.2,
	},
});
