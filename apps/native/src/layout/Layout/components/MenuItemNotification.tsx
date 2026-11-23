import React, {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {Modal, Pressable, Text, View} from 'react-native';
import {styles} from '~/layout/Layout/styles';

export function MenuItemNotification() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleViewAll = () => {
		setIsOpen(false);
		router.push('/notifications');
	};

	return (
		<>
			<Pressable
				accessibilityLabel="Notifications"
				accessibilityRole="button"
				accessibilityState={{expanded: isOpen}}
				onPress={() => setIsOpen(true)}
				style={styles.menuItem}
			>
				<Ionicons name="notifications-outline" size={18} color="#d9d9d9" />
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
						<Text style={styles.notificationMessage}>Notifications aren’t available yet.</Text>
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
