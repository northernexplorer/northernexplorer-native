import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Link} from 'expo-router';

export function AdminSidebar() {
	return (
		<View style={styles.container}>
			<Link href="/admin/add-point-of-interest/" style={styles.button}>
				<Text style={styles.buttonText}>+ Add New POI</Text>
			</Link>
			<Link href="/admin/add-country/" style={[styles.button, styles.secondaryButton]}>
				<Text style={[styles.buttonText, styles.secondaryButtonText]}>+ Add Country</Text>
			</Link>
			<Link href="/admin/add-region/" style={[styles.button, styles.secondaryButton]}>
				<Text style={[styles.buttonText, styles.secondaryButtonText]}>+ Add Region</Text>
			</Link>
			<Link href="/admin/edit-region/" style={[styles.button, styles.secondaryButton]}>
				<Text style={[styles.buttonText, styles.secondaryButtonText]}>✎ Edit Region</Text>
			</Link>
			<Link href="/admin/add-organization/" style={[styles.button, styles.secondaryButton]}>
				<Text style={[styles.buttonText, styles.secondaryButtonText]}>+ Add Organization</Text>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		gap: 8,
	},
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
		textAlign: 'center',
	},
	secondaryButton: {
		backgroundColor: '#f1f3f5',
		borderWidth: 1,
		borderColor: '#dee2e6',
	},
	secondaryButtonText: {
		color: '#343a40',
	},
});
