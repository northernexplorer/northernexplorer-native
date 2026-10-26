import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {NotFoundMap} from './components/NotFoundMap';

export function NotFound() {
	return (
		<View style={styles.container}>
			<View style={styles.card}>
				{/* Header Section */}
				<View style={styles.header}>
					<View style={styles.iconCircle}>
						<MaterialCommunityIcons name="compass-off-outline" size={48} color="#0284c7" />
					</View>

					{/* 404 Status Badge */}
					<View style={styles.badgeRow}>
						<View style={styles.codeBadge}>
							<MaterialCommunityIcons name="map-marker-question" size={14} color="#0284c7" />
							<Text style={styles.codeText}>404 • UNCHARTED TERRITORY</Text>
						</View>
					</View>

					<Text style={styles.title}>Looks Like You Got Lost!</Text>
					<Text style={styles.subtitle}>
						Need a compass? You've wandered off the marked trail. Don't worry — even experienced explorers take an unexpected detour. Use
						the giant map below or pick a waypoint to navigate back to safety.
					</Text>
				</View>

				{/* Giant Interactive Map */}
				<NotFoundMap />

				{/* Navigation Waypoints / Action Buttons */}
				<View style={styles.actionsContainer}>
					<Link href="/map" asChild style={styles.primaryLink}>
						<Pressable style={({pressed}) => [styles.primaryButton, pressed && styles.buttonPressed]}>
							<Ionicons name="map-outline" size={18} color="#ffffff" style={styles.buttonIcon} />
							<Text style={styles.primaryButtonText}>Explore Map & Nearby Points</Text>
						</Pressable>
					</Link>

					<View style={styles.secondaryActionsRow}>
						<Link href="/" asChild style={styles.secondaryLink}>
							<Pressable style={({pressed}) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
								<Ionicons name="grid-outline" size={18} color="#0f172a" style={styles.buttonIcon} />
								<Text style={styles.secondaryButtonText}>Return to Dashboard</Text>
							</Pressable>
						</Link>

						<Link href="/destinations" asChild style={styles.secondaryLink}>
							<Pressable style={({pressed}) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
								<Ionicons name="compass-outline" size={18} color="#0f172a" style={styles.buttonIcon} />
								<Text style={styles.secondaryButtonText}>Browse Destinations</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 24,
		paddingHorizontal: 12,
		width: '100%',
	},
	card: {
		width: '100%',
		maxWidth: 820,
		backgroundColor: '#ffffff',
		borderRadius: 24,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingHorizontal: 20,
		paddingVertical: 32,
		alignItems: 'center',
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 6},
		shadowOpacity: 0.1,
		shadowRadius: 16,
		elevation: 5,
	},
	header: {
		alignItems: 'center',
		width: '100%',
	},
	iconCircle: {
		width: 88,
		height: 88,
		borderRadius: 44,
		backgroundColor: '#f0f9ff',
		borderWidth: 1,
		borderColor: '#bae6fd',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		shadowColor: '#0284c7',
		shadowOffset: {width: 0, height: 3},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 3,
	},
	badgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	codeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: '#f0fdf4',
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: '#bbf7d0',
	},
	codeText: {
		fontSize: 12,
		fontWeight: '800',
		color: '#15803d',
		letterSpacing: 0.8,
	},
	title: {
		fontSize: 28,
		fontWeight: '800',
		color: '#0f172a',
		marginBottom: 10,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 15,
		lineHeight: 23,
		color: '#475569',
		textAlign: 'center',
		maxWidth: 580,
		marginBottom: 8,
	},
	actionsContainer: {
		width: '100%',
		gap: 12,
		marginTop: 8,
	},
	primaryLink: {
		width: '100%',
	},
	primaryButton: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0284c7',
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 12,
		shadowColor: '#0284c7',
		shadowOffset: {width: 0, height: 3},
		shadowOpacity: 0.25,
		shadowRadius: 6,
		elevation: 3,
	},
	primaryButtonText: {
		color: '#ffffff',
		fontSize: 15,
		fontWeight: '700',
	},
	secondaryActionsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		width: '100%',
	},
	secondaryLink: {
		flex: 1,
		minWidth: 180,
	},
	secondaryButton: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f8fafc',
		borderWidth: 1,
		borderColor: '#cbd5e1',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
	},
	secondaryButtonText: {
		color: '#0f172a',
		fontSize: 14,
		fontWeight: '600',
	},
	buttonIcon: {
		marginRight: 8,
	},
	buttonPressed: {
		opacity: 0.85,
		transform: [{scale: 0.99}],
	},
	tipsCard: {
		marginTop: 20,
		width: '100%',
		backgroundColor: '#fefce8',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#fef08a',
		padding: 14,
	},
	tipsHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginBottom: 4,
	},
	tipsTitle: {
		fontSize: 13,
		fontWeight: '700',
		color: '#92400e',
	},
	tipsText: {
		fontSize: 13,
		lineHeight: 18,
		color: '#78350f',
	},
});
