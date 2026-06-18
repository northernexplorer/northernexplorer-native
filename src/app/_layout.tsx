import { Stack } from "expo-router";
import {Provider} from "react-redux";
import {store} from "~/state";
import {AppBootstrap} from "~/layout/components/Boostrap";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Layout() {
    return (
        <Provider store={store}>
            <AppBootstrap />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </Provider>
    );
}