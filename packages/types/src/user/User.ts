export type UserAuthenticationType = {
    userId: number;
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
    acceptTerms: boolean;
    acceptPrivacy: boolean;
    website?: string;
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
    userId: number;
};
export type ChangePasswordParams = {
    userId: number;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};
export type GetByIdParams = {
    id: number;
};
export type GetByIdResponse = {
    id: number;
    version: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    createdAt: Date;
    lastLoginAt?: Date | null;
    isActive: boolean;
    // Note: We intentionally exclude passwordHash here for API security
};
export type RefreshParams = {
    refreshToken: string;
};
