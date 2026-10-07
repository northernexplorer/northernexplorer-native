import React, {useState} from 'react';
import {ActivityIndicator, Modal, Pressable, StyleSheet, Text, View, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {TextAreaField} from '@northernexplorer/tools-web';
import {ReportReasonEnum, ReportTypeEnum} from '@northernexplorer/types';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type ReportModalProps = {
	visible: boolean;
	type: ReportTypeEnum;
	targetId: string;
	onClose: () => void;
	onSuccess?: () => void;
};

const REASONS: {key: ReportReasonEnum; label: string; description: string}[] = [
	{
		key: ReportReasonEnum.Spam,
		label: 'Spam or Commercial',
		description: 'Unsolicited advertising, scams, or repetitive promotional content.',
	},
	{
		key: ReportReasonEnum.HateSpeech,
		label: 'Hate Speech or Harassment',
		description: 'Offensive language, discrimination, personal attacks, or threats.',
	},
	{
		key: ReportReasonEnum.Inappropriate,
		label: 'Inappropriate Content',
		description: 'Sexually explicit, violent, illegal, or otherwise offensive material.',
	},
	{
		key: ReportReasonEnum.NotRelevant,
		label: 'Not Relevant / Off-topic',
		description: 'Content is unrelated to this location or misleading.',
	},
	{
		key: ReportReasonEnum.Other,
		label: 'Other Issues',
		description: 'Any other concern not listed above.',
	},
];

export function ReportModal({visible, type, targetId, onClose, onSuccess}: ReportModalProps) {
	const authentication = useAuthentication();
	const [selectedReason, setSelectedReason] = useState<ReportReasonEnum>(ReportReasonEnum.Spam);
	const [description, setDescription] = useState<string>('');
	const {mutate: reportMutation, loading} = useApiMutation('system', 'ReportController', 'create');

	const handleSubmit = async () => {
		if (!authentication) {
			alertStore.showAlert({
				title: 'Sign In Required',
				message: 'Please sign in to submit a report.',
				type: 'warning',
			});
			return;
		}

		try {
			await reportMutation({
				type,
				reason: selectedReason,
				description: description.trim() || undefined,
				reviewId: type === ReportTypeEnum.Review ? targetId : undefined,
				imageId: type === ReportTypeEnum.Image ? targetId : undefined,
			});

			alertStore.showAlert({
				title: 'Report Submitted',
				message: 'Thank you for reporting this content. Our moderation team will review it shortly.',
				type: 'success',
			});

			setDescription('');
			setSelectedReason(ReportReasonEnum.Spam);
			onClose();
			onSuccess?.();
		} catch (error: unknown) {
			alertStore.showAlert({
				title: 'Error',
				message: error instanceof Error ? error.message : 'Failed to submit report. Please try again.',
				type: 'error',
			});
		}
	};

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View style={styles.overlay}>
				<Pressable style={styles.backdrop} onPress={onClose} />
				<View style={styles.modalContent}>
					<View style={styles.header}>
						<View style={styles.headerTitleRow}>
							<Ionicons name="flag-outline" size={20} color="#ef4444" />
							<Text style={styles.title}>Report {type}</Text>
						</View>
						<Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
							<Ionicons name="close" size={22} color="#64748b" />
						</Pressable>
					</View>

					<ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
						<Text style={styles.subtitle}>Why are you reporting this {type.toLowerCase()}? Please select a reason below.</Text>

						<View style={styles.reasonsList}>
							{REASONS.map(item => {
								const isSelected = selectedReason === item.key;
								return (
									<Pressable
										key={item.key}
										style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
										onPress={() => setSelectedReason(item.key)}
									>
										<View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
											{isSelected && <View style={styles.radioInner} />}
										</View>
										<View style={styles.reasonTextContainer}>
											<Text style={[styles.reasonLabel, isSelected && styles.reasonLabelSelected]}>{item.label}</Text>
											<Text style={styles.reasonDescription}>{item.description}</Text>
										</View>
									</Pressable>
								);
							})}
						</View>

						<View style={styles.detailsContainer}>
							<TextAreaField
								fieldName="description"
								label="Additional Details (Optional)"
								placeholder="Provide any additional context or details..."
								value={description}
								updateField={(_, val) => setDescription(val)}
								numberOfLines={3}
								loading={loading}
							/>
						</View>
					</ScrollView>

					<View style={styles.footer}>
						<Pressable style={styles.cancelButton} onPress={onClose} disabled={loading}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</Pressable>
						<Pressable style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={loading}>
							{loading ? (
								<ActivityIndicator size="small" color="#ffffff" />
							) : (
								<Text style={styles.submitButtonText}>Submit Report</Text>
							)}
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	backdrop: {
		...StyleSheet.absoluteFill,
	},
	modalContent: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		width: '100%',
		maxWidth: 520,
		maxHeight: '90%',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 5,
		overflow: 'hidden',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	headerTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1e293b',
	},
	closeBtn: {
		padding: 4,
	},
	body: {
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	subtitle: {
		fontSize: 14,
		color: '#64748b',
		marginBottom: 16,
		lineHeight: 20,
	},
	reasonsList: {
		gap: 10,
		marginBottom: 16,
	},
	reasonOption: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		backgroundColor: '#f8fafc',
		gap: 12,
	},
	reasonOptionSelected: {
		borderColor: '#0284c7',
		backgroundColor: '#f0f9ff',
	},
	radioCircle: {
		width: 18,
		height: 18,
		borderRadius: 9,
		borderWidth: 2,
		borderColor: '#94a3b8',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 2,
	},
	radioCircleSelected: {
		borderColor: '#0284c7',
	},
	radioInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#0284c7',
	},
	reasonTextContainer: {
		flex: 1,
	},
	reasonLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1e293b',
		marginBottom: 2,
	},
	reasonLabelSelected: {
		color: '#0369a1',
	},
	reasonDescription: {
		fontSize: 12,
		color: '#64748b',
		lineHeight: 16,
	},
	detailsContainer: {
		marginTop: 4,
		marginBottom: 12,
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: 12,
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: '#f1f5f9',
		backgroundColor: '#f8fafc',
	},
	cancelButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	cancelButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#64748b',
	},
	submitButton: {
		backgroundColor: '#ef4444',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 120,
	},
	submitButtonDisabled: {
		opacity: 0.6,
	},
	submitButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#ffffff',
	},
});
