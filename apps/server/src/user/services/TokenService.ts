import jwt from 'jsonwebtoken';
import {config} from '../../config';

export interface TokenPayload {
	userId: number;
	email: string;
}

export interface ActivationTokenPayload {
	userId: number;
	email: string;
	purpose: 'account_activation';
}

export type RefreshTokenPayload = Pick<TokenPayload, 'userId'>;

export class TokenService {
	/**
	 * Generates a short-lived access token (expires in 15 minutes)
	 */
	generateAccessToken(payload: TokenPayload): string {
		return jwt.sign(payload, config.ACCESS_SECRET, {
			expiresIn: '15m',
		});
	}

	/**
	 * Generates a long-lived refresh token (expires in 7 days)
	 */
	generateRefreshToken(payload: Pick<TokenPayload, 'userId'>): string {
		return jwt.sign(payload, config.REFRESH_SECRET, {
			expiresIn: '30d',
		});
	}

	/**
	 * Verifies an access token string and returns its typed payload
	 */
	verifyAccessToken(token: string): TokenPayload {
		return jwt.verify(token, config.ACCESS_SECRET) as TokenPayload;
	}

	/**
	 * Verifies a refresh token string and returns its typed payload
	 */
	verifyRefreshToken(token: string): RefreshTokenPayload {
		return jwt.verify(token, config.REFRESH_SECRET) as RefreshTokenPayload;
	}

	/**
	 * Generates a stateless account activation token (expires in 24 hours)
	 */
	generateActivationToken(payload: Omit<ActivationTokenPayload, 'purpose'>): string {
		return jwt.sign({...payload, purpose: 'account_activation'}, config.ACTIVATION_SECRET, {expiresIn: '24h'});
	}

	/**
	 * Verifies an activation token and returns its typed payload
	 */
	verifyActivationToken(token: string): ActivationTokenPayload {
		const payload = jwt.verify(token, config.ACTIVATION_SECRET) as ActivationTokenPayload;

		if (payload.purpose !== 'account_activation') {
			throw new Error('Invalid token purpose.');
		}

		return payload;
	}
}
