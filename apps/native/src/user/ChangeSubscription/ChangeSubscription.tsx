import React, {useEffect, useState} from 'react';
import {Pressable, Text, ScrollView, StyleSheet, View, Linking, Platform} from 'react-native';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import Constants from 'expo-constants';
import {formatMoney} from '@northernexplorer/tools';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/components/Spinner';
import {alertStore} from '~/core/alertStore';
import {config} from '~/config';

type RouteParams = {
	username: string;
};

export function ChangeSubscription() {
	const authentication = useAuthentication();
	const {username} = useLocalSearchParams<RouteParams>();
	const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string>('');
	const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

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

	const configureRevenueCatIfNeeded = async () => {
		const isConfigured = await Purchases.isConfigured();
		if (!isConfigured) {
			const apiKey = config.REVENUE_CAT_GOOGLE_KEY;

			if (Platform.OS === 'android' && apiKey) {
				Purchases.configure({apiKey});
			} else {
				throw new Error('RevenueCat API key is missing or invalid for this platform.');
			}
		}
	};

	const handleSubmit = async () => {
		const selectedPlan = data.find(plan => plan.id === selectedSubscriptionId);
		if (!selectedPlan) return;

		setIsPurchasing(true);

		try {
			const isFreeTier = selectedPlan.cost === 0;

			if (isFreeTier) {
				// FREE TIER / DOWNGRADE:
				// Direct user to Google Play to cancel auto-renew.
				alertStore.showAlert(
					{
						message: 'To cancel or downgrade your active paid subscription, please manage auto-renew in Google Play.',
						title: 'Subscription Downgrade',
						type: 'success',
						buttons: [
							{
								text: 'Open Google Play',
								style: 'default',
								onPress: () => Linking.openURL('https://play.google.com/store/account/subscriptions'),
							},
							{text: 'Okay', style: 'cancel'},
						],
					},
					'success',
				);
				setIsPurchasing(false);
				return;
			}

			// Ensure RevenueCat is initialized before calling SDK methods
			await configureRevenueCatIfNeeded();

			// Log in to RevenueCat with your DB username to anchor the user identity
			await Purchases.logIn(username);

			// Fetch Google Play store product via RevenueCat
			const productId = selectedPlan.googleProductId;
			if (productId) {
				const storeProducts = await Purchases.getProducts([productId]);
				const productToPurchase = storeProducts[0];

				if (!productToPurchase) {
					alertStore.showAlert({message: 'Could not find product in Google Play Store.', title: 'Purchase Error'}, 'error');
					setIsPurchasing(false);
					return;
				}

				// Trigger Google Play Purchase Sheet
				await Purchases.purchaseStoreProduct(productToPurchase);

				alertStore.showAlert({message: 'Subscription processed! Access will update shortly.', title: 'Success'}, 'success');
				router.replace(`/profile/${username}`);
				return; // Stop execution here so it doesn't drop through to the fallback alert below
			}
			alertStore.showAlert({message: 'Could not find product ID.', title: 'Purchase Error'}, 'error');
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			const isCancelled = typeof error === 'object' && error !== null && 'userCancelled' in error && Boolean(error.userCancelled);
			if (!isCancelled) {
				alertStore.showAlert({message: message || 'An error occurred during transaction.', title: 'Purchase Error'}, 'error');
			}
		} finally {
			setIsPurchasing(false);
		}
	};

	const isCurrentPlanSelected = currentPlanId === selectedSubscriptionId;

	return (
		<ScrollView contentContainerStyle={cardStyles.container} keyboardShouldPersistTaps="handled">
			<Text style={cardStyles.subtitle}>Choose a subscription level that fits your journey.</Text>

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
