export function getRevenueCatApiKey(platform: string, keys: {ios?: string; android?: string}): string | undefined {
	const key = platform === 'ios' ? keys.ios : platform === 'android' ? keys.android : undefined;
	return key?.trim() || undefined;
}
