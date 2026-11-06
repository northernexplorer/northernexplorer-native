import {Context, Reader, isActionsAssertion} from '@contentauth/c2pa-node';

const AI_GENERATED_SOURCE = 'trainedAlgorithmicMedia';
const context = new Context({
	verify: {
		verifyAfterReading: true,
		verifyTrust: true,
		remoteManifestFetch: false,
		ocspFetch: false,
	},
});

export async function detectAIGeneratedImage(buffer: Buffer, mimeType?: string): Promise<boolean> {
	const reader = await Reader.fromAsset({buffer, mimeType}, context);
	if (!reader) return false;

	const store = reader.json();
	if (store.validation_state !== 'Valid' && store.validation_state !== 'Trusted') return false;
	const manifest = store.active_manifest ? store.manifests?.[store.active_manifest] : undefined;

	return (
		manifest?.assertions?.some(
			assertion =>
				isActionsAssertion(assertion) &&
				assertion.data.actions.some(
					(action: unknown) =>
						typeof action === 'object' &&
						action !== null &&
						'action' in action &&
						action.action === 'c2pa.created' &&
						'digitalSourceType' in action &&
						typeof action.digitalSourceType === 'string' &&
						action.digitalSourceType.split('/').pop() === AI_GENERATED_SOURCE,
				),
		) ?? false
	);
}
