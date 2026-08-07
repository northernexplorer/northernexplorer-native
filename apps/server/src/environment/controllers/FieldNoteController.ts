import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['environment']['FieldNoteController']> = RouteDefinition<'environment', 'FieldNoteController'>[M];

export class FieldNoteController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getFieldNoteData(params: Params<Route<'getFieldNoteData'>>): Promise<Response<Route<'getFieldNoteData'>>> {
		const {lat, lon} = params;
		const weather = await this.repos.weather.getWeatherCache(lat, lon);

		if (!weather.current) {
			throw new Error('Unable to load current weather.');
		}

		const {current} = weather;
		const temp = current.temp_c !== undefined ? Number(current.temp_c) : 999;
		const wind = current.wind_kph ?? 0;
		const gust = current.gust_kph ?? wind;
		const clouds = current.cloud ?? 0;
		const humidity = current.humidity ?? 0;
		const visibility = current.vis_km ?? 10;
		const uv = current.uv ?? 0;
		const pressure = current.pressure_mb ?? 1013;
		const description = (current.condition?.text ?? '').toLowerCase();

		// ==========================================
		// 1. SEVERE WEATHER & ATMOSPHERIC HAZARDS
		// ==========================================
		if (description.includes('thunder') || description.includes('lightning') || description.includes('squall')) {
			return {
				title: 'Atmospheric Instability',
				body: 'Active electrical or convective instability detected. Rapidly changing field dynamics expected.',
			};
		}

		if (description.includes('tornado') || description.includes('funnel') || description.includes('hail') || gust >= 70) {
			return {
				title: 'Extreme Wind / Storm Cell',
				body: 'Severe shear or hail risk active. Field observation should proceed with extreme caution.',
			};
		}

		// ==========================================
		// 2. PRECIPITATION & FROZEN SURFACE
		// ==========================================
		if (description.includes('blizzard') || description.includes('heavy snow') || (description.includes('snow') && wind >= 30)) {
			return {
				title: 'Severe Winter Surface Action',
				body: 'Blowing snow and freezing dynamics are active. Surface orientation and tracks obscured.',
			};
		}

		if (description.includes('snow') || description.includes('flurries') || description.includes('sleet') || description.includes('ice')) {
			return {
				title: 'Winter Surface Activity',
				body: 'Active snow or freezing precipitation is altering terrain visibility and ground conditions.',
			};
		}

		if (description.includes('heavy rain') || description.includes('torrential') || description.includes('downpour')) {
			return {
				title: 'Heavy Precipitation Flow',
				body: 'Saturated ground flow and high runoff active. Field sightlines and traction significantly degraded.',
			};
		}

		if (description.includes('rain') || description.includes('drizzle') || description.includes('showers')) {
			return {
				title: 'Moisture in the Air',
				body: 'Precipitation is actively shaping the immediate landscape and softening ambient light.',
			};
		}

		// ==========================================
		// 3. VISIBILITY & FOG / HAZE
		// ==========================================
		if (description.includes('fog') || description.includes('freezing fog') || visibility < 1) {
			return {
				title: 'Dense Fog Envelope',
				body: 'Near-zero long-range visibility. Atmospheric moisture saturation obscures distant terrain marks.',
			};
		}

		if (
			description.includes('mist') ||
			description.includes('haze') ||
			description.includes('smoke') ||
			description.includes('dust') ||
			visibility < 5
		) {
			return {
				title: 'Reduced Visibility Zone',
				body: 'Particulate matter or suspended moisture is limiting visual depth and horizon clarity.',
			};
		}

		// ==========================================
		// 4. THERMAL EXTREMES & WIND HAZARDS
		// ==========================================
		if (temp !== 999 && temp <= -20) {
			return {
				title: 'Deep Freeze Environment',
				body: 'Extreme subzero conditions active. Severe air density and rapid thermal depletion in effect.',
			};
		}

		if (temp !== 999 && temp <= 0) {
			return {
				title: 'Subzero Environment',
				body: 'Freezing temperatures dominate surface conditions and slow atmospheric dynamics.',
			};
		}

		if (temp !== 999 && temp >= 32) {
			return {
				title: 'High Thermal Load',
				body: 'Elevated ambient heat creating noticeable thermal shimmer and high heat accumulation.',
			};
		}

		if (gust >= 45 || wind >= 35) {
			return {
				title: 'High Wind Activity',
				body: 'Strong wind forcing is impacting canopy movement, air stability, and surface acoustics.',
			};
		}

		if (wind >= 20) {
			return {
				title: 'Moderate Air Displacement',
				body: 'Consistent breeze active across terrain, maintaining continuous air turnover.',
			};
		}

		// ==========================================
		// 5. CLOUD STRATA & LIGHT PATTERNS
		// ==========================================
		if (description.includes('overcast') || clouds > 85) {
			return {
				title: 'Overcast Layer Present',
				body: 'Dense cloud cover is diffusing sunlight and flattening visual contrast across the horizon.',
			};
		}

		if (description.includes('broken') || (clouds > 50 && clouds <= 85)) {
			return {
				title: 'Heavy Cloud Strata',
				body: 'Dominant cloud formations restricting direct solar radiation to sporadic intervals.',
			};
		}

		if (description.includes('partly') || (clouds > 15 && clouds <= 50)) {
			return {
				title: 'Variable Sky Cover',
				body: 'Broken cloud layers are creating shifting light patterns and moving ground shadows.',
			};
		}

		if (clouds <= 15 || description.includes('clear') || description.includes('sunny')) {
			if (uv >= 7) {
				return {
					title: 'High Solar Irradiation',
					body: 'Unobstructed sky with intense solar output. High ground glare and sharp visual shadows.',
				};
			}
			return {
				title: 'Open Sky Conditions',
				body: 'Minimal cloud cover allows for maximum unobstructed atmospheric observation.',
			};
		}

		// ==========================================
		// 6. AMBIENT & BAROMETRIC SPECIALS
		// ==========================================
		if (pressure <= 995) {
			return {
				title: 'Low Pressure System',
				body: 'Significant barometric depression detected. Dynamic weather change likely approaching.',
			};
		}

		if (humidity >= 85 && temp >= 20) {
			return {
				title: 'Humid Tropical Mass',
				body: 'Dense, moisture-heavy air mass lowering evaporative rates and haze clearance.',
			};
		}

		if (humidity <= 20) {
			return {
				title: 'Arid Atmospheric Condition',
				body: 'Extremely dry air layer supporting high visual clarity and rapid ambient moisture loss.',
			};
		}

		if (temp >= 18 && temp <= 25 && wind < 15) {
			return {
				title: 'Stable Warm Air Mass',
				body: 'Warm, calm air conditions supporting stable and clear field observation.',
			};
		}

		// ==========================================
		// 7. DEFAULT FALLBACK
		// ==========================================
		return {
			title: 'Standard Field Conditions',
			body: 'No significant atmospheric anomalies detected. Conditions remain within typical regional patterns.',
		};
	}
}
