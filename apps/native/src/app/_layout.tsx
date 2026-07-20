import {Stack} from 'expo-router';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {useEffect} from 'react';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import {Platform} from 'react-native';
import {store, persistor} from '~/core/store';
import {AppBootstrap} from '~/layout/Layout/components/Boostrap';
import {ConnectivityProvider} from '~/core/ConnectivityProvider';
import {AlertHandler} from '~/layout/Layout/components/AlertHandler';
import {config} from '~/config';

export default function Layout() {
	useEffect(() => {
		const initPurchases = async () => {
			if (await Purchases.isConfigured()) return;

			Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

			const apiKey = Platform.select({
				ios: config.EXPO_PUBLIC_REVENUE_IOS_KEY,
				android: config.EXPO_PUBLIC_REVENUE_ANDROID_KEY,
			});

			if (apiKey) {
				Purchases.configure({apiKey});
			}
		};

		initPurchases();
	}, []);

	return (
		<Provider store={store}>
			<ConnectivityProvider>
				<PersistGate loading={null} persistor={persistor}>
					<AlertHandler>
						<AppBootstrap />
						<Stack
							screenOptions={{
								headerShown: false,
							}}
						/>
					</AlertHandler>
				</PersistGate>
			</ConnectivityProvider>
		</Provider>
	);
}
