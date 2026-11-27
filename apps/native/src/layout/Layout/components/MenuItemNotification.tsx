import React, {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Href, useRouter} from 'expo-router';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {Spinner} from '@northernexplorer/tools-web';
import {styles} from '~/layout/Layout/styles';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {NotificationList} from '~/system/components/NotificationList';
import {useNotificationStatus} from '~/system/NotificationContext';

export function MenuItemNotification() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const {hasUnread} = useNotificationStatus();

	const handleViewAll = () => {
		setIsOpen(false);
		router.push('/notifications');
	};

	return (
		<>
			<Pressable
				accessibilityLabel={hasUnread ? 'Notifications, unread' : 'Notifications'}
				accessibilityRole="button"
				accessibilityState={{expanded: isOpen}}
				onPress={() => setIsOpen(true)}
				style={styles.menuItem}
			>
				<View style={styles.notificationIconContainer}>
					<Ionicons name="notifications-outline" size={18} color="#d9d9d9" />
					{hasUnread && <View style={styles.notificationBadge} />}
				</View>
			</Pressable>

			<Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={() => setIsOpen(false)}>
				<Pressable style={styles.notificationBackdrop} onPress={() => setIsOpen(false)}>
					<Pressable style={styles.notificationPanel} onPress={event => event.stopPropagation()}>
						<View style={styles.notificationHeader}>
							<Text style={styles.notificationTitle}>Notifications</Text>
							<Pressable accessibilityLabel="Close notifications" accessibilityRole="button" onPress={() => setIsOpen(false)}>
								<Ionicons name="close-outline" size={24} color="white" />
							</Pressable>
						</View>
						{isOpen && <NotificationMenuContent onClose={() => setIsOpen(false)} />}
						<Pressable
							accessibilityLabel="View all notifications"
							accessibilityRole="button"
							onPress={handleViewAll}
							style={styles.notificationViewAll}
						>
							<Text style={styles.notificationViewAllText}>View all</Text>
						</Pressable>
					</Pressable>
				</Pressable>
			</Modal>
		</>
	);
}

function NotificationMenuContent({onClose}: {onClose: () => void}) {
	const router = useRouter();
	const {data, loading, refetch} = useApiFetch('system', 'NotificationController', 'getAllPaginated', {limit: 5, offset: 0});
	const {mutate: markRead} = useApiMutation('system', 'NotificationController', 'markRead');
	const {refreshUnreadStatus} = useNotificationStatus();

	const handleMarkRead = async (id: string) => {
		const result = await markRead({id});
		if (result?.success) {
			await refetch();
			await refreshUnreadStatus();
		}
	};

	const handleOpenNotification = async (notification: {id: string; readAt: string | Date | null}, link: string) => {
		if (!notification.readAt) {
			const result = await markRead({id: notification.id});
			if (result?.success) {
				await refetch();
				await refreshUnreadStatus();
			}
		}
		onClose();
		router.push(link as Href);
	};

	if (loading || !data) return <Spinner />;

	return data.items.length > 0 ? (
		<ScrollView style={{maxHeight: 280}}>
			<NotificationList variant="dark" notifications={data.items} onOpen={handleOpenNotification} onMarkRead={handleMarkRead} />
		</ScrollView>
	) : (
		<Text style={styles.notificationMessage}>No notifications yet.</Text>
	);
}
