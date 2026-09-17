import {Stack} from 'expo-router';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ShareIntentProvider} from 'expo-share-intent';
import {store, persistor} from '~/core/store';
import {AppBootstrap} from '~/layout/Layout/components/Boostrap';
import {ConnectivityProvider} from '~/core/ConnectivityProvider';
import {AlertHandler} from '~/layout/Layout/components/AlertHandler';

export default function Layout() {
	return (
		<ShareIntentProvider>
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
		</ShareIntentProvider>
	);
}
