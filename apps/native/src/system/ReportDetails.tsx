import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View, ScrollView} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {formatName, getImageUrl, ImageView, Spinner} from '@northernexplorer/tools-web';
import {ReportReasonEnum, ReportStatusEnum, ReportTypeEnum} from '@northernexplorer/types';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';
import {RenderStars} from '~/location/PointOfInterestDetails/components/RenderStars';
import {ReviewMetadataBadges} from '~/location/PointOfInterestDetails/components/ReviewMetadataBadges';

const REASON_LABELS: Record<ReportReasonEnum, string> = {
	[ReportReasonEnum.Spam]: 'Spam or Commercial',
	[ReportReasonEnum.HateSpeech]: 'Hate Speech or Harassment',
	[ReportReasonEnum.Inappropriate]: 'Inappropriate Content',
	[ReportReasonEnum.NotRelevant]: 'Not Relevant / Off-topic',
	[ReportReasonEnum.Other]: 'Other Issues',
};

export function ReportDetails() {
	const {id} = useLocalSearchParams<{id: string}>();
	const router = useRouter();

	const {data: report, loading, refetch} = useApiFetch('system', 'ReportController', 'getById', {id});

	const {mutate: resolveReport, loading: isResolving} = useApiMutation('system', 'ReportController', 'resolve');
	const {mutate: dismissReport, loading: isDismissing} = useApiMutation('system', 'ReportController', 'dismiss');
	const {mutate: deleteReport, loading: isDeleting} = useApiMutation('system', 'ReportController', 'deleteById');

	if (loading || !report) return <Spinner />;

	const isActionLoading = isResolving || isDismissing || isDeleting;

	const handleDismiss = () => {
		alertStore.showAlert({
			title: 'Dismiss Report',
			message: 'Are you sure you want to dismiss this report? The reported content will remain unchanged.',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Dismiss',
					style: 'default',
					onPress: async () => {
						await dismissReport({id});
						alertStore.showAlert({
							title: 'Success',
							message: 'Report dismissed.',
							type: 'success',
						});
						refetch();
					},
				},
			],
		});
	};

	const handleResolve = (deleteContent: boolean) => {
		alertStore.showAlert({
			title: deleteContent ? 'Resolve & Delete Content' : 'Resolve Report',
			message: deleteContent
				? 'Are you sure you want to resolve this report and permanently delete the reported content?'
				: 'Mark this report as resolved without deleting the content?',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: deleteContent ? 'Delete & Resolve' : 'Resolve',
					style: deleteContent ? 'destructive' : 'default',
					onPress: async () => {
						await resolveReport({id, deleteContent});
						alertStore.showAlert({
							title: 'Success',
							message: deleteContent ? 'Content removed and report resolved.' : 'Report resolved.',
							type: 'success',
						});
						refetch();
					},
				},
			],
		});
	};

	const handleDeleteReport = () => {
		alertStore.showAlert({
			title: 'Delete Report Record',
			message: 'Permanently remove this report record from the database?',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						await deleteReport({id});
						alertStore.showAlert({
							title: 'Success',
							message: 'Report record deleted.',
							type: 'success',
							buttons: [{text: 'OK', onPress: () => router.back()}],
						});
					},
				},
			],
		});
	};

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

	const badge = getStatusBadgeStyle(report.status);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			{/* Back Button */}
			<Pressable style={styles.backButton} onPress={() => router.back()}>
				<Ionicons name="arrow-back" size={18} color="#0284c7" />
				<Text style={styles.backButtonText}>Back to Reports</Text>
			</Pressable>

			{/* Report Meta Card */}
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<View style={styles.typeBadgeRow}>
						<Ionicons
							name={report.type === ReportTypeEnum.Review ? 'chatbox-ellipses-outline' : 'image-outline'}
							size={18}
							color={report.type === ReportTypeEnum.Review ? '#0284c7' : '#7c3aed'}
						/>
						<Text style={styles.cardTitle}>Report: {report.type}</Text>
					</View>
					<View style={[styles.statusBadge, {backgroundColor: badge.backgroundColor}]}>
						<Text style={[styles.statusText, {color: badge.textColor}]}>{report.status}</Text>
					</View>
				</View>

				<View style={styles.grid}>
					<View style={styles.gridItem}>
						<Text style={styles.metaLabel}>Reason</Text>
						<Text style={styles.metaValueHighlight}>{REASON_LABELS[report.reason] || report.reason}</Text>
					</View>
					<View style={styles.gridItem}>
						<Text style={styles.metaLabel}>Reported By</Text>
						<Text style={styles.metaValue}>
							@{report.user.username} ({formatName(report.user)})
						</Text>
					</View>
					<View style={styles.gridItem}>
						<Text style={styles.metaLabel}>Submitted</Text>
						<Text style={styles.metaValue}>{new Date(report.createdAt).toLocaleString()}</Text>
					</View>
					<View style={styles.gridItem}>
						<Text style={styles.metaLabel}>Last Updated</Text>
						<Text style={styles.metaValue}>{new Date(report.updatedAt).toLocaleString()}</Text>
					</View>
				</View>

				{report.description ? (
					<View style={styles.detailsBox}>
						<Text style={styles.detailsLabel}>Reporter Notes:</Text>
						<Text style={styles.detailsText}>{report.description}</Text>
					</View>
				) : null}
			</View>

			{/* Reported Content Card */}
			<View style={styles.card}>
				<Text style={styles.sectionHeader}>Reported Content Details</Text>

				{report.type === ReportTypeEnum.Review && (
					<View>
						{report.review ? (
							<View style={styles.contentBox}>
								<View style={styles.reviewHeader}>
									<View>
										<Text style={styles.authorName}>
											Author: @{report.review.user.username} (Score: {report.review.user.score})
										</Text>
										<Text style={styles.poiName}>POI: {report.review.pointOfInterest.name}</Text>
									</View>
									<RenderStars rating={report.review.rating} />
								</View>

								<View style={styles.badgeRow}>
									<ReviewMetadataBadges
										difficulty={report.review.difficulty}
										entranceCost={report.review.entranceCost}
										conditions={report.review.conditions}
									/>
								</View>

								<Text style={styles.reviewText}>{report.review.description}</Text>
							</View>
						) : (
							<View style={styles.deletedBox}>
								<Ionicons name="alert-circle-outline" size={24} color="#94a3b8" />
								<Text style={styles.deletedText}>This review has already been removed from the database.</Text>
							</View>
						)}
					</View>
				)}

				{report.type === ReportTypeEnum.Image && (
					<View>
						{report.image ? (
							<View style={styles.contentBox}>
								<View style={styles.imageMetaRow}>
									<Text style={styles.authorName}>
										Uploaded by: @{report.image.user.username} (Score: {report.image.user.score})
									</Text>
									<Text style={styles.poiName}>POI: {report.image.pointOfInterest?.name || 'Unknown Location'}</Text>
								</View>

								<View style={styles.imageWrapper}>
									<ImageView
										source={{
											uri: getImageUrl({
												processed: report.image.processed,
												size: 'large',
												path: report.image.url,
												cdn: config.CONTENT_DELIVERY_NETWORK,
											}),
										}}
										style={styles.imagePreview}
										resizeMode="contain"
									/>
								</View>

								{report.image.altText ? <Text style={styles.imageAltText}>Alt: {report.image.altText}</Text> : null}
							</View>
						) : (
							<View style={styles.deletedBox}>
								<Ionicons name="alert-circle-outline" size={24} color="#94a3b8" />
								<Text style={styles.deletedText}>This image has already been removed from the database.</Text>
							</View>
						)}
					</View>
				)}
			</View>

			{/* Moderation Actions Bar */}
			<View style={styles.actionsCard}>
				<Text style={styles.sectionHeader}>Moderation Actions</Text>
				<View style={styles.actionButtonGroup}>
					{report.status === ReportStatusEnum.Pending && (
						<>
							<Pressable
								style={[styles.btn, styles.dismissBtn, isActionLoading && styles.btnDisabled]}
								onPress={handleDismiss}
								disabled={isActionLoading}
							>
								{isDismissing ? (
									<ActivityIndicator size="small" color="#475569" />
								) : (
									<>
										<Ionicons name="close-circle-outline" size={16} color="#475569" />
										<Text style={styles.dismissBtnText}>Dismiss Report</Text>
									</>
								)}
							</Pressable>

							<Pressable
								style={[styles.btn, styles.resolveKeepBtn, isActionLoading && styles.btnDisabled]}
								onPress={() => handleResolve(false)}
								disabled={isActionLoading}
							>
								{isResolving ? (
									<ActivityIndicator size="small" color="#0369a1" />
								) : (
									<>
										<Ionicons name="checkmark-done-outline" size={16} color="#0369a1" />
										<Text style={styles.resolveKeepBtnText}>Resolve (Keep Content)</Text>
									</>
								)}
							</Pressable>

							<Pressable
								style={[styles.btn, styles.resolveDeleteBtn, isActionLoading && styles.btnDisabled]}
								onPress={() => handleResolve(true)}
								disabled={isActionLoading}
							>
								{isResolving ? (
									<ActivityIndicator size="small" color="#ffffff" />
								) : (
									<>
										<Ionicons name="trash-outline" size={16} color="#ffffff" />
										<Text style={styles.resolveDeleteBtnText}>Resolve & Delete Content</Text>
									</>
								)}
							</Pressable>
						</>
					)}

					<Pressable
						style={[styles.btn, styles.deleteReportBtn, isActionLoading && styles.btnDisabled]}
						onPress={handleDeleteReport}
						disabled={isActionLoading}
					>
						{isDeleting ? (
							<ActivityIndicator size="small" color="#ef4444" />
						) : (
							<>
								<Ionicons name="trash-bin-outline" size={16} color="#ef4444" />
								<Text style={styles.deleteReportBtnText}>Delete Report Record</Text>
							</>
						)}
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 40,
		gap: 16,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		alignSelf: 'flex-start',
		marginBottom: 4,
	},
	backButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#0284c7',
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
	},
	actionsCard: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	typeBadgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1e293b',
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	gridItem: {
		minWidth: '45%',
		flex: 1,
	},
	metaLabel: {
		fontSize: 12,
		fontWeight: '500',
		color: '#64748b',
		marginBottom: 2,
	},
	metaValue: {
		fontSize: 14,
		color: '#1e293b',
	},
	metaValueHighlight: {
		fontSize: 14,
		fontWeight: '600',
		color: '#dc2626',
	},
	detailsBox: {
		marginTop: 16,
		padding: 12,
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	detailsLabel: {
		fontSize: 12,
		fontWeight: '600',
		color: '#475569',
		marginBottom: 4,
	},
	detailsText: {
		fontSize: 14,
		color: '#1e293b',
		lineHeight: 20,
	},
	sectionHeader: {
		fontSize: 15,
		fontWeight: '700',
		color: '#1e293b',
		marginBottom: 12,
	},
	contentBox: {
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		padding: 14,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		gap: 8,
	},
	reviewHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	imageMetaRow: {
		marginBottom: 8,
	},
	authorName: {
		fontSize: 13,
		fontWeight: '600',
		color: '#334155',
	},
	poiName: {
		fontSize: 12,
		color: '#64748b',
		marginTop: 2,
	},
	badgeRow: {
		marginVertical: 4,
	},
	reviewText: {
		fontSize: 14,
		color: '#1e293b',
		lineHeight: 20,
	},
	imageWrapper: {
		width: '100%',
		height: 280,
		backgroundColor: '#0f172a',
		borderRadius: 8,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
	},
	imagePreview: {
		width: '100%',
		height: '100%',
	},
	imageAltText: {
		fontSize: 12,
		color: '#64748b',
		fontStyle: 'italic',
	},
	deletedBox: {
		padding: 24,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		gap: 8,
	},
	deletedText: {
		fontSize: 13,
		color: '#64748b',
	},
	actionButtonGroup: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	btn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		justifyContent: 'center',
	},
	btnDisabled: {
		opacity: 0.5,
	},
	dismissBtn: {
		backgroundColor: '#f1f5f9',
		borderWidth: 1,
		borderColor: '#cbd5e1',
	},
	dismissBtnText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#475569',
	},
	resolveKeepBtn: {
		backgroundColor: '#e0f2fe',
		borderWidth: 1,
		borderColor: '#7dd3fc',
	},
	resolveKeepBtnText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#0369a1',
	},
	resolveDeleteBtn: {
		backgroundColor: '#ef4444',
	},
	resolveDeleteBtnText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#ffffff',
	},
	deleteReportBtn: {
		backgroundColor: '#fef2f2',
		borderWidth: 1,
		borderColor: '#fecaca',
	},
	deleteReportBtnText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#ef4444',
	},
});
