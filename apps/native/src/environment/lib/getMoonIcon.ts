import {LunarCycleType} from '@northernexplorer/types';

export function getMoonIcon(data: LunarCycleType) {
	const illum = data.illumination_percentage;

	if (illum < 5) return 'moon-new';
	if (illum < 25) return data.is_waxing ? 'moon-waxing-crescent' : 'moon-waning-crescent';
	if (illum < 45) return data.is_waxing ? 'moon-first-quarter' : 'moon-last-quarter';
	if (illum < 75) return data.is_waxing ? 'moon-waxing-gibbous' : 'moon-waning-gibbous';
	return 'moon-full';
}
