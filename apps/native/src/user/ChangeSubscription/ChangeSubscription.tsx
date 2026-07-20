import React, {useEffect, useState} from 'react';
import {Pressable, Text, ScrollView, StyleSheet, View} from 'react-native';
import {Link, Redirect, router, useLocalSearchParams} from 'expo-router';
import Purchases, {PurchasesOffering, PurchasesPackage} from 'react-native-purchases';
import styles from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {Spinner} from '~/layout/Layout/components/Spinner';

type RouteParams = {
	username: string;
};

export function ChangeSubscription() {
	const authentication = useAuthentication();
	const {username} = useLocalSearchParams<RouteParams>();

	const [offering, setOffering] = useState<PurchasesOffering | null>(null);
	const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
	const [loading, setLoading] = useState(true);
	const [isPurchasing, setIsPurchasing] = useState(false);

	useEffect(() => {
		const fetchOfferings = async () => {
			try {
				const offerings = await Purchases.getOfferings();
				setOffering(offerings.current);
			} catch (e) {
				console.error('Error fetching RevenueCat offerings', e);
			} finally {
				setLoading(false);
			}
		};
		fetchOfferings();
	}, []);

	if (!authentication) return <Redirect href="/profile/login" />;
	if (loading) return <Spinner />;

	const handleSubmit = async () => {
		if (!selectedPackage) return;
		setIsPurchasing(true);
		try {
			// RevenueCat handles the store transaction natively
			await Purchases.purchasePackage(selectedPackage);
			router.replace(`/profile/${username}`);
		} catch (e) {
			console.error('Purchase failed', e);
		} finally {
			setIsPurchasing(false);
		}
	};

	const packages = offering?.availablePackages || [];
	const disabledChangeButton = !selectedPackage;

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<View style={tableStyles.tableContainer}>
				{/* Header Row */}
				<View style={tableStyles.tableRow}>
					<Text style={[tableStyles.cell, {flex: 2}]}></Text>
					{packages.map(pkg => (
						<Text key={pkg.identifier} style={tableStyles.headerCell}>
							{pkg.product.title}
						</Text>
					))}
				</View>

				{/* Cost Row */}
				<View style={tableStyles.tableRow}>
					<Text style={[tableStyles.cell, {flex: 2}]}>Cost</Text>
					{packages.map(pkg => (
						<Text key={pkg.identifier} style={tableStyles.cell}>
							{pkg.product.priceString}
						</Text>
					))}
				</View>

				{/* Selection Row */}
				<View style={tableStyles.tableRow}>
					<Text style={[tableStyles.cell, {flex: 2, fontWeight: 'bold'}]}>Select</Text>
					{packages.map(pkg => (
						<Pressable key={pkg.identifier} style={tableStyles.cell} onPress={() => setSelectedPackage(pkg)}>
							<View style={[tableStyles.radioCircle, selectedPackage?.identifier === pkg.identifier && tableStyles.radioSelected]} />
						</Pressable>
					))}
				</View>
			</View>

			<Pressable
				style={[styles.button, (isPurchasing || disabledChangeButton) && {opacity: 0.6}]}
				onPress={handleSubmit}
				disabled={isPurchasing || disabledChangeButton}
			>
				<Text style={styles.buttonText}>{isPurchasing ? 'Processing...' : 'Change Subscription'}</Text>
			</Pressable>

			<Link href={`/profile/${username}`} asChild>
				<Pressable style={styles.secondaryButton} disabled={isPurchasing}>
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
