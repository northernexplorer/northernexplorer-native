import {View, ActivityIndicator, useWindowDimensions, Text, ScrollView} from "react-native";
import { Weather } from "./components/Weather";
import { Forecast } from "./components/Forecast";
import { Lunar } from "./components/Lunar";
import { FieldNote } from "./components/FieldNote";

import { useWeather } from "~/state/hooks/weather/useWeather";
import { useForecast } from "~/state/hooks/forecast/useForecast";
import { useLunar } from "~/state/hooks/lunar/useLunar";
import { useFieldNote } from "~/state/hooks/fieldNote/useFieldNote";
import {styles} from "~/pages/Home/lib/styles";
import {HistoricSitePreview} from "~/pages/Home/components/HistoricSitePreview";

export function Home() {
    const weather = useWeather();
    const forecast = useForecast();
    const lunar = useLunar();
    const fieldNote = useFieldNote();
    const { width } = useWindowDimensions();
    const isMobileView = width < 1000;

    const isReady =
        weather &&
        forecast &&
        lunar &&
        fieldNote;

    if (!isReady) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    const historicSites = [
        {
            name: "Lower Fort Garry",
            description: "A preserved 19th-century fur trading post on the Red River.",
            image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Lower_Fort_Garry.jpg"
        },
        {
            name: "St. Boniface Cathedral",
            description: "Historic cathedral and cultural landmark in Manitoba.",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/St_Boniface_Cathedral_ruins.jpg"
        },
        {
            name: "Riel House",
            description: "Home of the Riel family and key Métis heritage site.",
            image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Riel_House.jpg"
        }
    ];

    return (
        <>
            {isMobileView ? (
                <>
                    <View style={styles.mobileHeroRow}>
                        <View style={styles.weatherSection}>
                            <Weather data={weather} />
                        </View>

                        <View style={styles.mobileLunarSection}>
                            <Lunar data={lunar} />
                        </View>
                    </View>

                    <View style={styles.mobileFieldNoteSection}>
                        <FieldNote data={fieldNote} />
                    </View>
                </>
            ) : (
                <View style={styles.heroRow}>
                    <View style={styles.weatherSection}>
                        <Weather data={weather} />
                    </View>

                    <View style={styles.fieldNote}>
                        <FieldNote data={fieldNote} />
                    </View>

                    <View style={styles.lunarSection}>
                        <Lunar data={lunar} />
                    </View>
                </View>
            )}

            <Text style={styles.exploreHeader}>
                Plan Ahead...
            </Text>
            <View style={styles.forecastSection}>
                <Forecast data={forecast} />
            </View>
            <Text style={styles.exploreHeader}>
                Start Exploring...
            </Text>
            <View style={styles.historicSitesSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {historicSites.map((site) => (
                        <HistoricSitePreview
                            key={site.name}
                            name={site.name}
                            description={site.description}
                            image={site.image}
                        />
                    ))}
                </ScrollView>
            </View>
        </>
    );
}