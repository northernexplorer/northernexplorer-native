export class PermissionService {
	/**
	 * Checks if user can access profile
	 */
	canAccessProfile({userId, targetId}: {userId?: number; targetId: string | number}) {
		const parsedTargetId = typeof targetId === 'string' ? parseInt(targetId, 10) : targetId;

		if (!userId || userId !== parsedTargetId) {
			throw new Error("You don't have permission to view this profile.");
		}

		return {targetId: parsedTargetId};
	}
}
