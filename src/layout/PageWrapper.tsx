import { ComponentType } from "react";
import {
    ImageBackground,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { styles } from "./styles";
import { useLocation } from "~/home/hooks/useLocation";
import { useWeather } from "~/home/hooks/useWeather";
import { getWeatherTheme } from "~/home/lib/getWeatherTheme";

interface Props {
    Content: ComponentType;
    Sidebar?: ComponentType;
    title?: string;
}

export function PageWrapper({
                                Content,
                                Sidebar,
                                title,
                            }: Props) {
    const { width } = useWindowDimensions();
    const isMobileView = width < 1000;

    const coords = useLocation();
    const weather = useWeather(coords?.lat, coords?.lon);

    const theme = weather
        ? getWeatherTheme(weather.weather[0].main)
        : null;

    const Container = isMobileView ? ScrollView : View;

    return (
        <ImageBackground
            source={theme?.image ? { uri: theme.image } : undefined}
            style={styles.background}
        >
            <View style={styles.darkOverlay} />
            <View style={styles.vignette} />

            <Container
                style={[
                    styles.page,
                    {
                        flexDirection: isMobileView
                            ? "column"
                            : "row",
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
            </Container>
        </ImageBackground>
    );
}