import {View, Text} from 'react-native';
import styles from '~/user/styles';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/components/Spiner';
import React from 'react';
import {formatMoney} from '@northernexplorer/tools';

type Props = {
	username: string;
};
export function Subscription({username}: Props) {
	const {data, loading} = useApiFetch('user', 'SubscriptionController', 'getByUsername', {
		username,
	});
	if (loading || !data) return <Spinner />;

	const ProfileField = ({label, value}: {label: string; value: string}) => (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<Text style={styles.value}>{value}</Text>
		</View>
	);
	return (
		<View style={styles.container}>
			<ProfileField label="Type" value={data.subscriptionLevel.name} />
			<ProfileField label="Start Date" value={new Date(data.subscription.startDate).toLocaleDateString()} />
			<ProfileField label="Renewal Date" value={new Date(data.subscription.renewalDate).toLocaleDateString()} />
			{data.subscription.endDate && <ProfileField label="End Date" value={new Date(data.subscription.endDate).toLocaleDateString()} />}
			<ProfileField label="Cost" value={formatMoney(data.subscriptionLevel.cost)} />
			<ProfileField label="Description" value={data.subscriptionLevel.description} />
		</View>
	);
}
