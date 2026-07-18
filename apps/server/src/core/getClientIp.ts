import {Request} from 'express';

export function getClientIp(req: Request): string {
	const doIp = req.headers['do-connecting-ip'];
	if (doIp) return Array.isArray(doIp) ? doIp[0] : doIp;

	const xForwardedFor = req.headers['x-forwarded-for'];
	if (xForwardedFor) {
		const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
		return ips.split(',')[0].trim();
	}

	return (req.socket.remoteAddress || '').replace(/^::ffff:/, '');
}
