import { ComponentType } from "react";
import {
    ImageBackground,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { styles } from "./styles";
import {getWeatherTheme} from "~/pages/Home/lib/getWeatherTheme";
import {useWeather} from "~/state/hooks/weather/useWeather";

interface Props {
    Content: ComponentType;
    Sidebar?: ComponentType;
    title?: string;
}

export function PageWrapper({ Content, Sidebar, title }: Props) {
    const { width } = useWindowDimensions();
    const isMobileView = width < 1000;

    const weather = useWeather();

    const weatherMain = weather?.weather?.[0]?.main;
    const theme = weatherMain ? getWeatherTheme(weatherMain) : null;

    return (
        <ImageBackground style={styles.background}  source={theme?.image ? { uri: theme.image } : undefined}>
            <View style={styles.darkOverlay} />
            <View style={styles.vignette} />

            <ScrollView
                contentContainerStyle={[
                    styles.page,
                    {
                        flexDirection: isMobileView ? "column" : "row",
                    },
                ]}
            >
                <View style={styles.main}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    <Content />
                </View>

                {Sidebar && (
                    <View style={styles.sidebar}>
                        <Sidebar />
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );
}