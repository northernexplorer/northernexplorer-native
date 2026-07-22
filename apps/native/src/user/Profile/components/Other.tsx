import {View, Text, Pressable} from 'react-native';
import React from 'react';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';

type Props = {
	username: string;
};
export function Other({username}: Props) {
	const {mutate} = useApiMutation('user', 'UserController', 'deleteUser');
	const handleDeletePress = () => {
		await mutate({username});
	};

	return (
		<View style={styles.container}>
			<Pressable style={styles.negativeButton} onPress={handleDeletePress}>
				<Text style={styles.negativeButtonText}>Delete Account</Text>
			</Pressable>
		</View>
	);
}
