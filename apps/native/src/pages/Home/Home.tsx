import { View, ActivityIndicator, useWindowDimensions, Text, ScrollView } from 'react-native';
import { Weather } from './components/Weather';
import { Forecast } from './components/Forecast';
import { Lunar } from './components/Lunar';
import { FieldNote } from './components/FieldNote';

import { useWeather } from '~/state/hooks/weather/useWeather';
import { useForecast } from '~/state/hooks/forecast/useForecast';
import { useLunar } from '~/state/hooks/lunar/useLunar';
import { useFieldNote } from '~/state/hooks/fieldNote/useFieldNote';
import { styles } from '~/pages/Home/styles';
import { HistoricSitePreview } from '~/pages/Home/components/HistoricSitePreview';
import { useClosestHistoricSites } from '~/hooks/useClosestHistoricSites';

export function Home() {
  const weather = useWeather();
  const forecast = useForecast();
  const lunar = useLunar();
  const fieldNote = useFieldNote();
  const historicSites = useClosestHistoricSites();
  const { width } = useWindowDimensions();
  const isMobileView = width < 1000;

  const isReady = !!weather && !!forecast && !!lunar && !!fieldNote && !!historicSites;

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

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
      <Text style={styles.exploreHeader}>Plan Ahead...</Text>
      <View style={styles.forecastSection}>
        <Forecast data={forecast} />
      </View>
      <Text style={styles.exploreHeader}>Start Exploring...</Text>
      <View style={styles.historicSitesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {historicSites.sites.map((site) => (
            <HistoricSitePreview
              key={site.name}
              name={site.name}
              description={site.description}
              image={site.image}
              country={site.country}
              region={site.region}
              id={site.id}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}
