import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useFieldNote} from '~/environment/state/fieldNote/useFieldNote';
import {Spinner} from '~/layout/Layout/components/Spinner';

export function FieldNote() {
	const fieldNote = useFieldNote();

	if (!fieldNote) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<Spinner />
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				{/* Top Tag Header */}
				<View style={styles.tagBadge}>
					<MaterialCommunityIcons name="book-open-variant" size={14} color="#0284c7" />
					<Text style={styles.tagText}>Field Note</Text>
				</View>

				{/* Title / Quote */}
				<Text style={styles.title}>"{fieldNote.title}"</Text>

				{/* Body Text */}
				{fieldNote.body ? (
					<View style={styles.bodyContainer}>
						<Text style={styles.body}>{fieldNote.body}</Text>
					</View>
				) : null}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollContent: {
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	tagBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		backgroundColor: 'rgba(2, 132, 199, 0.08)',
		marginBottom: 16,
	},
	tagText: {
		color: '#0284c7',
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.8,
	},
	title: {
		color: '#0f172a',
		fontSize: 28,
		lineHeight: 36,
		fontWeight: '700',
		fontStyle: 'italic',
		letterSpacing: -0.3,
	},
	bodyContainer: {
		marginTop: 20,
		paddingTop: 20,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: 'rgba(15, 23, 42, 0.1)',
	},
	body: {
		color: '#334155',
		fontSize: 16,
		lineHeight: 26,
		fontWeight: '400',
	},
});
