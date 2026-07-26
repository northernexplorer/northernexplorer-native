import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import {router} from 'expo-router';
import {useDispatch} from 'react-redux';
import {alertStore, AlertState} from '~/core/alertStore';
import {authEvents} from '~/core/authEvents';
import {clearAuthentication} from '~/user/state/authentication/authenticationSlice';

const ALERT_CONFIG = {
	error: {
		icon: '!',
		color: '#FF3B30',
		title: 'Error',
	},
	warning: {
		icon: '⚠',
		color: '#FF9F0A',
		title: 'Warning',
	},
	success: {
		icon: '✓',
		color: '#34C759',
		title: 'Success',
	},
} as const;

export function AlertHandler({children}: {children: React.ReactNode}) {
	const [activeAlert, setActiveAlert] = useState<AlertState>({message: null, type: 'error'});
	const [isVisible, setIsVisible] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		return alertStore.subscribe(newState => {
			if (newState.message) {
				setActiveAlert(newState);
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		});
	}, []);

	useEffect(() => {
		return authEvents.subscribe(event => {
			if (event === 'FORCE_LOGOUT') {
				dispatch(clearAuthentication());
				router.replace('/profile/login');
			}
		});
	}, [dispatch]);

	const handleButtonPress = (onPress?: () => void) => {
		alertStore.clearAlert();
		if (onPress) {
			onPress();
		}
	};

	const config = ALERT_CONFIG[activeAlert.type];
	const displayTitle = activeAlert.title || config.title;

	return (
		<View style={styles.container}>
			{children}

			<Modal transparent visible={isVisible} animationType="fade">
				<View style={styles.overlay}>
					<View style={styles.alertBox}>
						<View style={[styles.iconCircle, {borderColor: config.color, backgroundColor: `${config.color}15`}]}>
							<Text style={[styles.iconText, {color: config.color}]}>{config.icon}</Text>
						</View>

						<Text style={styles.title}>{displayTitle}</Text>
						<Text style={styles.message}>{activeAlert.message}</Text>

						{activeAlert.buttons && activeAlert.buttons.length > 0 ? (
							<View style={styles.buttonRow}>
								{activeAlert.buttons.map((btn, index) => {
									const isDestructive = btn.style === 'destructive';
									const isCancel = btn.style === 'cancel';

									return (
										<TouchableOpacity
											key={index}
											style={[styles.actionButton, isDestructive && styles.destructiveButton, isCancel && styles.cancelButton]}
											onPress={() => handleButtonPress(btn.onPress)}
										>
											<Text style={[styles.buttonText, isDestructive && styles.destructiveButtonText]}>{btn.text}</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						) : (
							<TouchableOpacity style={styles.button} onPress={() => alertStore.clearAlert()}>
								<Text style={styles.buttonText}>Dismiss</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	alertBox: {
		width: '100%',
		maxWidth: 340,
		backgroundColor: '#1a1a1a',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#333333',
		padding: 24,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 10},
		shadowOpacity: 0.45,
		shadowRadius: 20,
		elevation: 10,
	},
	iconCircle: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: 'rgba(255, 59, 48, 0.1)',
		borderWidth: 1,
		borderColor: '#FF3B30',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	iconText: {
		fontSize: 22,
		fontWeight: '700',
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: '#ffffff',
		marginBottom: 10,
		textAlign: 'center',
		letterSpacing: 0.4,
	},
	message: {
		fontSize: 15,
		color: 'rgba(255, 255, 255, 0.78)',
		textAlign: 'center',
		lineHeight: 22,
		marginBottom: 24,
		paddingHorizontal: 6,
	},
	button: {
		backgroundColor: 'rgba(255, 255, 255, 0.12)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.15)',
		paddingVertical: 14,
		borderRadius: 12,
		width: '100%',
		alignItems: 'center',
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
		width: '100%',
	},
	actionButton: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.12)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.15)',
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
	},
	cancelButton: {
		backgroundColor: 'transparent',
	},
	destructiveButton: {
		backgroundColor: 'rgba(255, 59, 48, 0.15)',
		borderColor: '#FF3B30',
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
	destructiveButtonText: {
		color: '#FF3B30',
	},
});
