import React, {useEffect, useState} from 'react';
import {Pressable, Text, ScrollView, StyleSheet, View, Linking, Platform} from 'react-native';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import Purchases from 'react-native-purchases';
import {formatMoney, Spinner} from '@northernexplorer/tools';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
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

	const isNativePlatform = Platform.OS === 'android' || Platform.OS === 'ios';

	const {data, loading} = useApiFetch('user', 'SubscriptionLevelController', 'getSubscriptionLevels', {});
	const {data: subscriptionData, loading: subscriptionLoading} = useApiFetch('user', 'SubscriptionController', 'getByUsername', {username});

	useEffect(() => {
		if (subscriptionData?.subscriptionLevel.id) {
			setSelectedSubscriptionId(subscriptionData.subscriptionLevel.id);
		}
	}, [subscriptionData]);

	if (!authentication) return <Redirect href="/profile/login" />;
	if (loading || !data || subscriptionLoading || !subscriptionData) return <Spinner />;

	const currentPlanId = subscriptionData.subscriptionLevel.id;

	const configureRevenueCatIfNeeded = async () => {
		const isConfigured = await Purchases.isConfigured();
		if (!isConfigured) {
			const apiKey = Platform.OS === 'android' ? config.EXPO_PUBLIC_REVENUE_CAT_GOOGLE_KEY : undefined;

			if (apiKey) {
				Purchases.configure({apiKey});
			} else {
				throw new Error('RevenueCat API key is missing or invalid for this platform.');
			}
		}
	};

	const handleSubmit = async () => {
		if (!isNativePlatform) return;

		const selectedPlan = data.find(plan => plan.id === selectedSubscriptionId);
		if (!selectedPlan) return;

		setIsPurchasing(true);

		try {
			const isFreeTier = selectedPlan.cost === 0;

			if (isFreeTier) {
				const storeUrl =
					Platform.OS === 'android'
						? 'https://play.google.com/store/account/subscriptions'
						: 'https://apps.apple.com/account/subscriptions';

				alertStore.showAlert({
					message: `To cancel or downgrade your active paid subscription, please manage auto-renew in your ${Platform.OS === 'android' ? 'Google Play' : 'App Store'} settings.`,
					title: 'Subscription Downgrade',
					type: 'success',
					buttons: [
						{
							text: Platform.OS === 'android' ? 'Open Google Play' : 'Open App Store',
							style: 'default',
							onPress: () => Linking.openURL(storeUrl),
						},
						{text: 'Okay', style: 'cancel'},
					],
				});
				setIsPurchasing(false);
				return;
			}

			await configureRevenueCatIfNeeded();
			await Purchases.logIn(username);

			const productId = Platform.OS === 'android' ? selectedPlan.googleProductId : undefined;
			if (productId) {
				const storeProducts = await Purchases.getProducts([productId]);
				const productToPurchase = storeProducts.at(0);

				if (!productToPurchase) {
					alertStore.showAlert({message: 'Could not find product in store.', title: 'Purchase Error', type: 'error'});
					setIsPurchasing(false);
					return;
				}

				await Purchases.purchaseStoreProduct(productToPurchase);

				alertStore.showAlert({message: 'Subscription processed! Access will update shortly.', title: 'Success', type: 'success'});
				router.replace(`/profile/${username}`);
				return;
			}
			alertStore.showAlert({message: 'Could not find product ID.', title: 'Purchase Error', type: 'error'});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			const isCancelled = typeof error === 'object' && error !== null && 'userCancelled' in error && Boolean(error.userCancelled);
			if (!isCancelled) {
				alertStore.showAlert({message: message || 'An error occurred during transaction.', title: 'Purchase Error', type: 'error'});
			}
		} finally {
			setIsPurchasing(false);
		}
	};

	const isCurrentPlanSelected = currentPlanId === selectedSubscriptionId;

	return (
		<ScrollView contentContainerStyle={cardStyles.container} keyboardShouldPersistTaps="handled">
			{isNativePlatform && <Text style={cardStyles.subtitle}>Choose a subscription level that fits your journey.</Text>}

			{!isNativePlatform && (
				<View style={cardStyles.unsupportedBanner}>
					<Text style={cardStyles.unsupportedBannerText}>
						Subscription management is only available within the Android or iOS mobile apps.
					</Text>
				</View>
			)}

			<View style={cardStyles.cardList}>
				{data.map(plan => {
					const isSelected = selectedSubscriptionId === plan.id;
					const isCurrent = currentPlanId === plan.id;

					return (
						<Pressable
							key={plan.id}
							disabled={!isNativePlatform}
							style={[cardStyles.card, isSelected && cardStyles.cardSelected, !isNativePlatform && cardStyles.cardDisabled]}
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

							<Text style={cardStyles.planDescription}>{plan.description}</Text>
							<View style={cardStyles.featureList}>
								{plan.features.map(feature => (
									<View key={feature.id} style={cardStyles.featureRow}>
										<Text style={cardStyles.checkmark}>✓</Text>
										<Text style={cardStyles.featureText}>{feature.label}</Text>
									</View>
								))}
							</View>
						</Pressable>
					);
				})}
			</View>

			<Pressable
				style={[styles.button, (isPurchasing || isCurrentPlanSelected || !isNativePlatform) && {opacity: 0.6}]}
				onPress={handleSubmit}
				disabled={isPurchasing || isCurrentPlanSelected || !isNativePlatform}
			>
				<Text style={styles.buttonText}>
					{!isNativePlatform
						? 'Subscriptions Unavailable on Web'
						: isPurchasing
							? 'Processing...'
							: isCurrentPlanSelected
								? 'Current Plan Selected'
								: 'Confirm Subscription'}
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
	unsupportedBanner: {
		backgroundColor: '#fff3cd',
		borderColor: '#ffeeba',
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
	},
	unsupportedBannerText: {
		color: '#856404',
		fontSize: 14,
		textAlign: 'center',
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
	cardDisabled: {
		opacity: 0.6,
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
	featureList: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#eef2f5',
		gap: 6,
	},
	featureRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	checkmark: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#137333',
	},
	featureText: {
		fontSize: 13,
		color: '#444',
		flexShrink: 1,
	},
});
