import {Repositories} from '../../core/repositories';
import {Response, RouteDefinition, ROUTES} from '@northernexplorer/types';

type Route<M extends keyof ROUTES['environment']['LunarController']> = RouteDefinition<'environment', 'LunarController'>[M];

export class LunarController {
	constructor(private repos: Repositories) {}

	public async getLunarData(): Promise<Response<Route<'getLunarData'>>> {
		// Known reference New Moon date (January 6, 2000, 18:14 UTC) in milliseconds
		const referenceTimeMs = Date.UTC(2000, 0, 6, 18, 14, 0);

		// Force current timestamp evaluation strictly via UTC to prevent server timezone shifting
		const currentTimeMs = Date.now();

		// Length of a single lunar synodic month in seconds converted to milliseconds
		const lunarPeriodSeconds = 29.530588853 * 86400;
		const lunarPeriodMs = lunarPeriodSeconds * 1000;

		// Total milliseconds elapsed since reference point
		const elapsedMs = currentTimeMs - referenceTimeMs;

		// Calculate position in the current cycle (0.0 to 1.0) using fractional modulo
		let currentPhaseFraction = (elapsedMs % lunarPeriodMs) / lunarPeriodMs;
		if (currentPhaseFraction < 0) {
			currentPhaseFraction += 1.0;
		}

		// Convert fraction into age of the moon in days (0 to 29.53)
		const moonAgeDays = currentPhaseFraction * 29.530588853;

		// Determine Phase Name and Illumination Percentage
		let illumination: number;
		if (currentPhaseFraction < 0.5) {
			illumination = currentPhaseFraction * 2; // Growing towards Full Moon
		} else {
			illumination = (1.0 - currentPhaseFraction) * 2; // Shrinking towards New Moon
		}

		// Determine structural name layout based on standard octants
		let phaseName: string;
		if (moonAgeDays < 1) {
			phaseName = 'New Moon';
		} else if (moonAgeDays < 6.38) {
			phaseName = 'Waxing Crescent';
		} else if (moonAgeDays < 8.38) {
			phaseName = 'First Quarter';
		} else if (moonAgeDays < 13.76) {
			phaseName = 'Waxing Gibbous';
		} else if (moonAgeDays < 15.76) {
			phaseName = 'Full Moon';
		} else if (moonAgeDays < 21.14) {
			phaseName = 'Waning Gibbous';
		} else if (moonAgeDays < 23.14) {
			phaseName = 'Third Quarter';
		} else if (moonAgeDays < 28.53) {
			phaseName = 'Waning Crescent';
		} else {
			phaseName = 'New Moon';
		}

		return {
			phase_fraction: parseFloat(currentPhaseFraction.toFixed(4)),
			moon_age_days: parseFloat(moonAgeDays.toFixed(2)),
			illumination_percentage: parseFloat((illumination * 100).toFixed(1)),
			phase_name: phaseName,
			is_waxing: currentPhaseFraction < 0.5,
		};
	}
}
