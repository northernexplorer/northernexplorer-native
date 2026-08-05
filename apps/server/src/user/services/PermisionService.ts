import {RolesEnum} from '@northernexplorer/types';
import {AuthContext} from '../../index';

export class PermissionService {
	canAccessProfile({targetId}: {targetId: string}, auth?: AuthContext) {
		console.log(auth);
		if (!auth?.userId || !auth.email) throw new Error('You must be logged in to access this resource');
		if (auth.roles?.includes(RolesEnum.Admin)) {
			return {targetId};
		}
		if (auth.userId !== targetId) throw new Error("You don't have permission to view this profile.");

		return {targetId};
	}

	canAccessAdmin(auth?: AuthContext) {
		if (!auth?.userId) throw new Error("You don't have permission to access the admin page.");
		if (!auth.roles || auth.roles.length === 0) throw new Error("You don't have permission to access the admin page.");
		if (!auth.roles.includes(RolesEnum.Admin)) throw new Error("You don't have permission to access the admin page.");

		return {userId: auth.userId};
	}

	isLoggedIn(auth?: AuthContext) {
		if (!auth?.userId || !auth.email) throw new Error('You must be logged in to access this resource');

		return {userId: auth.userId};
	}
}
