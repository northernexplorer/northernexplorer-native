import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Href, useLocalSearchParams, useRouter} from 'expo-router';
import {Pagination, Spinner} from '@northernexplorer/tools-web';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {NotificationList} from '~/system/components/NotificationList';
import styles from '~/user/styles';

const limit = 20;

export function Notifications() {
	const router = useRouter();
	const params = useLocalSearchParams<{page?: string}>();
	const page = params.page ? Math.max(1, parseInt(params.page, 10) || 1) : 1;
	const offset = (page - 1) * limit;
	const {data, loading, refetch} = useApiFetch('system', 'NotificationController', 'getAllPaginated', {limit, offset});
	const {mutate: markRead} = useApiMutation('system', 'NotificationController', 'markRead');

	const handleMarkRead = async (id: string) => {
		const result = await markRead({id});
		if (result?.success) await refetch();
	};

	const handleOpenNotification = async (notification: {id: string; readAt: string | Date | null}, link: string) => {
		if (!notification.readAt) {
			const result = await markRead({id: notification.id});
			if (result?.success) await refetch();
		}
		router.push(link as Href);
	};

	if (loading || !data) return <Spinner />;

	return (
		<View style={styles.container}>
			<View style={styles.categorySection}>
				<Text style={styles.categoryHeader}>Notifications</Text>
				{data.items.length > 0 ? (
					<NotificationList notifications={data.items} onOpen={handleOpenNotification} onMarkRead={handleMarkRead} />
				) : (
					<Text style={notificationStyles.message}>No notifications yet.</Text>
				)}
				{data.totalCount > limit && <Pagination limit={limit} itemCount={data.items.length} totalCount={data.totalCount} />}
			</View>
		</View>
	);
}

const notificationStyles = StyleSheet.create({
	message: {
		fontSize: 15,
		lineHeight: 22,
		color: '#64748b',
	},
});
