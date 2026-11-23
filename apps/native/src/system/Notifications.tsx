import React from 'react';
import {Text, View} from 'react-native';
import styles from '~/user/styles';

export function Notifications() {
	return (
		<View style={styles.container}>
			<View style={styles.categorySection}>
				<Text style={styles.categoryHeader}>Notifications</Text>
				<Text>Notifications aren’t available yet.</Text>
			</View>
		</View>
	);
}
