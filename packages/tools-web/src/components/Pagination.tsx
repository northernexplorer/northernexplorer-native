import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';

type PaginationProps = {
	limit: number;
	itemCount: number;
	onPageChange?: (page: number) => void;
};

export function Pagination({limit, itemCount, onPageChange}: PaginationProps) {
	const router = useRouter();
	const params = useLocalSearchParams<{page?: string}>();

	const rawPage = params.page;
	const currentPage = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1;
	const hasNextPage = itemCount === limit;

	const handlePageChange = (newPage: number) => {
		router.setParams({
			page: newPage === 1 ? undefined : newPage.toString(),
		});

		onPageChange?.(newPage);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={[styles.button, currentPage === 1 && styles.disabledButton]}
				onPress={() => currentPage > 1 && handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<Ionicons name="chevron-back" size={18} color={currentPage === 1 ? '#94a3b8' : '#0f172a'} />
			</TouchableOpacity>

			<View style={styles.pageLabelContainer}>
				<Text style={styles.pageText}>Page {currentPage}</Text>
			</View>

			<TouchableOpacity
				style={[styles.button, !hasNextPage && styles.disabledButton]}
				onPress={() => hasNextPage && handlePageChange(currentPage + 1)}
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
