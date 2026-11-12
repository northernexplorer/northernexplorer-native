import {SiteDifficultyEnum} from '@northernexplorer/types';

export const buildSiteDifficultyFilter = (maxDifficultyIndex: number | undefined): {sql: string; params: SiteDifficultyEnum[]} => {
	if (maxDifficultyIndex === undefined) return {sql: '', params: []};

	const allowedDifficulties = Object.values(SiteDifficultyEnum).slice(0, maxDifficultyIndex + 1);
	if (allowedDifficulties.length === 0) return {sql: '', params: []};

	const placeholders = allowedDifficulties.map(() => '?').join(', ');
	return {
		sql: `AND (h.difficulty IN (${placeholders}) OR h.difficulty IS NULL)`,
		params: allowedDifficulties,
	};
};
