import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

type PaginationProps = {
	currentPage: number;
	limit: number;
	itemCount: number;
	onPageChange: (page: number) => void;
};

export function Pagination({currentPage, limit, itemCount, onPageChange}: PaginationProps) {
	const hasNextPage = itemCount === limit;

	return (
		<View style={styles.container}>
			{/* Previous Button */}
			<TouchableOpacity
				style={[styles.button, currentPage === 1 && styles.disabledButton]}
				onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<Ionicons name="chevron-back" size={18} color={currentPage === 1 ? '#94a3b8' : '#0f172a'} />
			</TouchableOpacity>

			{/* Current Page Label */}
			<View style={styles.pageLabelContainer}>
				<Text style={styles.pageText}>Page {currentPage}</Text>
			</View>

			{/* Next Button */}
			<TouchableOpacity
				style={[styles.button, !hasNextPage && styles.disabledButton]}
				onPress={() => hasNextPage && onPageChange(currentPage + 1)}
				disabled={!hasNextPage}
			>
				<Ionicons name="chevron-forward" size={18} color={!hasNextPage ? '#94a3b8' : '#0f172a'} />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		marginVertical: 16,
	},
	button: {
		width: 36,
		height: 36,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	disabledButton: {
		backgroundColor: '#f8fafc',
		borderColor: '#f1f5f9',
	},
	pageLabelContainer: {
		paddingHorizontal: 12,
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
	},
	pageText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#334155',
	},
});
