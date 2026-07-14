import {Stack} from 'expo-router';
import {Provider} from 'react-redux';
import {store, persistor} from '~/core/store';
import {PersistGate} from 'redux-persist/integration/react';
import {AppBootstrap} from '~/layout/Layout/components/Boostrap';
import {ConnectivityProvider} from '~/core/ConnectivityProvider';
import {ErrorHandler} from '~/layout/Layout/components/ErrorHandler';

export default function Layout() {
	return (
		<Provider store={store}>
			<ConnectivityProvider>
				<PersistGate loading={null} persistor={persistor}>
					<ErrorHandler>
						<AppBootstrap />
						<Stack
							screenOptions={{
								headerShown: false,
							}}
						/>
					</ErrorHandler>
				</PersistGate>
			</ConnectivityProvider>
		</Provider>
	);
}
