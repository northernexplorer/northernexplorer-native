import {PermissionResponse} from '@northernexplorer/types';

export const getSubscriptionPermissions = (name: string): PermissionResponse => {
	const canAccessRemoteDifficulty = name !== 'Core';
	return {
		navigation: {
			useCompass: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(name),
			useFlashlight: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(name),
			useSignal: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(name),
			changeMapStyle: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(name),
			useOffTrailDifficulty: canAccessRemoteDifficulty,
			useExpeditionDifficulty: canAccessRemoteDifficulty,
			useDistanceScale: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(name),
		},
	};
};
