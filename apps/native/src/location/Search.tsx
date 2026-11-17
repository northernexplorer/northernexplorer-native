import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestType} from '@northernexplorer/types';
import {apiClient} from '~/core/apiClient';
import {DestinationCard} from '~/location/DestinationList/DestinationCard';

const PAGE_SIZE = 20;

type SearchStatus = {
	requestKey: string;
	loading: boolean;
	error: boolean;
	sites?: PointOfInterestType[];
	hasNextPage?: boolean;
};

export function Search() {
	const [searchText, setSearchText] = useState('');
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [searchVersion, setSearchVersion] = useState(0);
	const [status, setStatus] = useState<SearchStatus | null>(null);
	const requestId = useRef(0);

	const requestKey = `${searchVersion}:${page}:${query}`;
	const currentStatus = status?.requestKey === requestKey ? status : null;

	useEffect(() => {
		if (!query) {
			setStatus(null);
			return;
		}

		const currentRequestId = ++requestId.current;
		let isCurrent = true;
		setStatus({requestKey, loading: true, error: false});

		apiClient('location', 'PointOfInterestController', 'search', {query, limit: PAGE_SIZE + 1, offset: (page - 1) * PAGE_SIZE}, 'GET')
			.then(sites => {
				if (isCurrent && requestId.current === currentRequestId) {
					setStatus({
						requestKey,
						loading: false,
						error: false,
						sites: sites.slice(0, PAGE_SIZE),
						hasNextPage: sites.length > PAGE_SIZE,
					});
				}
			})
			.catch(() => {
				if (isCurrent && requestId.current === currentRequestId) {
					setStatus({requestKey, loading: false, error: true});
				}
			});

		return () => {
			isCurrent = false;
		};
	}, [page, query, requestKey]);

	const handleSearch = () => {
		setPage(1);
		setQuery(searchText.trim());
		setSearchVersion(version => version + 1);
	};

	const retrySearch = () => setSearchVersion(version => version + 1);
	const sites = currentStatus?.sites ?? [];
	const isLoading = !!query && (!currentStatus || currentStatus.loading);

	return (
		<View style={styles.container}>
			<View style={styles.searchForm}>
				<TextInput
					accessibilityLabel="Search destinations"
					placeholder="Search destinations by name"
					placeholderTextColor="#94a3b8"
					returnKeyType="search"
					value={searchText}
					onChangeText={setSearchText}
					onSubmitEditing={handleSearch}
					style={styles.searchInput}
				/>
				<Pressable accessibilityRole="button" onPress={handleSearch} style={styles.searchButton}>
					<MaterialCommunityIcons name="magnify" size={20} color="#ffffff" />
					<Text style={styles.searchButtonText}>Search</Text>
				</Pressable>
			</View>

			{!query ? (
				<View style={styles.messageCard}>
					<MaterialCommunityIcons name="map-search-outline" size={42} color="#94a3b8" />
					<Text style={styles.messageTitle}>Find a destination</Text>
					<Text style={styles.messageSubtitle}>Search published destinations by name.</Text>
				</View>
			) : isLoading ? (
				<View style={styles.messageCard}>
					<ActivityIndicator size="small" color="#0284c7" />
					<Text style={styles.messageTitle}>Searching destinations</Text>
				</View>
			) : currentStatus?.error ? (
				<View style={styles.messageCard}>
					<MaterialCommunityIcons name="alert-circle-outline" size={42} color="#dc2626" />
					<Text style={styles.messageTitle}>Search failed</Text>
					<Text style={styles.messageSubtitle}>We couldn’t load destinations. Check your connection and try again.</Text>
					<Pressable accessibilityRole="button" onPress={retrySearch} style={styles.retryButton}>
						<Text style={styles.retryButtonText}>Try again</Text>
					</Pressable>
				</View>
			) : sites.length === 0 ? (
				<View style={styles.messageCard}>
					<MaterialCommunityIcons name="map-search-outline" size={42} color="#94a3b8" />
					<Text style={styles.messageTitle}>No destinations found</Text>
					<Text style={styles.messageSubtitle}>Try another destination name.</Text>
				</View>
			) : (
				<>
					<View style={styles.list}>
						{sites.map(site => (
							<DestinationCard key={site.id} site={site} userCoords={null} />
						))}
					</View>
					<View style={styles.pagination}>
						{page > 1 && (
							<Pressable accessibilityRole="button" onPress={() => setPage(currentPage => currentPage - 1)} style={styles.pageButton}>
								<Text style={styles.pageButtonText}>Previous</Text>
							</Pressable>
						)}
						<Text style={styles.pageLabel}>Page {page}</Text>
						{currentStatus?.hasNextPage && (
							<Pressable accessibilityRole="button" onPress={() => setPage(currentPage => currentPage + 1)} style={styles.pageButton}>
								<Text style={styles.pageButtonText}>Next</Text>
							</Pressable>
						)}
					</View>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		gap: 16,
	},
	searchForm: {
		flexDirection: 'row',
		gap: 8,
	},
	searchInput: {
		flex: 1,
		minWidth: 0,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 11,
		color: '#0f172a',
		fontSize: 15,
	},
	searchButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		backgroundColor: '#0284c7',
		borderRadius: 10,
		paddingHorizontal: 16,
	},
	searchButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '700',
	},
	list: {
		gap: 12,
	},
	messageCard: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		padding: 32,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
	messageTitle: {
		color: '#0f172a',
		fontSize: 16,
		fontWeight: '700',
		marginTop: 4,
	},
	messageSubtitle: {
		color: '#64748b',
		fontSize: 13,
		textAlign: 'center',
		maxWidth: 360,
		lineHeight: 18,
	},
	retryButton: {
		marginTop: 8,
		paddingHorizontal: 16,
		paddingVertical: 9,
		borderRadius: 8,
		backgroundColor: '#0284c7',
	},
	retryButtonText: {
		color: '#ffffff',
		fontSize: 13,
		fontWeight: '700',
	},
	pagination: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16,
	},
	pageButton: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: '#e0f2fe',
	},
	pageButtonText: {
		color: '#0369a1',
		fontSize: 13,
		fontWeight: '700',
	},
	pageLabel: {
		color: '#475569',
		fontSize: 13,
		fontWeight: '600',
	},
});
