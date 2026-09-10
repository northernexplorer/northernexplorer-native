import {m202606} from './m202606';
import {m202607} from './m202607';
import {m202608} from './m202608';
import {m202609} from './m202609';

export const migrationsRegistry: Record<string, string[]> = {
	...m202606,
	...m202607,
	...m202608,
	...m202609,
};
