export class PermissionService {
	/**
	 * Checks if user can access profile
	 */
	canAccessProfile({userId, targetId}: {userId?: string; targetId: string | number}) {
		if (!userId || userId !== targetId) {
			throw new Error("You don't have permission to view this profile.");
		}

		return {targetId};
	}
}
