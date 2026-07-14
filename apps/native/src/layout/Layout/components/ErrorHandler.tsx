import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import {alertStore} from '~/core/alertStore';

export function ErrorHandler({children}: {children: React.ReactNode}) {
	const [alert, setAlert] = useState<{message: string | null}>({message: null});

	useEffect(() => {
		return alertStore.subscribe(setAlert);
	}, []);

	return (
		<View style={styles.container}>
			{children}

			<Modal transparent visible={!!alert.message} animationType="fade" onRequestClose={() => alertStore.clearAlert()}>
				<View style={styles.overlay}>
					<View style={styles.alertBox}>
						<View style={styles.iconCircle}>
							<Text style={styles.iconText}>!</Text>
						</View>

						<Text style={styles.title}>Error</Text>
						<Text style={styles.message}>{alert.message}</Text>

						<TouchableOpacity style={styles.button} onPress={() => alertStore.clearAlert()}>
							<Text style={styles.buttonText}>Dismiss</Text>
						</TouchableOpacity>
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
		color: '#FF3B30',
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
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
});
