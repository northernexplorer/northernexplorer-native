import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 Minutes
	max: 150,
	standardHeaders: true,
	legacyHeaders: false,
	message: {error: 'Too many requests, please try again later.'},
});

export const strictAuthLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {error: 'Too many attempts, please try again later.'},
});

export const STRICT_ROUTES: Record<string, string[] | undefined> = {
	UserController: ['login', 'register', 'forgotPassword', 'createNewReview'],
};
