import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {router} from 'expo-router';
import {useDispatch} from 'react-redux';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {alertStore} from '~/core/alertStore';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {clearAuthentication} from '~/user/state/authentication/authenticationSlice';

type Props = {
	username: string;
};

export function Other({username}: Props) {
	const {mutate, loading} = useApiMutation('user', 'UserController', 'deleteUser');
	const {mutate: logout} = useApiMutation('user', 'UserController', 'logout');
	const auth = useAuthentication();
	const dispatch = useDispatch();

	const handleDeletePress = () => {
		alertStore.showAlert({
			type: 'warning',
			title: 'Delete Account',
			message: `Are you sure you want to delete the account for ${username}? This action cannot be undone.`,
			buttons: [
				{
					text: 'Confirm Delete',
					style: 'destructive',
					onPress: async () => {
						await mutate({username});
						if (auth?.refreshToken) {
							await logout({refreshToken: auth.refreshToken});
						}
						dispatch(clearAuthentication());
						router.replace('/profile/login');
						alertStore.showAlert({
							type: 'success',
							message: `Account for ${username} has been successfully deleted.`,
						});
					},
				},
				{
					text: 'Cancel',
					style: 'cancel',
				},
			],
		});
	};

	return (
		<View style={styles.container}>
			<Pressable
				style={({pressed}) => [styles.negativeButton, (pressed || loading) && {opacity: 0.7}]}
				onPress={handleDeletePress}
				disabled={loading}
				accessibilityRole="button"
				accessibilityLabel={`Delete account for ${username}`}
				accessibilityHint="Double tap to open confirmation dialog for deleting this account"
			>
				<Text style={styles.negativeButtonText}>{loading ? 'Deleting...' : 'Delete Account'}</Text>
			</Pressable>
		</View>
	);
}
