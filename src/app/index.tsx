import { Stack } from "expo-router";
import {Home} from "../home";
import Head from "expo-router/head";

export default function Index() {
    const displayTitle = 'Northern Explorer';

    return (
        <>
            <Head>
                <title>{displayTitle}</title>
                <meta name="description" content="Local weather insights." />
            </Head>

            {/* Controls the Header Title Bar on iOS & Android */}
            <Stack.Screen options={{ title: displayTitle }} />

            <Home />
        </>
    );
}