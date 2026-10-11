import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Redirect, useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Column, Pagination, Spinner, Table} from '@northernexplorer/tools-web';
import {ReportReasonEnum, ReportStatusEnum, ReportType, ReportTypeEnum, RolesEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

const limit = 20;

const STATUS_FILTERS = [
	{label: 'All', value: undefined},
	{label: 'Pending', value: ReportStatusEnum.Pending},
	{label: 'Resolved', value: ReportStatusEnum.Resolved},
	{label: 'Dismissed', value: ReportStatusEnum.Dismissed},
];

const REASON_LABELS: Record<ReportReasonEnum, string> = {
	[ReportReasonEnum.Spam]: 'Spam',
	[ReportReasonEnum.HateSpeech]: 'Hate Speech',
	[ReportReasonEnum.Inappropriate]: 'Inappropriate',
	[ReportReasonEnum.NotRelevant]: 'Not Relevant',
	[ReportReasonEnum.Other]: 'Other',
};

export function AllReports() {
	const router = useRouter();
	const authentication = useAuthentication();
	const params = useLocalSearchParams<{page?: string}>();
	const page = params.page ? parseInt(params.page, 10) : 1;
	const [statusFilter, setStatusFilter] = useState<ReportStatusEnum | undefined>(undefined);

	const offset = (page - 1) * limit;

	const {data: reports, loading} = useApiFetch('system', 'ReportController', 'getAll', {
		limit,
		offset,
		status: statusFilter,
	});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	const getStatusBadgeStyle = (status: ReportStatusEnum) => {
		switch (status) {
			case ReportStatusEnum.Pending:
				return {backgroundColor: '#fef3c7', textColor: '#d97706'};
			case ReportStatusEnum.Resolved:
				return {backgroundColor: '#dcfce7', textColor: '#15803d'};
			case ReportStatusEnum.Dismissed:
				return {backgroundColor: '#f1f5f9', textColor: '#64748b'};
		}
	};

	const columns: Column<ReportType>[] = [
		{
			key: 'type',
			title: 'Type',
			width: 100,
			render: report => (
				<View style={styles.typeBadge}>
					<Ionicons
						name={report.type === ReportTypeEnum.Review ? 'chatbox-ellipses-outline' : 'image-outline'}
						size={14}
						color={report.type === ReportTypeEnum.Review ? '#0284c7' : '#7c3aed'}
					/>
					<Text style={[styles.typeText, {color: report.type === ReportTypeEnum.Review ? '#0284c7' : '#7c3aed'}]}>{report.type}</Text>
				</View>
			),
		},
		{
			key: 'reason',
			title: 'Reason',
			flex: 2,
			render: report => (
				<View>
					<Text style={styles.reasonText}>{REASON_LABELS[report.reason] || report.reason}</Text>
					{report.description ? (
						<Text style={styles.descriptionText} numberOfLines={1}>
							{report.description}
						</Text>
					) : null}
				</View>
			),
		},
		{
			key: 'target',
			title: 'Reported Content',
			flex: 3,
			render: report => {
				if (report.type === ReportTypeEnum.Review && report.review) {
					return (
						<View>
							<Text style={styles.targetTitle} numberOfLines={1}>
								POI: {report.review.pointOfInterest.name}
							</Text>
							<Text style={styles.targetSubtitle} numberOfLines={1}>
								by @{report.review.user.username}: "{report.review.description}"
							</Text>
						</View>
					);
				}
				if (report.type === ReportTypeEnum.Image && report.image) {
					return (
						<View>
							<Text style={styles.targetTitle} numberOfLines={1}>
								POI: {report.image.pointOfInterest?.name || 'Photo'}
							</Text>
							<Text style={styles.targetSubtitle} numberOfLines={1}>
								by @{report.image.user.username} ({report.image.filename || 'Photo'})
							</Text>
						</View>
					);
				}
				return <Text style={styles.deletedText}>Content no longer available</Text>;
			},
		},
		{
			key: 'user',
			title: 'Reporter',
			flex: 2,
			render: report => (
				<View>
					<Text style={styles.reporterName} numberOfLines={1}>
						@{report.user.username}
					</Text>
					<Text style={styles.dateText}>{new Date(report.createdAt).toLocaleDateString()}</Text>
				</View>
			),
		},
		{
			key: 'status',
			title: 'Status',
			width: 100,
			render: report => {
				const badge = getStatusBadgeStyle(report.status);
				return (
					<View style={[styles.statusBadge, {backgroundColor: badge.backgroundColor}]}>
						<Text style={[styles.statusText, {color: badge.textColor}]}>{report.status}</Text>
					</View>
				);
			},
		},
		{
			key: 'action',
			width: 30,
			align: 'right',
			render: () => <Ionicons name="chevron-forward" size={18} color="#adb5bd" />,
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.filterRow}>
				{STATUS_FILTERS.map(f => {
					const isActive = statusFilter === f.value;
					return (
						<Pressable
							key={f.label}
							style={[styles.filterTab, isActive && styles.filterTabActive]}
							onPress={() => setStatusFilter(f.value)}
						>
							<Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>{f.label}</Text>
						</Pressable>
					);
				})}
			</View>

			<Table
				data={reports}
				columns={columns}
				keyExtractor={report => report.id}
				emptyText="No reports found."
				emptyIcon="flag-outline"
				onRowPress={report => router.push(`/admin/reports/${report.id}`)}
			/>
			<Pagination limit={limit} itemCount={reports?.length || 0} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	filterRow: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 16,
	},
	filterTab: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		borderRadius: 20,
		backgroundColor: '#f1f5f9',
	},
	filterTabActive: {
		backgroundColor: '#0284c7',
	},
	filterTabText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#64748b',
	},
	filterTabTextActive: {
		color: '#ffffff',
	},
	typeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	typeText: {
		fontSize: 12,
		fontWeight: '600',
	},
	reasonText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#1e293b',
	},
	descriptionText: {
		fontSize: 11,
		color: '#64748b',
		marginTop: 2,
	},
	targetTitle: {
		fontSize: 13,
		fontWeight: '600',
		color: '#1e293b',
	},
	targetSubtitle: {
		fontSize: 11,
		color: '#64748b',
		marginTop: 2,
	},
	deletedText: {
		fontSize: 12,
		fontStyle: 'italic',
		color: '#94a3b8',
	},
	reporterName: {
		fontSize: 13,
		fontWeight: '500',
		color: '#334155',
	},
	dateText: {
		fontSize: 11,
		color: '#94a3b8',
		marginTop: 1,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 12,
		alignSelf: 'flex-start',
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
	},
});
