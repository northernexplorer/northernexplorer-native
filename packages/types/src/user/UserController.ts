import {GenericResponseType} from '../GenericResponseType';

export type UserAuthenticationType = {
	userId: string;
	email: string;
	username: string;
	accessToken: string;
	refreshToken: string;
};
type RegisterParams = {
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

type ActivateParams = {
	activationToken: string;
	device: Device;
};
type LoginParams = {
	login: Login;
	device: Device;
};
type LogoutParams = {
	refreshToken: string;
};
type Login = {
	identifier: string;
	password: string;
};
type Device = {
	osName: string;
	clientName: string;
	platform: string;
};
type ForgotPasswordParams = {
	email: string;
};
export type EditProfileParams = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	userId: string;
};
type ChangePasswordParams = {
	username: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};
type ResetPasswordParams = {
	token: string;
	newPassword: string;
	confirmPassword: string;
};
type GetByUsernameParams = {
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
	isActive: boolean;
	// Note: We intentionally exclude passwordHash here for API security
};
type RefreshParams = {
	refreshToken: string;
};

type DeleteUserParams = {
	username: string;
};

export const UserController = {
	register: {
		params: {} as RegisterParams,
		response: {success: true} as GenericResponseType,
	},
	login: {
		params: {} as LoginParams,
		response: {} as UserAuthenticationType,
	},
	logout: {
		params: {} as LogoutParams,
		response: {} as GenericResponseType,
	},
	forgotPassword: {
		params: {} as ForgotPasswordParams,
		response: {success: true} as GenericResponseType,
	},
	editProfile: {
		params: {} as EditProfileParams,
		response: {success: true} as GenericResponseType,
	},
	changePassword: {
		params: {} as ChangePasswordParams,
		response: {success: true} as GenericResponseType,
	},
	getByUsername: {
		params: {} as GetByUsernameParams,
		response: {} as GetByUsernameResponse,
	},
	refresh: {
		params: {} as RefreshParams,
		response: {} as UserAuthenticationType,
	},
	activate: {
		params: {} as ActivateParams,
		response: {} as UserAuthenticationType,
	},
	resetPassword: {
		params: {} as ResetPasswordParams,
		response: {} as GenericResponseType,
	},
	deleteUser: {
		params: {} as DeleteUserParams,
		response: {} as GenericResponseType,
	},
};
