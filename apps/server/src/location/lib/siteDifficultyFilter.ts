import {SiteDifficultyEnum} from '@northernexplorer/types';

export const buildSiteDifficultyFilter = (
	maxDifficultyIndex?: number | null,
	minDifficultyIndex?: number | null,
): {sql: string; params: SiteDifficultyEnum[]} => {
	if ((maxDifficultyIndex === undefined || maxDifficultyIndex === null) && (minDifficultyIndex === undefined || minDifficultyIndex === null)) {
		return {sql: '', params: []};
	}

	const allDifficulties = Object.values(SiteDifficultyEnum);
	const min = minDifficultyIndex !== undefined && minDifficultyIndex !== null ? Math.max(0, minDifficultyIndex) : 0;
	const max =
		maxDifficultyIndex !== undefined && maxDifficultyIndex !== null
			? Math.min(allDifficulties.length - 1, maxDifficultyIndex)
			: allDifficulties.length - 1;

	if (min > max) {
		return {sql: 'AND 1=0', params: []};
	}

	const allowedDifficulties = allDifficulties.slice(min, max + 1);
	if (allowedDifficulties.length === 0) return {sql: '', params: []};

	const placeholders = allowedDifficulties.map(() => '?').join(', ');
	return {
		sql: `AND (h.difficulty IN (${placeholders}) OR h.difficulty IS NULL)`,
		params: allowedDifficulties,
	};
};
