import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_STORAGE_KEY = '@northernexplorer_api_cache';
const MAX_CACHE_ENTRIES = 500;

export const apiCache = new Map<string, unknown>();

let isCacheLoaded = false;
const cacheListeners = new Set<() => void>();

export const getApiCacheKey = (category: string, controller: string, method: string, params: unknown): string => {
	const serializedParams = params !== null && params !== undefined ? JSON.stringify(params) : '';
	return `${category}:${String(controller)}:${String(method)}:${serializedParams}`;
};

export const loadApiCache = async (): Promise<void> => {
	try {
		const raw = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Record<string, unknown>;
			Object.entries(parsed).forEach(([k, v]) => {
				apiCache.set(k, v);
			});
		}
	} catch (e) {
		console.warn('Failed to load apiCache from AsyncStorage', e);
	} finally {
		isCacheLoaded = true;
		cacheListeners.forEach(listener => listener());
	}
};

export const cacheInitPromise = loadApiCache();

export const subscribeToCacheLoad = (listener: () => void): (() => void) => {
	if (isCacheLoaded) {
		listener();
		return () => {};
	}
	cacheListeners.add(listener);
	return () => {
		cacheListeners.delete(listener);
	};
};

let persistTimeout: ReturnType<typeof setTimeout> | null = null;

const persistCacheToStorage = () => {
	if (persistTimeout) clearTimeout(persistTimeout);
	persistTimeout = setTimeout(async () => {
		try {
			while (apiCache.size > MAX_CACHE_ENTRIES) {
				const firstKey = apiCache.keys().next().value;
				if (firstKey) apiCache.delete(firstKey);
				else break;
			}
			const obj: Record<string, unknown> = {};
			apiCache.forEach((v, k) => {
				obj[k] = v;
			});
			await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(obj));
		} catch (e) {
			console.warn('Failed to persist apiCache to AsyncStorage', e);
		}
	}, 150);
};

export const setApiCache = (key: string, value: unknown): void => {
	apiCache.set(key, value);
	persistCacheToStorage();
};

export const getApiCache = <T = unknown>(key: string | null): T | null => {
	if (key && apiCache.has(key)) {
		return apiCache.get(key) as T;
	}
	return null;
};

export const clearApiCache = async (): Promise<void> => {
	apiCache.clear();
	if (persistTimeout) clearTimeout(persistTimeout);
	await AsyncStorage.removeItem(CACHE_STORAGE_KEY);
};

/**
 * When list endpoints return items that have an `id`, automatically cache
 * them under their respective `getById` key so detail views work offline.
 */
export const cacheEntityLookups = (category: string, controller: string, method: string, result: unknown): void => {
	if (!result || !Array.isArray(result)) return;

	if (category === 'location' && controller === 'PointOfInterestController') {
		if (method === 'getNearby' || method === 'getForMap' || method === 'getPublished' || method === 'getDrafts') {
			result.forEach(item => {
				if (item && typeof item === 'object' && 'id' in item && item.id) {
					const detailKey = getApiCacheKey('location', 'PointOfInterestController', 'getById', {id: item.id});
					apiCache.set(detailKey, item);
				}
			});
			persistCacheToStorage();
		}
	} else if (category === 'location' && controller === 'CountryController' && method === 'getAll') {
		result.forEach(item => {
			if (item && typeof item === 'object' && 'id' in item && item.id) {
				const detailKey = getApiCacheKey('location', 'CountryController', 'getById', {id: item.id});
				apiCache.set(detailKey, item);
			}
		});
		persistCacheToStorage();
	} else if (category === 'location' && controller === 'RegionController' && method === 'getAll') {
		result.forEach(item => {
			if (item && typeof item === 'object' && 'id' in item && item.id) {
				const detailKey = getApiCacheKey('location', 'RegionController', 'getById', {id: item.id});
				apiCache.set(detailKey, item);
			}
		});
		persistCacheToStorage();
	} else if (category === 'location' && controller === 'OrganizationController' && method === 'getAll') {
		result.forEach(item => {
			if (item && typeof item === 'object' && 'id' in item && item.id) {
				const detailKey = getApiCacheKey('location', 'OrganizationController', 'getById', {id: item.id});
				apiCache.set(detailKey, item);
			}
		});
		persistCacheToStorage();
	}
};
