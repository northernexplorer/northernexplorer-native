import type {WeatherWarningType} from '@northernexplorer/types';

function normalizeText(value?: string): string {
	return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function mergeText(first?: string, second?: string): string {
	if (!first) return second ?? '';
	if (!second || first === second) return first;

	const [primary, additional] = first.length >= second.length ? [first, second] : [second, first];
	const seen = new Set(primary.split(/\n\s*\n/).map(normalizeText));
	const extraParagraphs = additional.split(/\n\s*\n/).filter(paragraph => {
		const key = normalizeText(paragraph);
		if (!key || seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	return extraParagraphs.length ? `${primary}\n\n${extraParagraphs.join('\n\n')}` : primary;
}

function parseAreas(value?: string): Set<string> | null {
	const areas = (value ?? '').split(';').map(normalizeText).filter(Boolean);
	return areas.length ? new Set(areas) : null;
}

function isSubset(first: Set<string>, second: Set<string>): boolean {
	return [...first].every(area => second.has(area));
}

function sameIdentity(first: WeatherWarningType, second: WeatherWarningType): boolean {
	const firstEvent = normalizeText(first.event);
	const firstHeadline = normalizeText(first.headline);
	const firstSeverity = normalizeText(first.severity);
	return (
		!!firstEvent &&
		!!firstHeadline &&
		!!firstSeverity &&
		firstEvent === normalizeText(second.event) &&
		firstHeadline === normalizeText(second.headline) &&
		firstSeverity === normalizeText(second.severity)
	);
}

function areRelatedAreas(first: WeatherWarningType, second: WeatherWarningType): boolean {
	const firstAreas = parseAreas(first.areas);
	const secondAreas = parseAreas(second.areas);
	return !!firstAreas && !!secondAreas && (isSubset(firstAreas, secondAreas) || isSubset(secondAreas, firstAreas));
}

function getTimestamp(value?: string): number | null {
	if (!value) return null;
	const timestamp = new Date(value).getTime();
	return Number.isFinite(timestamp) ? timestamp : null;
}

function compareRecency(first: WeatherWarningType, second: WeatherWarningType): number {
	const firstEffective = getTimestamp(first.effective);
	const secondEffective = getTimestamp(second.effective);
	if (firstEffective !== null && secondEffective !== null && firstEffective !== secondEffective) {
		return firstEffective - secondEffective;
	}

	const firstExpiry = getTimestamp(first.expires);
	const secondExpiry = getTimestamp(second.expires);
	if (firstExpiry !== null && secondExpiry !== null && firstExpiry !== secondExpiry) {
		return firstExpiry - secondExpiry;
	}

	if (firstEffective !== secondEffective) return firstEffective === null ? -1 : 1;
	if (firstExpiry !== secondExpiry) return firstExpiry === null ? -1 : 1;
	return 0;
}

export function filterWeatherWarnings(warnings: WeatherWarningType[], now = Date.now()): WeatherWarningType[] {
	const activeWarnings: WeatherWarningType[] = [];

	for (const warning of warnings) {
		const expiresAt = warning.expires ? new Date(warning.expires).getTime() : null;
		if (expiresAt !== null && !(expiresAt > now)) continue;

		if (!normalizeText(warning.event) || !normalizeText(warning.headline) || !normalizeText(warning.severity)) {
			activeWarnings.push(warning);
			continue;
		}

		const duplicateIndex = activeWarnings.findIndex(
			existing =>
				sameIdentity(existing, warning) &&
				normalizeText(existing.areas) === normalizeText(warning.areas) &&
				getTimestamp(existing.expires) === expiresAt,
		);
		if (duplicateIndex !== -1) {
			const existing = activeWarnings[duplicateIndex];
			activeWarnings[duplicateIndex] = {
				...existing,
				desc: mergeText(existing.desc, warning.desc),
				instruction: mergeText(existing.instruction, warning.instruction),
			};
			continue;
		}

		const relatedIndex = activeWarnings.findIndex(existing => sameIdentity(existing, warning) && areRelatedAreas(existing, warning));
		if (relatedIndex === -1) {
			activeWarnings.push(warning);
		} else {
			if (compareRecency(warning, activeWarnings[relatedIndex]) > 0) {
				activeWarnings[relatedIndex] = warning;
			}
		}
	}

	return activeWarnings;
}
