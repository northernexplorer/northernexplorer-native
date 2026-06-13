import {Home} from "~/home";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {PrivacyPolicy} from "~/pages";

const Stack = createNativeStackNavigator();

export function Layout() {
    const screenName = "Northern Explorer";
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={`${screenName}`} component={Home} />
                <Stack.Screen name={`${screenName} - Privacy Policy`} component={PrivacyPolicy} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}