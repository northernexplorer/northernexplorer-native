import { ComponentType } from 'react';
import { ImageBackground, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { styles } from './styles';
import { getWeatherTheme } from '~/layout/getWeatherTheme';
import { useWeather } from '~/state/slices/weather/useWeather';
import { Sidebar } from '~/layout/components/Sidebar';
import { Navigation } from '~/layout/components/Navigation';

interface Props {
  Content: ComponentType;
  components?: ComponentType[];
  title?: string;
  fullPage?: boolean;
  home?: boolean;
}

export function Layout({ Content, components, title, fullPage, home }: Props) {
  const { width } = useWindowDimensions();
  const isMobileView = width < 1000;

  const weather = useWeather();
  const theme = weather ? getWeatherTheme(weather.current.condition.code) : null;

  return (
    <View style={{ flex: 1 }}>
      <Navigation />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.page,
          {
            flexDirection: isMobileView ? 'column' : 'row',
          },
        ]}
      >
        <View style={{ flex: 1, width: '100%', alignSelf: 'stretch' }}>
          <ImageBackground
            style={[styles.background, { alignSelf: 'stretch' }]}
            source={home ? theme?.image : undefined}
            imageStyle={{
              width: '100%',
              height: '100%',
            }}
          >
            {home && <View pointerEvents="none" style={styles.darkOverlay} />}

            <View
              style={{
                flex: 1,
                padding: fullPage ? 0 : 10,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {title && (
                <Text
                  style={[
                    home ? styles.titleHome : styles.title,
                    fullPage && { paddingHorizontal: 10, paddingTop: 10 },
                  ]}
                >
                  {title}
                </Text>
              )}

              <View style={{ flexGrow: 1, display: 'flex', width: '100%' }}>
                <Content />
              </View>
            </View>
          </ImageBackground>
        </View>

        <View
          style={[
            styles.sidebar,
            isMobileView ? styles.sidebarMobile : [styles.sidebarDesktop, { alignSelf: 'stretch' }],
          ]}
        >
          <Sidebar components={components} />
        </View>
      </ScrollView>
    </View>
  );
}
