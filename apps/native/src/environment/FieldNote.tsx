import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Spinner} from '@northernexplorer/tools';
import {useFieldNote} from '~/environment/state/fieldNote/useFieldNote';

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
				<View style={styles.centerContainer}>
					<View style={styles.contentWrapper}>
						{/* Subtle Top Meta Row */}
						<View style={styles.metaRow}>
							<MaterialCommunityIcons name="compass-rose" size={18} color="#0284c7" />
							<Text style={styles.headerLabel}>FIELD NOTE</Text>
						</View>

						{/* Accent-bordered Callout Block */}
						<View style={styles.quoteBlock}>
							<MaterialCommunityIcons name="format-quote-open" size={32} color="#0284c7" style={styles.quoteIcon} />
							<Text style={styles.title}>{fieldNote.title}</Text>
						</View>

						{/* Divider */}
						{fieldNote.body ? <View style={styles.divider} /> : null}

						{/* Body Text */}
						{fieldNote.body ? <Text style={styles.body}>{fieldNote.body}</Text> : null}
					</View>
				</View>
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
		width: '100%',
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	contentWrapper: {
		width: '100%',
		maxWidth: 400,
	},
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 16,
	},
	headerLabel: {
		color: '#64748b',
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 1.5,
	},
	quoteBlock: {
		borderLeftWidth: 3,
		borderLeftColor: '#0284c7',
		paddingLeft: 16,
		paddingVertical: 4,
	},
	quoteIcon: {
		marginBottom: 4,
		opacity: 0.8,
	},
	title: {
		color: '#0f172a',
		fontSize: 24,
		lineHeight: 32,
		fontWeight: '700',
		letterSpacing: -0.3,
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: 'rgba(15, 23, 42, 0.1)',
		marginVertical: 24,
		width: '100%',
	},
	body: {
		color: '#334155',
		fontSize: 16,
		lineHeight: 26,
		fontWeight: '400',
	},
});
