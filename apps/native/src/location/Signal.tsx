import React, {ComponentProps, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import NetInfo, {NetInfoStateType, NetInfoState} from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import {ProFeatureOnly, Spinner} from '@northernexplorer/tools';
import {useApiFetch} from '~/core/useApiFetch';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface StatusItem {
	title: string;
	subtitle: string;
	value: string;
	icon: IconName;
	color: string;
}

export function Signal() {
	const isWeb = Platform.OS === 'web';

	const [networkState, setNetworkState] = useState<NetInfoState | null>(null);
	const [locationCoords, setLocationCoords] = useState<Location.LocationObjectCoords | null>(null);
	const [permissionGranted, setPermissionGranted] = useState<boolean>(true);

	const {data: permissionData, loading} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});
	const canUseSignal = !!permissionData?.navigation.useSignal;

	useEffect(() => {
		if (isWeb) return;

		const unsubscribeNet = NetInfo.addEventListener(state => {
			setNetworkState(state);
		});

		let locationSubscription: Location.LocationSubscription | null = null;

		(async () => {
			const {status} = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setPermissionGranted(false);
				return;
			}

			locationSubscription = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.High,
					timeInterval: 3000,
					distanceInterval: 1,
				},
				loc => {
					setLocationCoords(loc.coords);
				},
			);
		})();

		return () => {
			unsubscribeNet();
			locationSubscription?.remove();
		};
	}, [isWeb]);

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<Spinner />
				</View>
			</SafeAreaView>
		);
	}

	if (!canUseSignal) return <ProFeatureOnly />;

	if (isWeb) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<MaterialCommunityIcons name="signal-off" size={72} color="#64748b" />
					<Text style={styles.unavailableTitle}>Signal Diagnostics Unavailable</Text>
					<Text style={styles.unavailableSubtext}>
						Cellular network metrics, Wi-Fi status, and satellite diagnostics are not supported on web browsers.
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const getGpsMetrics = (coords: Location.LocationObjectCoords | null): StatusItem => {
		if (!permissionGranted) {
			return {
				title: 'GPS Status',
				subtitle: 'Location Permission Denied',
				value: 'No Access',
				icon: 'signal-off',
				color: '#dc2626',
			};
		}

		if (!coords) {
			return {
				title: 'GPS Status',
				subtitle: 'Acquiring satellite fix...',
				value: 'Searching',
				icon: 'satellite-variant',
				color: '#d97706',
			};
		}

		const accuracy = coords.accuracy ?? 999;
		if (accuracy <= 10) {
			return {
				title: 'GPS Accuracy',
				subtitle: `High Precision Fix (±${Math.round(accuracy)}m)`,
				value: 'Strong',
				icon: 'satellite-uplink',
				color: '#16a34a',
			};
		}
		if (accuracy <= 35) {
			return {
				title: 'GPS Accuracy',
				subtitle: `Moderate Precision Fix (±${Math.round(accuracy)}m)`,
				value: 'Moderate',
				icon: 'satellite-uplink',
				color: '#d97706',
			};
		}
		return {
			title: 'GPS Accuracy',
			subtitle: `Low Precision Fix (±${Math.round(accuracy)}m)`,
			value: 'Weak',
			icon: 'signal-off',
			color: '#dc2626',
		};
	};

	const getCellMetrics = (): StatusItem => {
		if (networkState?.type === NetInfoStateType.cellular) {
			const details = networkState.details as {cellularGeneration?: string; carrier?: string} | null;
			const gen = details?.cellularGeneration ? details.cellularGeneration.toUpperCase() : 'Active';
			const carrier = details?.carrier ? `Carrier: ${details.carrier}` : 'Cellular Connection Active';

			return {
				title: 'Cellular Network',
				subtitle: carrier,
				value: gen,
				icon: 'signal-cellular-3',
				color: '#16a34a',
			};
		}

		return {
			title: 'Cellular Network',
			subtitle: 'No cellular connection detected',
			value: 'No Cell',
			icon: 'signal-cellular-outline',
			color: '#dc2626',
		};
	};

	const getWifiMetrics = (): StatusItem => {
		if (networkState?.type === NetInfoStateType.wifi) {
			const details = networkState.details as {ssid?: string; ipAddress?: string} | null;
			const ssidLabel = details?.ssid ? `SSID: ${details.ssid}` : 'Connected to Wi-Fi Network';

			return {
				title: 'Wi-Fi Network',
				subtitle: ssidLabel,
				value: 'Connected',
				icon: 'wifi',
				color: '#16a34a',
			};
		}

		return {
			title: 'Wi-Fi Network',
			subtitle: 'Wi-Fi interface disconnected or inactive',
			value: 'Disabled',
			icon: 'wifi-off',
			color: '#64748b',
		};
	};

	const gpsMetrics = getGpsMetrics(locationCoords);
	const cellMetrics = getCellMetrics();
	const wifiMetrics = getWifiMetrics();

	const isCellInternet = networkState?.type === NetInfoStateType.cellular && networkState.isInternetReachable;
	const isWifiInternet = networkState?.type === NetInfoStateType.wifi && networkState.isInternetReachable;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* Cellular Card */}
				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<View style={[styles.iconWrapper, {backgroundColor: `${cellMetrics.color}1E`}]}>
							<MaterialCommunityIcons name={cellMetrics.icon} size={30} color={cellMetrics.color} />
						</View>
						<View style={styles.cardHeaderText}>
							<Text style={styles.cardTitle}>{cellMetrics.title}</Text>
							<Text style={styles.cardSubtitle}>{cellMetrics.subtitle}</Text>
						</View>
						<View style={[styles.statusBadge, {borderColor: cellMetrics.color}]}>
							<Text style={[styles.statusBadgeText, {color: cellMetrics.color}]}>{cellMetrics.value}</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.row}>
						<Text style={styles.rowLabel}>Active Network Type</Text>
						<Text style={styles.rowValue}>{networkState?.type === NetInfoStateType.cellular ? 'Cellular' : 'Inactive'}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.rowLabel}>Internet Accessible</Text>
						<Text style={[styles.rowValue, {color: isCellInternet ? '#16a34a' : '#dc2626'}]}>{isCellInternet ? 'Yes' : 'No'}</Text>
					</View>
				</View>

				{/* Wi-Fi Card */}
				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<View style={[styles.iconWrapper, {backgroundColor: `${wifiMetrics.color}1E`}]}>
							<MaterialCommunityIcons name={wifiMetrics.icon} size={30} color={wifiMetrics.color} />
						</View>
						<View style={styles.cardHeaderText}>
							<Text style={styles.cardTitle}>{wifiMetrics.title}</Text>
							<Text style={styles.cardSubtitle}>{wifiMetrics.subtitle}</Text>
						</View>
						<View style={[styles.statusBadge, {borderColor: wifiMetrics.color}]}>
							<Text style={[styles.statusBadgeText, {color: wifiMetrics.color}]}>{wifiMetrics.value}</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.row}>
						<Text style={styles.rowLabel}>IP Address</Text>
						<Text style={styles.rowValue}>{(networkState?.details as {ipAddress?: string}).ipAddress ?? 'N/A'}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.rowLabel}>Internet Accessible</Text>
						<Text style={[styles.rowValue, {color: isWifiInternet ? '#16a34a' : '#dc2626'}]}>{isWifiInternet ? 'Yes' : 'No'}</Text>
					</View>
				</View>

				{/* GPS Card */}
				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<View style={[styles.iconWrapper, {backgroundColor: `${gpsMetrics.color}1E`}]}>
							<MaterialCommunityIcons name={gpsMetrics.icon} size={30} color={gpsMetrics.color} />
						</View>
						<View style={styles.cardHeaderText}>
							<Text style={styles.cardTitle}>{gpsMetrics.title}</Text>
							<Text style={styles.cardSubtitle}>{gpsMetrics.subtitle}</Text>
						</View>
						<View style={[styles.statusBadge, {borderColor: gpsMetrics.color}]}>
							<Text style={[styles.statusBadgeText, {color: gpsMetrics.color}]}>{gpsMetrics.value}</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.row}>
						<Text style={styles.rowLabel}>Estimated Margin Error</Text>
						<Text style={styles.rowValue}>
							{locationCoords?.accuracy != null ? `±${locationCoords.accuracy.toFixed(1)} meters` : 'N/A'}
						</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.rowLabel}>Altitude</Text>
						<Text style={styles.rowValue}>
							{locationCoords?.altitude != null ? `${Math.round(locationCoords.altitude)}m AMSL` : 'N/A'}
						</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.rowLabel}>Heading Speed</Text>
						<Text style={styles.rowValue}>
							{locationCoords?.speed != null ? `${(locationCoords.speed * 3.6).toFixed(1)} km/h` : '0.0 km/h'}
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	header: {
		marginBottom: 20,
	},
	headerTitle: {
		color: '#0f172a',
		fontSize: 28,
		fontWeight: '800',
		letterSpacing: -0.5,
	},
	headerSub: {
		color: '#475569',
		fontSize: 14,
		marginTop: 2,
		fontWeight: '500',
	},
	centerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	unavailableTitle: {
		color: '#0f172a',
		fontSize: 20,
		fontWeight: '700',
		marginTop: 16,
	},
	unavailableSubtext: {
		color: '#64748b',
		fontSize: 14,
		marginTop: 8,
		textAlign: 'center',
		maxWidth: 280,
	},
	card: {
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(0, 0, 0, 0.05)',
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconWrapper: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cardHeaderText: {
		flex: 1,
		marginLeft: 12,
	},
	cardTitle: {
		color: '#0f172a',
		fontSize: 16,
		fontWeight: '700',
	},
	cardSubtitle: {
		color: '#64748b',
		fontSize: 12,
		marginTop: 2,
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		borderWidth: 1,
	},
	statusBadgeText: {
		fontSize: 11,
		fontWeight: '700',
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		marginVertical: 14,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4,
	},
	rowLabel: {
		color: '#64748b',
		fontSize: 13,
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	rowValue: {
		color: '#0f172a',
		fontSize: 13,
		fontWeight: '700',
	},
});
