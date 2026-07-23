import React, {useEffect, useState} from 'react';
import {Pressable, Text, ScrollView, StyleSheet, View} from 'react-native';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import {SubscriptionLevelsResponse} from '@northernexplorer/types';
import {formatMoney} from '@northernexplorer/tools';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiMutation} from '~/core/useApiMutation';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/components/Spinner';

type RouteParams = {
	username: string;
};

export function ChangeSubscription() {
	const authentication = useAuthentication();
	const {username} = useLocalSearchParams<RouteParams>();
	const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string>('');
	const {data, loading} = useApiFetch('user', 'SubscriptionLevelController', 'getSubscriptionLevels', {});
	const {data: subscriptionData, loading: subscriptionLoading} = useApiFetch('user', 'SubscriptionController', 'getByUsername', {username});

	const {mutate, loading: mutationLoading} = useApiMutation('user', 'SubscriptionController', 'changeSubscription');

	useEffect(() => {
		if (subscriptionData?.subscriptionLevel.id) {
			setSelectedSubscriptionId(subscriptionData.subscriptionLevel.id);
		}
	}, [subscriptionData]);

	if (!authentication) return <Redirect href="/profile/login" />;
	if (loading || !data) return <Spinner />;
	if (subscriptionLoading || !subscriptionData) return <Spinner />;

	const validateForm = async () => {
		await handleSubmit();
	};

	const handleSubmit = async () => {
		const response = await mutate({username, subscriptionLevelId: selectedSubscriptionId});
		if (response?.success) {
			router.replace(`/profile/${username}`);
		}
	};

	const displayProperties: (keyof SubscriptionLevelsResponse)[] = ['shortDescription', 'cost'];
	const disabledChangeButton = subscriptionData.subscriptionLevel.id === selectedSubscriptionId;
	const formatHeader = (key: string) => {
		const result = key.replace(/([A-Z])/g, ' $1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	};
	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<View style={tableStyles.tableContainer}>
				<View style={tableStyles.tableRow}>
					<Text style={[tableStyles.cell, {flex: 2}]}></Text>
					{data?.map(plan => (
						<Text key={plan.id} style={tableStyles.headerCell}>
							{plan.name}
						</Text>
					))}
				</View>
				{displayProperties.map(prop => (
					<View key={prop} style={tableStyles.tableRow}>
						<Text style={[tableStyles.cell, {flex: 2}]}>{formatHeader(prop)}</Text>
						{data?.map(plan => {
							const value = prop === 'cost' ? formatMoney(plan[prop] as number) : String(plan[prop]);

							return (
								<Text key={`${plan.id}-${prop}`} style={tableStyles.cell}>
									{value}
								</Text>
							);
						})}
					</View>
				))}
				<View style={tableStyles.tableRow}>
					<Text style={[tableStyles.cell, {flex: 2, fontWeight: 'bold'}]}>Select</Text>
					{data?.map(plan => (
						<Pressable key={`select-${plan.id}`} style={tableStyles.cell} onPress={() => setSelectedSubscriptionId(plan.id)}>
							<View style={[tableStyles.radioCircle, selectedSubscriptionId === plan.id && tableStyles.radioSelected]} />
						</Pressable>
					))}
				</View>
			</View>
			<Pressable
				style={[styles.button, (mutationLoading || disabledChangeButton) && {opacity: 0.6}]}
				onPress={validateForm}
				disabled={mutationLoading || disabledChangeButton}
			>
				<Text style={styles.buttonText}>{mutationLoading ? 'Updating Subscription...' : 'Change Subscription'}</Text>
			</Pressable>

			<Link href={`/profile/${username}`} asChild>
				<Pressable style={styles.secondaryButton} disabled={mutationLoading}>
					<Text style={styles.secondaryButtonText}>Cancel</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}

const tableStyles = StyleSheet.create({
	tableContainer: {
		padding: 10,
		width: '100%',
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#ccc',
		paddingVertical: 12,
		alignItems: 'center',
	},
	headerCell: {
		flex: 1,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	cell: {
		flex: 1,
		textAlign: 'center',
		textAlignVertical: 'center',
		includeFontPadding: false,
	},
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#555',
		alignSelf: 'center',
	},
	radioSelected: {
		backgroundColor: '#0088cc',
		borderColor: '#0088cc',
	},
});
