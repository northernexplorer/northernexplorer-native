import jwt, {JwtPayload} from 'jsonwebtoken';
import {config} from '../../config';

export interface TokenPayload {
	userId: string;
	email: string;
}

export interface ActivationTokenPayload {
	userId: string;
	email: string;
	purpose: 'account_activation' | 'password_reset';
}

export type RefreshTokenPayload = Pick<TokenPayload, 'userId'> & JwtPayload;

export class TokenService {
	/**
	 * Generates a short-lived access token (expires in 15 minutes)
	 */
	generateAccessToken(payload: TokenPayload): string {
		return jwt.sign(payload, config.ACCESS_SECRET, {
			expiresIn: '10m',
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
	generateToken(payload: Omit<ActivationTokenPayload, 'purpose'>, purpose: 'account_activation' | 'password_reset'): string {
		return jwt.sign({...payload, purpose}, config.ACTIVATION_SECRET, {expiresIn: '24h'});
	}

	/**
	 * Verifies an activation token and returns its typed payload
	 */
	verifyToken(token: string): ActivationTokenPayload {
		const payload = jwt.verify(token, config.ACTIVATION_SECRET) as ActivationTokenPayload;

		if (payload.purpose === 'account_activation') {
			return payload;
		}
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (payload.purpose === 'password_reset') {
			return payload;
		}
		throw new Error('The token is invalid or has expired. Please request a new one.');
	}
}
