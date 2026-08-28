import {View, Text} from 'react-native';
import {Link} from 'expo-router';
import {Spinner} from '@northernexplorer/tools';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';

export function Support() {
	const {data, loading} = useApiFetch('system', 'SupportController', 'getAll', {});

	if (loading) return <Spinner />;

	return (
		<View style={styles.container}>
			{data?.map(support => {
				return (
					<Link href={`/support/${support.url}`} key={support.id}>
						<Text style={styles.linkText}>{support.title}</Text>
					</Link>
				);
			})}
		</View>
	);
}
