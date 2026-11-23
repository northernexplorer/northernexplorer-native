import React, {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Modal, Pressable, Text, View} from 'react-native';
import {styles} from '~/layout/Layout/styles';

export function MenuItemNotification() {
	const [isOpen, setIsOpen] = useState(false);

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
					</Pressable>
				</Pressable>
			</Modal>
		</>
	);
}
