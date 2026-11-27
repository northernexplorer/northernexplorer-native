import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NotificationType} from '@northernexplorer/types';

type Props = {
	notifications: NotificationType[];
	variant?: 'light' | 'dark';
	onOpen: (notification: NotificationType, link: string) => void;
	onMarkRead: (id: string) => void;
};

function getInternalLink(link: string | null) {
	if (!link || !link.startsWith('/') || link.startsWith('//') || link.includes('\\') || /[\u0000-\u001f]/.test(link)) {
		return null;
	}

	return link;
}

export function NotificationList({notifications, variant = 'light', onOpen, onMarkRead}: Props) {
	const isDark = variant === 'dark';

	return (
		<View style={styles.list}>
			{notifications.map(notification => {
				const internalLink = getInternalLink(notification.link);
				const isUnread = !notification.readAt;

				return (
					<View key={notification.id} style={[styles.item, isDark && styles.darkItem]}>
						{internalLink && (
							<Pressable
								style={StyleSheet.absoluteFill}
								accessibilityRole="button"
								accessibilityLabel={`Open notification: ${notification.title}. ${notification.message}${isUnread ? '. Unread' : ''}`}
								onPress={() => onOpen(notification, internalLink)}
							/>
						)}
						<View style={styles.titleRow} pointerEvents="none">
							<Text style={[styles.title, isDark && styles.darkTitle]}>{notification.title}</Text>
							{isUnread && <View accessibilityLabel="Unread" style={styles.unreadDot} />}
						</View>
						<Text style={[styles.message, isDark && styles.darkMessage]} pointerEvents="none">
							{notification.message}
						</Text>
						<View style={styles.footer} pointerEvents="box-none">
							<Text style={[styles.date, isDark && styles.darkDate]} pointerEvents="none">
								{new Date(notification.createdAt).toLocaleString()}
							</Text>
							<View style={styles.actions} pointerEvents="box-none">
								{internalLink && (
									<Text style={[styles.actionText, isDark && styles.darkActionText]} pointerEvents="none">
										Open
									</Text>
								)}
								{isUnread && (
									<Pressable
										accessibilityRole="button"
										accessibilityLabel={`Mark ${notification.title} as read`}
										onPress={event => {
											event.stopPropagation();
											onMarkRead(notification.id);
										}}
									>
										<Text style={[styles.actionText, isDark && styles.darkActionText]}>Mark as read</Text>
									</Pressable>
								)}
							</View>
						</View>
					</View>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	list: {
		gap: 8,
	},
	item: {
		gap: 8,
		padding: 12,
		borderRadius: 8,
		backgroundColor: '#f8fafc',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	darkItem: {
		backgroundColor: '#2b2b2b',
		borderColor: '#444444',
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	title: {
		flex: 1,
		fontSize: 15,
		fontWeight: '600',
		color: '#0f172a',
	},
	darkTitle: {
		color: '#ffffff',
	},
	unreadDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#0088cc',
	},
	message: {
		fontSize: 14,
		lineHeight: 20,
		color: '#475569',
	},
	darkMessage: {
		color: 'rgba(255,255,255,0.72)',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 8,
	},
	date: {
		flex: 1,
		fontSize: 11,
		color: '#64748b',
	},
	darkDate: {
		color: '#a1a1aa',
	},
	actions: {
		flexDirection: 'row',
		gap: 12,
	},
	actionText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#0088cc',
	},
	darkActionText: {
		color: '#38bdf8',
	},
});
