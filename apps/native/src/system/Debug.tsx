import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Redirect} from 'expo-router';
import {RolesEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {config} from '~/config';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

const webEnvironmentVariables = [
	{name: 'EXPO_PUBLIC_SERVER_URL_WEB', value: process.env.EXPO_PUBLIC_SERVER_URL_WEB},
	{name: 'EXPO_PUBLIC_SERVER_URL_APP', value: process.env.EXPO_PUBLIC_SERVER_URL_APP},
	{name: 'EXPO_PUBLIC_REVENUE_IOS_KEY', value: process.env.EXPO_PUBLIC_REVENUE_IOS_KEY},
	{name: 'EXPO_PUBLIC_REVENUE_ANDROID_KEY', value: process.env.EXPO_PUBLIC_REVENUE_ANDROID_KEY},
	{name: 'EXPO_PUBLIC_ARCGIS_API_KEY', value: process.env.EXPO_PUBLIC_ARCGIS_API_KEY},
	{name: 'EXPO_PUBLIC_CONTENT_DELIVERY_NETWORK', value: process.env.EXPO_PUBLIC_CONTENT_DELIVERY_NETWORK},
	{name: 'EXPO_PUBLIC_APTABASE_KEY', value: process.env.EXPO_PUBLIC_APTABASE_KEY},
];

export function Debug() {
	const authentication = useAuthentication();
	const {isOffline} = useIsOffline();
	const {data, loading, error} = useApiFetch('system', 'StatusController', 'getDebugInfo', {});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;

	const diagnosticsUnavailable = isOffline || !!error;

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Server Information</Text>
				{diagnosticsUnavailable ? (
					<Text style={styles.unavailableText}>Server diagnostics are unavailable{isOffline ? ' while offline' : ''}.</Text>
				) : loading || !data ? (
					<View style={styles.loadingRow}>
						<ActivityIndicator size="small" color="#0088cc" />
						<Text style={styles.valueText}>Loading current server information…</Text>
					</View>
				) : (
					<>
						<InfoRow label="Node.js" value={data.nodeVersion} />
						<InfoRow label="Platform" value={data.platform} />
						<InfoRow label="Uptime" value={`${data.uptimeSeconds.toLocaleString()} seconds`} />
						<InfoRow label="Resident memory" value={`${(data.memoryUsageBytes / 1024 / 1024).toFixed(1)} MB`} />
						<InfoRow label="Checked at" value={new Date(data.checkedAt).toLocaleString()} />
					</>
				)}
				<InfoRow label="Effective server URL" value={config.SERVER_URL} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Web Environment Variables</Text>
				<Text style={styles.note}>These EXPO_PUBLIC values are bundled into the web app and are visible to its users.</Text>
				{webEnvironmentVariables.map(variable => (
					<InfoRow key={variable.name} label={variable.name} value={variable.value?.trim() || 'Not set'} />
				))}
			</View>
		</ScrollView>
	);
}

function InfoRow({label, value}: {label: string; value: string}) {
	return (
		<View style={styles.infoRow}>
			<Text style={styles.labelText}>{label}</Text>
			<Text selectable style={styles.valueText}>
				{value}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 16,
		paddingBottom: 24,
	},
	section: {
		backgroundColor: '#ffffff',
		borderColor: '#e9ecef',
		borderRadius: 12,
		borderWidth: 1,
		padding: 16,
		gap: 12,
	},
	sectionTitle: {
		color: '#212529',
		fontSize: 18,
		fontWeight: '700',
	},
	note: {
		color: '#6c757d',
		fontSize: 13,
	},
	infoRow: {
		gap: 4,
		borderTopColor: '#f1f3f5',
		borderTopWidth: 1,
		paddingTop: 10,
	},
	labelText: {
		color: '#6c757d',
		fontSize: 12,
		fontWeight: '600',
	},
	valueText: {
		color: '#212529',
		fontSize: 14,
		fontWeight: '500',
	},
	unavailableText: {
		color: '#b45309',
		fontSize: 14,
	},
	loadingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
});
