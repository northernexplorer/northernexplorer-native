import jwt from 'jsonwebtoken';
import { config } from '../../config';

export interface TokenPayload {
    userId: number;
    email: string;
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
            expiresIn: '7d',
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
}
