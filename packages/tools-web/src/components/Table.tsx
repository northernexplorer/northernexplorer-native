import React, {ReactNode} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export interface Column<T> {
	/** Unique key for the column */
	key: string;
	/** Header label text */
	title?: string;
	/** Custom render function for the cell */
	render?: (item: T, index: number) => ReactNode;
	/** Flex weight for column sizing (defaults to 1) */
	flex?: number;
	/** Fixed width for fixed-size columns (e.g. actions, icons) */
	width?: number;
	/** Header text alignment */
	align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
	/** Array of data items to render */
	data?: T[] | null;
	/** Column configurations */
	columns: Column<T>[];
	/** Function to extract a unique React key for each item */
	keyExtractor: (item: T, index: number) => string;
	/** Message displayed when data is empty or null */
	emptyText?: string;
	/** Optional empty state icon name */
	emptyIcon?: keyof typeof Ionicons.glyphMap;
	/** Row press handler */
	onRowPress?: (item: T, index: number) => void;
}

export function Table<T>({data, columns, keyExtractor, emptyText = 'No items found.', emptyIcon = 'layers-outline', onRowPress}: TableProps<T>) {
	return (
		<View style={styles.tableCard}>
			{/* Table Header */}
			<View style={[styles.row, styles.headerRow]}>
				{columns.map(col => {
					const colStyle = col.width ? {width: col.width} : {flex: col.flex ?? 1};

					const alignStyle = col.align ? {textAlign: col.align} : null;

					return (
						<Text key={col.key} style={[styles.cellHeader, colStyle, alignStyle]} numberOfLines={1}>
							{col.title ?? ''}
						</Text>
					);
				})}
			</View>

			{/* Table Body */}
			{!data || data.length === 0 ? (
				<View style={styles.emptyState}>
					<Ionicons name={emptyIcon} size={40} color="#adb5bd" />
					<Text style={styles.emptyText}>{emptyText}</Text>
				</View>
			) : (
				data.map((item, index) => {
					const isStripe = index % 2 === 1;

					return (
						<Pressable
							key={keyExtractor(item, index)}
							disabled={!onRowPress}
							style={({pressed}) => [styles.row, isStripe && styles.stripeRow, pressed && styles.rowPressed]}
							onPress={() => onRowPress?.(item, index)}
						>
							{columns.map(col => {
								const colStyle = col.width ? {width: col.width} : {flex: col.flex ?? 1};

								return (
									<View key={col.key} style={colStyle}>
										{col.render ? (
											col.render(item, index)
										) : (
											<Text style={styles.cellText}>{String((item as Record<string, unknown>)[col.key] ?? '')}</Text>
										)}
									</View>
								);
							})}
						</Pressable>
					);
				})
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	tableCard: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e9ecef',
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.04,
		shadowRadius: 6,
		elevation: 2,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f3f5',
	},
	headerRow: {
		backgroundColor: '#f8f9fa',
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
	},
	stripeRow: {
		backgroundColor: '#fafafa',
	},
	rowPressed: {
		backgroundColor: '#eef2f6',
	},
	cellHeader: {
		fontSize: 12,
		fontWeight: '600',
		color: '#495057',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	cellText: {
		fontSize: 13,
		fontWeight: '500',
		color: '#343a40',
	},
	emptyState: {
		padding: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyText: {
		fontSize: 14,
		color: '#6c757d',
		marginTop: 8,
	},
});
