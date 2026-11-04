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

export function filterWeatherWarnings(warnings: WeatherWarningType[], now = Date.now()): WeatherWarningType[] {
	const activeWarnings: WeatherWarningType[] = [];
	const warningIndexes = new Map<string, number>();

	for (const warning of warnings) {
		const expiresAt = warning.expires ? new Date(warning.expires).getTime() : null;
		if (expiresAt !== null && !(expiresAt > now)) continue;

		if (!normalizeText(warning.event) && !normalizeText(warning.headline)) {
			activeWarnings.push(warning);
			continue;
		}

		const key = JSON.stringify([
			normalizeText(warning.event),
			normalizeText(warning.headline),
			normalizeText(warning.severity),
			normalizeText(warning.areas),
			expiresAt,
		]);
		const index = warningIndexes.get(key);
		if (index === undefined) {
			warningIndexes.set(key, activeWarnings.length);
			activeWarnings.push(warning);
		} else {
			const existing = activeWarnings[index];
			activeWarnings[index] = {
				...existing,
				desc: mergeText(existing.desc, warning.desc),
				instruction: mergeText(existing.instruction, warning.instruction),
			};
		}
	}

	return activeWarnings;
}
