import {config} from '../config';

export function getCorsOptions(corsOrigins: string = config.CORS) {
	return {
		origin: corsOrigins.split(',').map(origin => origin.toLowerCase().trim()),
	};
}
