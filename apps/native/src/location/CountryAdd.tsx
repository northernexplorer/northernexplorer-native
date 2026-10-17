import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {FormField} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';

export function CountryAdd() {
	const router = useRouter();
	const authentication = useAuthentication();
	const isAdmin = Boolean(authentication?.roles?.includes(RolesEnum.Admin));

	const [name, setName] = useState('');
	const [error, setError] = useState<string | undefined>();

	const {mutate: createCountry, loading} = useApiMutation('location', 'CountryController', 'create');

	if (!authentication) return <Redirect href="/user/login" />;
	if (!isAdmin) return <Redirect href="404" />;

	const handleSubmit = async () => {
		const trimmedName = name.trim();
		if (!trimmedName) {
			setError('Country name is required');
			return;
		}
		setError(undefined);

		const result = await createCountry({name: trimmedName});
		if (result) {
			alertStore.showAlert({
				message: `Country "${result.name}" created successfully!`,
				type: 'success',
			});
			router.push('/admin');
		}
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.header}>
				<Ionicons name="globe-outline" size={28} color="#0088cc" />
				<Text style={styles.headerTitle}>Add New Country</Text>
			</View>
			<Text style={styles.headerSubtitle}>Register a new sovereign territory or nation to group regions and points of interest.</Text>

			<View style={styles.card}>
				<FormField
					label="Country Name"
					value={name}
					updateField={(_, val) => {
						setName(val);
						if (error) setError(undefined);
					}}
					placeholder="e.g. Iceland, Norway, Canada"
					error={error}
					loading={loading}
					fieldName="name"
				/>

				<View style={styles.buttonRow}>
					<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.push('/admin')} disabled={loading}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
						onPress={handleSubmit}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<>
								<Ionicons name="add-circle-outline" size={18} color="#ffffff" style={{marginRight: 6}} />
								<Text style={styles.submitButtonText}>Create Country</Text>
							</>
						)}
					</TouchableOpacity>
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
		padding: 16,
		maxWidth: 600,
		width: '100%',
		alignSelf: 'center',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 6,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: '700',
		color: '#212529',
	},
	headerSubtitle: {
		fontSize: 14,
		color: '#6c757d',
		marginBottom: 20,
		lineHeight: 20,
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: '#e9ecef',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 12,
		marginTop: 24,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		minWidth: 120,
	},
	cancelButton: {
		backgroundColor: '#f1f3f5',
	},
	cancelButtonText: {
		color: '#495057',
		fontWeight: '600',
		fontSize: 14,
	},
	submitButton: {
		backgroundColor: '#0088cc',
	},
	submitButtonText: {
		color: '#ffffff',
		fontWeight: '600',
		fontSize: 14,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
});
