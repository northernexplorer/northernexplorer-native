export type UserAuthenticationType = {
    userId: string;
    email: string;
    username: string;
    accessToken: string;
    refreshToken: string;
};

export type RegisterParams = {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: false;
    acceptPrivacy: false;
};
export type LoginParams = {
    identifier: string;
    password: string;
};
export type ForgotPasswordParams = {
    email: string;
};
export type EditProfileParams = {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    userId: string;
};
export type ChangePasswordParams = {
    userId: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};
export type GetByIdParams = {
    id: number;
};
