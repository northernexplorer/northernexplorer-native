import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '~/core/store';
import { PersistGate } from 'redux-persist/integration/react';
import { AppBootstrap } from '~/layout/Layout/components/Boostrap';

export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppBootstrap />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </PersistGate>
    </Provider>
  );
}
