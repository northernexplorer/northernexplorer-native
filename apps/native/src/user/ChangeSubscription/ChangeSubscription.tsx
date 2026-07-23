import React, {useEffect, useState} from 'react';
import {Pressable, Text, ScrollView, StyleSheet, View, Linking, Alert} from 'react-native';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import Purchases from 'react-native-purchases';
import {SubscriptionLevelsResponse} from '@northernexplorer/types';
import {formatMoney} from '@northernexplorer/tools';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/components/Spinner';
import {alertStore} from '~/core/alertStore';

type RouteParams = {
	username: string;
};

export function ChangeSubscription() {
	const authentication = useAuthentication();
	const {username} = useLocalSearchParams<RouteParams>();
	const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string>('');
	const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

	// 1. Fetch available plans & user status directly from your PostgreSQL DB
	const {data, loading} = useApiFetch('user', 'SubscriptionLevelController', 'getSubscriptionLevels', {});
	const {data: subscriptionData, loading: subscriptionLoading} = useApiFetch('user', 'SubscriptionController', 'getByUsername', {username});

	useEffect(() => {
		if (subscriptionData?.subscriptionLevel?.id) {
			setSelectedSubscriptionId(subscriptionData.subscriptionLevel.id);
		}
	}, [subscriptionData]);

	if (!authentication) return <Redirect href="/profile/login" />;
	if (loading || !data || subscriptionLoading || !subscriptionData) return <Spinner />;

	const currentPlanId = subscriptionData.subscriptionLevel.id;

	const handleSubmit = async () => {
		const selectedPlan = data.find(plan => plan.id === selectedSubscriptionId);
		if (!selectedPlan) return;

		setIsPurchasing(true);

		try {
			const isFreeTier = selectedPlan.cost === 0;

			if (isFreeTier) {
				// FREE TIER / DOWNGRADE:
				// Direct user to Google Play to cancel auto-renew.
				// RevenueCat's EXPIRATION webhook will automatically set their DB record to free when it expires.
				Alert.alert('Switch to Free Plan', 'To cancel or downgrade your active paid subscription, please manage auto-renew in Google Play.', [
					{text: 'Cancel', style: 'cancel'},
					{
						text: 'Open Google Play Settings',
						onPress: () => {
							Linking.openURL('https://play.google.com/store/account/subscriptions');
						},
					},
				]);
				setIsPurchasing(false);
				return;
			}

			// PAID TIER / UPGRADE:
			// 1. Log in to RevenueCat with your DB username to anchor the user identity
			await Purchases.logIn(username);

			// 2. Fetch Google Play store product via RevenueCat
			const productId = selectedPlan.googleProductId || selectedPlan.id;
			const storeProducts = await Purchases.getProducts([productId]);
			const productToPurchase = storeProducts[0];

			if (!productToPurchase) {
				alertStore.showAlert({message: 'Could not find product in Google Play Store.', title: 'Purchase Error'}, 'error');
				setIsPurchasing(false);
				return;
			}

			// 3. Trigger Google Play Purchase Sheet
			// (RevenueCat handles upgrades automatically)
			await Purchases.purchaseStoreProduct(productToPurchase);

			alertStore.showAlert({message: 'Subscription processed! Access will update shortly.', title: 'Success'}, 'success');
			router.replace(`/profile/${username}`);
		} catch (error: any) {
			if (!error.userCancelled) {
				alertStore.showAlert({message: error?.message || 'An error occurred during transaction.', title: 'Purchase Error'}, 'error');
			}
		} finally {
			setIsPurchasing(false);
		}
	};

	const isCurrentPlanSelected = currentPlanId === selectedSubscriptionId;

	return (
		<ScrollView contentContainerStyle={cardStyles.container} keyboardShouldPersistTaps="handled">
			<Text style={cardStyles.title}>Select Your Plan</Text>
			<Text style={cardStyles.subtitle}>Choose a subscription level that fits your journey.</Text>

			{/* Custom UI: Vertical Stack of Subscription Cards */}
			<View style={cardStyles.cardList}>
				{data.map(plan => {
					const isSelected = selectedSubscriptionId === plan.id;
					const isCurrent = currentPlanId === plan.id;

					return (
						<Pressable
							key={plan.id}
							style={[cardStyles.card, isSelected && cardStyles.cardSelected]}
							onPress={() => setSelectedSubscriptionId(plan.id)}
						>
							<View style={cardStyles.cardHeader}>
								<View style={cardStyles.titleBadgeRow}>
									<Text style={cardStyles.planName}>{plan.name}</Text>
									{isCurrent && (
										<View style={cardStyles.currentBadge}>
											<Text style={cardStyles.currentBadgeText}>Current Plan</Text>
										</View>
									)}
								</View>
								<View style={[cardStyles.radioCircle, isSelected && cardStyles.radioSelected]}>
									{isSelected && <View style={cardStyles.radioInner} />}
								</View>
							</View>

							<Text style={cardStyles.planCost}>{plan.cost === 0 ? 'Free' : `${formatMoney(plan.cost)} / month`}</Text>

							{plan.shortDescription ? <Text style={cardStyles.planDescription}>{plan.shortDescription}</Text> : null}
						</Pressable>
					);
				})}
			</View>

			<Pressable
				style={[styles.button, (isPurchasing || isCurrentPlanSelected) && {opacity: 0.6}]}
				onPress={handleSubmit}
				disabled={isPurchasing || isCurrentPlanSelected}
			>
				<Text style={styles.buttonText}>
					{isPurchasing ? 'Processing...' : isCurrentPlanSelected ? 'Current Plan Selected' : 'Confirm Subscription'}
				</Text>
			</Pressable>

			<Link href={`/profile/${username}`} asChild>
				<Pressable style={{...styles.secondaryButton, ...cardStyles.cancelButton}} disabled={isPurchasing}>
					<Text style={styles.secondaryButtonText}>Cancel</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}

const cardStyles = StyleSheet.create({
	container: {
		padding: 16,
		paddingBottom: 32,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 8,
	},
	subtitle: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
		marginBottom: 20,
		marginTop: 4,
	},
	cardList: {
		gap: 12,
		marginBottom: 24,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		borderWidth: 2,
		borderColor: '#e0e0e0',
	},
	cardSelected: {
		borderColor: '#0088cc',
		backgroundColor: '#f0f8ff',
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 6,
	},
	titleBadgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		flexShrink: 1,
	},
	planName: {
		fontSize: 18,
		fontWeight: '700',
		color: '#111',
	},
	currentBadge: {
		backgroundColor: '#e6f4ea',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#137333',
	},
	currentBadgeText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#137333',
	},
	planCost: {
		fontSize: 16,
		fontWeight: '600',
		color: '#0088cc',
		marginBottom: 6,
	},
	planDescription: {
		fontSize: 14,
		color: '#555',
		lineHeight: 20,
	},
	radioCircle: {
		height: 22,
		width: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: '#999',
		justifyContent: 'center',
		alignItems: 'center',
	},
	radioSelected: {
		borderColor: '#0088cc',
	},
	radioInner: {
		height: 12,
		width: 12,
		borderRadius: 6,
		backgroundColor: '#0088cc',
	},
	cancelButton: {
		marginTop: 12,
	},
});