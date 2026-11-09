import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const APP_DIRECTORY = dirname(dirname(fileURLToPath(import.meta.url)));
const APP_CONFIG_PATH = join(APP_DIRECTORY, 'app.json');

function isMissing(value) {
	return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

export function normalizeAndroidFingerprint(value) {
	if (isMissing(value)) {
		return undefined;
	}

	if (typeof value !== 'string') {
		throw new Error('ANDROID_SHA256_CERT_FINGERPRINT must be a 64-character SHA-256 fingerprint, with optional colons.');
	}

	const fingerprint = value.trim();
	if (!/^(?:[\da-fA-F]{64}|(?:[\da-fA-F]{2}:){31}[\da-fA-F]{2})$/.test(fingerprint)) {
		throw new Error('ANDROID_SHA256_CERT_FINGERPRINT must be a 64-character SHA-256 fingerprint, with optional colons.');
	}

	return fingerprint.replaceAll(':', '').toUpperCase().match(/.{2}/g).join(':');
}

export function normalizeAppleAppIdPrefix(value) {
	if (isMissing(value)) {
		return undefined;
	}

	if (typeof value !== 'string') {
		throw new Error('IOS_APP_ID_PREFIX must be a 10-character App ID Prefix.');
	}

	const prefix = value.trim();
	if (!/^[\da-zA-Z]{10}$/.test(prefix)) {
		throw new Error('IOS_APP_ID_PREFIX must be a 10-character App ID Prefix.');
	}

	return prefix.toUpperCase();
}

export function createAssociationFiles({androidFingerprint, appleAppIdPrefix, androidPackageName, iosBundleIdentifier}) {
	const fingerprint = normalizeAndroidFingerprint(androidFingerprint);
	const appIdPrefix = normalizeAppleAppIdPrefix(appleAppIdPrefix);
	const files = new Map();
	const warnings = [];

	if (fingerprint) {
		files.set(
			'assetlinks.json',
			`${JSON.stringify(
				[
					{
						relation: ['delegate_permission/common.handle_all_urls'],
						target: {
							namespace: 'android_app',
							package_name: androidPackageName,
							sha256_cert_fingerprints: [fingerprint],
						},
					},
				],
				null,
				2,
			)}\n`,
		);
	} else {
		warnings.push('ANDROID_SHA256_CERT_FINGERPRINT is not set; skipping Android assetlinks.json.');
	}

	if (appIdPrefix) {
		files.set(
			'apple-app-site-association',
			`${JSON.stringify(
				{
					applinks: {
						apps: [],
						details: [
							{
								appID: `${appIdPrefix}.${iosBundleIdentifier}`,
								paths: ['*'],
							},
						],
					},
				},
				null,
				2,
			)}\n`,
		);
	} else {
		warnings.push('IOS_APP_ID_PREFIX is not set; skipping apple-app-site-association.');
	}

	return {files, warnings};
}

export async function writeAssociationFiles(outputDirectory, files) {
	if (files.size === 0) {
		return;
	}

	const associationDirectory = join(outputDirectory, '.well-known');
	await mkdir(associationDirectory, {recursive: true});
	await Promise.all([...files].map(([fileName, contents]) => writeFile(join(associationDirectory, fileName), contents)));
}

async function generateAppLinks() {
	const appConfig = JSON.parse(await readFile(APP_CONFIG_PATH, 'utf8')).expo;
	const {files, warnings} = createAssociationFiles({
		androidFingerprint: process.env.ANDROID_SHA256_CERT_FINGERPRINT,
		appleAppIdPrefix: process.env.IOS_APP_ID_PREFIX,
		androidPackageName: appConfig.android.package,
		iosBundleIdentifier: appConfig.ios.bundleIdentifier,
	});

	warnings.forEach(warning => console.warn(`[app-links] ${warning}`));
	await writeAssociationFiles(join(APP_DIRECTORY, 'dist'), files);
	if (files.size > 0) {
		console.info(`[app-links] Generated ${[...files.keys()].join(' and ')} in dist/.well-known.`);
	}
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
	await generateAppLinks();
}
