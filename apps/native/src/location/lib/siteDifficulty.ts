import {SiteDifficultyEnum} from '@northernexplorer/types';

const SITE_DIFFICULTY_LEVELS = Object.values(SiteDifficultyEnum);

export const hasSiteDifficultyAccess = (difficulty: SiteDifficultyEnum | undefined, canAccessRemote: boolean): boolean => {
	switch (difficulty) {
		case SiteDifficultyEnum.REMOTE_EASY:
		case SiteDifficultyEnum.REMOTE_MEDIUM:
		case SiteDifficultyEnum.REMOTE_HARD:
		case SiteDifficultyEnum.REMOTE_MULTI_DAY:
			return canAccessRemote;
		default:
			return true;
	}
};

export const getMaxSiteDifficultyIndex = (canAccessRemote: boolean): number =>
	canAccessRemote ? SITE_DIFFICULTY_LEVELS.length - 1 : SITE_DIFFICULTY_LEVELS.indexOf(SiteDifficultyEnum.REMOTE_EASY) - 1;
