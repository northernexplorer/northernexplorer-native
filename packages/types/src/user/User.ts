export type UserAuthenticationType = {
	userid: string;
	email: string;
	username: string;
	accessToken: string;
	refreshToken: string;
};
export type RegisterParams = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	acceptTerms: boolean;
	acceptPrivacy: boolean;
	website?: string;
};

export type ActivateParams = {
	activationToken: string;
	device: Device;
};
export type LoginParams = {
	login: Login;
	device: Device;
};
export type LogoutParams = {
	refreshToken: string;
};
export type Login = {
	identifier: string;
	password: string;
};
export type Device = {
	osName: string;
	clientName: string;
	platform: string;
};
export type ForgotPasswordParams = {
	email: string;
};
export type EditProfileParams = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	userid: string;
};
export type ChangePasswordParams = {
	username: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};
export type ResetPasswordParams = {
	token: string;
	newPassword: string;
	confirmPassword: string;
};
export type GetByUsernameParams = {
	username: string;
};
export type GetByUsernameResponse = {
	id: string;
	version: number;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	createdAt: Date;
	lastLoginAt?: Date | null;
	isActive: boolean;
	// Note: We intentionally exclude passwordHash here for API security
};
export type RefreshParams = {
	refreshToken: string;
};
