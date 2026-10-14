import {Stack} from 'expo-router';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Head from 'expo-router/head';
import {store, persistor} from '~/core/store';
import {AppBootstrap} from '~/layout/Layout/components/Boostrap';
import {ConnectivityProvider} from '~/core/ConnectivityProvider';
import {AlertHandler} from '~/layout/Layout/components/AlertHandler';

export default function Layout() {
	return (
		<>
			<Head>
				<meta name="google-adsense-account" content="ca-pub-8374113915951863" />
			</Head>
			<Provider store={store}>
				<ConnectivityProvider>
					<SafeAreaProvider>
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
					</SafeAreaProvider>
				</ConnectivityProvider>
			</Provider>
		</>
	);
}
