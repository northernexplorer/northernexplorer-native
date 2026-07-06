import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '~/core/store';
import { PersistGate } from 'redux-persist/integration/react';
import { AppBootstrap } from '~/layout/Layout/components/Boostrap';
import { ConnectivityProvider } from '~/core/ConnectivityProvider';

export default function Layout() {
    return (
        <Provider store={store}>
            <ConnectivityProvider>
                <PersistGate loading={null} persistor={persistor}>
                    <AppBootstrap />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                </PersistGate>
            </ConnectivityProvider>
        </Provider>
    );
}
