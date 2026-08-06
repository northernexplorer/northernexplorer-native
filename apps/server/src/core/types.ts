import {RolesEnum} from '@northernexplorer/types';

export interface AuthContext {
	userId?: string;
	email?: string;
	refreshToken?: string;
	ipAddress: string;
	roles?: RolesEnum[];
}
