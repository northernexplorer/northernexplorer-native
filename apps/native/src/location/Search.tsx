import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestTypeEnum, RolesEnum, VisitedFilterEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {DestinationCard} from '~/location/DestinationList/DestinationCard';
import {useMap} from '~/location/state/map/useMap';
import {usePermissions} from '~/user/state/subscription';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {getMaxSiteDifficultyIndex} from '~/location/lib/siteDifficulty';

export * from './SearchSidebar';

const PAGE_SIZE = 20;

type SearchFilters = {
	selectedPoiTypes: PointOfInterestTypeEnum[];
	visitedFilter: VisitedFilterEnum;
	minRating: number | null;
	minDifficultyIndex: number;
	maxDifficultyIndex: number;
	minCostIndex: number;
	maxCostIndex: number;
	showDrafts: boolean;
};

export function Search() {
	const [searchText, setSearchText] = useState('');
	const [query, setQuery] = useState('');
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [page, setPage] = useState(1);
	const [searchVersion, setSearchVersion] = useState(0);
	const mapState = useMap();
	const permissions = usePermissions();
	const authentication = useAuthentication();
	const maxAllowedDifficultyIndex = getMaxSiteDifficultyIndex(!!permissions?.navigation.useRemoteDifficulty);
	const isAdmin = !!authentication?.roles?.includes(RolesEnum.Admin);
	const filters: SearchFilters = {
		selectedPoiTypes: mapState.selectedPoiTypes,
		visitedFilter: mapState.visitedFilter,
		minRating: mapState.minRating,
		minDifficultyIndex: mapState.minDifficultyIndex,
		maxDifficultyIndex: mapState.maxDifficultyIndex ?? maxAllowedDifficultyIndex,
		minCostIndex: mapState.minCostIndex,
		maxCostIndex: mapState.maxCostIndex,
		showDrafts: isAdmin && mapState.showDrafts,
	};
	const filtersKey = JSON.stringify(filters);

	useEffect(() => {
		setPage(1);
	}, [filtersKey]);

	const handleSearch = () => {
		setPage(1);
		setQuery(searchText.trim());
		setHasSubmitted(true);
		setSearchVersion(version => version + 1);
	};

	const retrySearch = () => setSearchVersion(version => version + 1);

	return (
		<ScrollView style={styles.scrollView} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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

			{!hasSubmitted ? (
				<View style={styles.messageCard}>
					<MaterialCommunityIcons name="map-search-outline" size={42} color="#94a3b8" />
					<Text style={styles.messageTitle}>Find a destination</Text>
					<Text style={styles.messageSubtitle}>
						Search by name or submit with an empty name to browse destinations using these filters.
					</Text>
				</View>
			) : (
				<SearchResults
					key={`${searchVersion}:${page}:${query}:${filtersKey}`}
					query={query}
					page={page}
					filters={filters}
					onPageChange={setPage}
					onRetry={retrySearch}
				/>
			)}
		</ScrollView>
	);
}

type SearchResultsProps = {
	query: string;
	page: number;
	filters: SearchFilters;
	onPageChange: (page: number) => void;
	onRetry: () => void;
};

function SearchResults({query, page, filters, onPageChange, onRetry}: SearchResultsProps) {
	const {data, loading, error} = useApiFetch('location', 'PointOfInterestController', 'search', {
		query,
		limit: PAGE_SIZE + 1,
		offset: (page - 1) * PAGE_SIZE,
		...filters,
	});
	const {isOffline} = useIsOffline();
	const sites = data?.slice(0, PAGE_SIZE) ?? [];
	const hasNextPage = (data?.length ?? 0) > PAGE_SIZE;
	const hasError = !!error || (!loading && isOffline && data === null);

	return (
		<>
			{loading ? (
				<View style={styles.messageCard}>
					<ActivityIndicator size="small" color="#0284c7" />
					<Text style={styles.messageTitle}>Searching destinations</Text>
				</View>
			) : hasError ? (
				<View style={styles.messageCard}>
					<MaterialCommunityIcons name="alert-circle-outline" size={42} color="#dc2626" />
					<Text style={styles.messageTitle}>Search failed</Text>
					<Text style={styles.messageSubtitle}>We couldn’t load destinations. Check your connection and try again.</Text>
					<Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
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
							<Pressable accessibilityRole="button" onPress={() => onPageChange(page - 1)} style={styles.pageButton}>
								<Text style={styles.pageButtonText}>Previous</Text>
							</Pressable>
						)}
						<Text style={styles.pageLabel}>Page {page}</Text>
						{hasNextPage && (
							<Pressable accessibilityRole="button" onPress={() => onPageChange(page + 1)} style={styles.pageButton}>
								<Text style={styles.pageButtonText}>Next</Text>
							</Pressable>
						)}
					</View>
				</>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	container: {
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
