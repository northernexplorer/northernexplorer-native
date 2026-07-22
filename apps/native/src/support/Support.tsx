import {View, Text} from 'react-native';
import {Link} from 'expo-router';
import styles from '~/user/styles';

export function Support() {
	return (
		<View style={styles.container}>
			<Link href="/support/privacy-policy">
				<Text style={styles.linkText}>Privacy Policy</Text>
			</Link>

			<Link href="/support/terms-of-service">
				<Text style={styles.linkText}>Terms of Service</Text>
			</Link>

			<Link href="/support/delete-account">
				<Text style={styles.linkText}>Delete Your Account</Text>
			</Link>
		</View>
	);
}
