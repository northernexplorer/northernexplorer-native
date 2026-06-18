import { ComponentType } from "react";
import {
    ImageBackground,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { styles } from "./styles";
import {getWeatherTheme} from "~/layout/getWeatherTheme";
import {useWeather} from "~/state/hooks/weather/useWeather";
import {Sidebar} from "~/layout/Sidebar";
import {getImagePath} from "~/lib/getImagePath";

interface Props {
    Content: ComponentType;
    components?: ComponentType[];
    title?: string;
}

export function PageWrapper({ Content, components, title }: Props) {
    const { width } = useWindowDimensions();
    const isMobileView = width < 1000;

    const weather = useWeather();
    const theme = weather ? getWeatherTheme(weather.current.condition.code) : null;

    return (
        <ImageBackground style={styles.background}  source={theme?.image ? { uri: getImagePath(theme.image) } : undefined}>
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
                <View style={styles.sidebar}>
                    <Sidebar components={components} />
                </View>
            </ScrollView>
        </ImageBackground>
    );
}