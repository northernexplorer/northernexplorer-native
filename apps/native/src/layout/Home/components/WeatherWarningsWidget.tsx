import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {WeatherWarningType} from '@northernexplorer/types';

interface WeatherWarningsWidgetProps {
	warnings?: WeatherWarningType[];
}

function formatExpiryTime(expiresStr?: string): string {
	if (!expiresStr) return 'Active until cancelled';
	try {
		const date = new Date(expiresStr);
		if (isNaN(date.getTime())) return expiresStr;
		return date.toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			timeZoneName: 'short',
		});
	} catch {
		return expiresStr;
	}
}

function getSeverityColor(severity?: string): {border: string; bg: string; text: string; icon: string} {
	const s = (severity || '').toLowerCase();
	if (s.includes('extreme') || s.includes('critical') || s.includes('tornado') || s.includes('hurricane')) {
		return {
			border: 'rgba(239, 68, 68, 0.4)',
			bg: 'rgba(239, 68, 68, 0.12)',
			text: '#F87171',
			icon: '#EF4444',
		};
	}
	if (s.includes('severe') || s.includes('danger')) {
		return {
			border: 'rgba(249, 115, 22, 0.4)',
			bg: 'rgba(249, 115, 22, 0.12)',
			text: '#FB923C',
			icon: '#F97316',
		};
	}
	if (s.includes('moderate') || s.includes('warning') || s.includes('advisory')) {
		return {
			border: 'rgba(245, 158, 11, 0.4)',
			bg: 'rgba(245, 158, 11, 0.12)',
			text: '#FCD34D',
			icon: '#F59E0B',
		};
	}
	return {
		border: 'rgba(56, 189, 248, 0.4)',
		bg: 'rgba(56, 189, 248, 0.12)',
		text: '#7DD3FC',
		icon: '#38BDF8',
	};
}

export function WeatherWarningsWidget({warnings}: WeatherWarningsWidgetProps) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	const activeWarnings = useMemo(() => {
		if (!Array.isArray(warnings)) return [];
		return warnings.filter(w => !w.expires || new Date(w.expires).getTime() > Date.now());
	}, [warnings]);

	if (activeWarnings.length === 0) {
		return null;
	}

	const toggleExpand = (index: number) => {
		setExpandedIndex(prev => (prev === index ? null : index));
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.titleRow}>
					<MaterialCommunityIcons name="alert-decagram" size={18} color="#EF4444" />
					<Text style={styles.headerSubtitle}>ACTIVE WEATHER WARNINGS ({activeWarnings.length})</Text>
				</View>
			</View>

			<View style={styles.warningsList}>
				{activeWarnings.map((warning, index) => {
					const colors = getSeverityColor(warning.severity);
					const isExpanded = expandedIndex === index;

					return (
						<View
							key={`${warning.event}-${warning.effective}-${index}`}
							style={[styles.warningCard, {borderColor: colors.border, backgroundColor: colors.bg}]}
						>
							<View style={styles.cardHeader}>
								<View style={styles.headlineRow}>
									<View style={styles.eventInfo}>
										<Text style={[styles.eventName, {color: colors.text}]}>
											{warning.event || warning.headline || 'Weather Alert'}
										</Text>
										{warning.headline && warning.headline !== warning.event && (
											<Text style={styles.headlineText} numberOfLines={isExpanded ? undefined : 2}>
												{warning.headline}
											</Text>
										)}
									</View>

									{warning.severity && (
										<View style={[styles.severityBadge, {borderColor: colors.border}]}>
											<Text style={[styles.severityText, {color: colors.text}]}>{warning.severity.toUpperCase()}</Text>
										</View>
									)}
								</View>

								<View style={styles.metaRow}>
									<View style={styles.metaItem}>
										<MaterialCommunityIcons name="clock-outline" size={13} color={colors.text} />
										<Text style={[styles.metaText, {color: colors.text}]}>Expires: {formatExpiryTime(warning.expires)}</Text>
									</View>
									{warning.areas ? (
										<View style={styles.metaItem}>
											<MaterialCommunityIcons name="map-marker-outline" size={13} color="rgba(255, 255, 255, 0.7)" />
											<Text style={styles.metaText} numberOfLines={1}>
												{warning.areas}
											</Text>
										</View>
									) : null}
								</View>
							</View>

							{/* Detailed Information (Collapsible) */}
							{(warning.desc || warning.instruction) && (
								<View style={styles.detailsContainer}>
									{isExpanded && (
										<View style={styles.expandedContent}>
											{warning.desc ? (
												<View style={styles.detailSection}>
													<Text style={styles.detailLabel}>Description</Text>
													<Text style={styles.detailBody}>{warning.desc}</Text>
												</View>
											) : null}

											{warning.instruction ? (
												<View style={styles.detailSection}>
													<Text style={styles.detailLabel}>Instructions / Action Required</Text>
													<Text style={styles.detailBody}>{warning.instruction}</Text>
												</View>
											) : null}
										</View>
									)}

									<Pressable style={styles.expandButton} onPress={() => toggleExpand(index)}>
										<Text style={[styles.expandButtonText, {color: colors.text}]}>
											{isExpanded ? 'Show Less' : 'View Full Alert Details'}
										</Text>
										<MaterialCommunityIcons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.text} />
									</Pressable>
								</View>
							)}
						</View>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 4,
	},
	header: {
		marginBottom: 8,
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	headerSubtitle: {
		color: '#EF4444',
		fontSize: 11,
		fontWeight: '800',
		letterSpacing: 1.2,
	},
	warningsList: {
		gap: 10,
	},
	warningCard: {
		borderRadius: 12,
		borderWidth: 1,
		padding: 14,
		overflow: 'hidden',
	},
	cardHeader: {
		gap: 8,
	},
	headlineRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 8,
	},
	eventInfo: {
		flex: 1,
		gap: 4,
	},
	eventName: {
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: -0.2,
	},
	headlineText: {
		fontSize: 13,
		color: 'rgba(255, 255, 255, 0.85)',
		lineHeight: 18,
	},
	severityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		borderWidth: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.25)',
	},
	severityText: {
		fontSize: 10,
		fontWeight: '800',
		letterSpacing: 0.8,
	},
	metaRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: 12,
		marginTop: 2,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	metaText: {
		fontSize: 12,
		color: 'rgba(255, 255, 255, 0.85)',
		fontWeight: '500',
	},
	detailsContainer: {
		marginTop: 8,
		borderTopWidth: 1,
		borderTopColor: 'rgba(255, 255, 255, 0.08)',
		paddingTop: 8,
	},
	expandedContent: {
		gap: 10,
		paddingVertical: 6,
	},
	detailSection: {
		gap: 4,
	},
	detailLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: 'rgba(255, 255, 255, 0.6)',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	detailBody: {
		fontSize: 13,
		color: 'rgba(255, 255, 255, 0.9)',
		lineHeight: 18,
	},
	expandButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 4,
		paddingVertical: 4,
	},
	expandButtonText: {
		fontSize: 12,
		fontWeight: '600',
	},
});
