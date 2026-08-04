import {RolesEnum} from '@northernexplorer/types';

export class PermissionService {
	canAccessProfile({userId, targetId}: {userId?: string; targetId: string | number}) {
		if (!userId || userId !== targetId) throw new Error("You don't have permission to view this profile.");

		return {targetId};
	}

	canAccessAdmin({userId, roles}: {userId?: string; roles?: RolesEnum[]}) {
		if (!userId) throw new Error("You don't have permission to access the admin page.");
		if (!roles || roles.length === 0) throw new Error("You don't have permission to access the admin page.");
		if (!roles.includes(RolesEnum.Admin)) throw new Error("You don't have permission to access the admin page.");

		return {userId};
	}
}
