import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {FilterSettings} from '~/location/components/FilterSettings';
import {AdminSettings} from '~/location/components/AdminSettings';

export function SearchSidebar() {
	return (
		<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
			<View style={styles.headerRow}>
				<Text style={styles.headerLabel}>Filters</Text>
			</View>
			<FilterSettings />
			<AdminSettings description="Include unpublished sites in search" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
		paddingBottom: 24,
	},
	headerRow: {
		marginBottom: 2,
	},
	headerLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#94a3b8',
		letterSpacing: 0.8,
		textTransform: 'uppercase',
	},
});
