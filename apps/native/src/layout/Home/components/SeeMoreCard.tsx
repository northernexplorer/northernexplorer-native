import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Link, Href} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {styles as globalStyles} from '~/layout/Home/styles';

type Props = {
	href?: Href;
	title?: string;
};

export function SeeMoreCard({href = '/destinations', title = 'See More'}: Props) {
	return (
		<Link href={href} asChild>
			<Pressable style={({pressed}) => [{opacity: pressed ? 0.85 : 1}]}>
				<View style={[globalStyles.tile, styles.card]}>
					<View style={styles.iconCircle}>
						<Ionicons name="compass-outline" size={28} color="#38bdf8" />
					</View>
					<View style={styles.actionPill}>
						<Text style={styles.actionText}>{title}</Text>
						<Ionicons name="arrow-forward" size={14} color="#38bdf8" />
					</View>
				</View>
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	card: {
		width: 170,
		height: 240,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
	},
	iconCircle: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: 'rgba(56, 189, 248, 0.12)',
		borderWidth: 1,
		borderColor: 'rgba(56, 189, 248, 0.25)',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 14,
	},
	title: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'center',
		marginBottom: 4,
	},
	subtitle: {
		color: '#94a3b8',
		fontSize: 12,
		textAlign: 'center',
		marginBottom: 16,
		lineHeight: 16,
	},
	actionPill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.12)',
	},
	actionText: {
		color: '#38bdf8',
		fontSize: 12,
		fontWeight: '600',
	},
});
