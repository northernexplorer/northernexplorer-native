import React, { useState } from 'react';
import { View, Text, Pressable, Image, useWindowDimensions, Modal, StyleSheet } from 'react-native';
import { useRouter, usePathname, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '~/layout/styles';
import { getImagePath } from '~/lib/getImagePath';

const MENU_ITEMS = [
  { label: 'Dashboard', route: '/', icon: 'grid-outline' as const },
  { label: 'Map', route: '/map', icon: 'map' as const },
];

export function Navigation() {
  const router = useRouter();
  const currentPath = usePathname();
  const { width } = useWindowDimensions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMobile = width < 768;

  const handleNavigate = (route: string) => {
    setIsMenuOpen(false);
    router.push(route);
  };

  const renderLinks = (isMobileDrawer = false) => (
    <View style={isMobileDrawer ? styles.drawerLinks : styles.desktopLinks}>
      {MENU_ITEMS.map((item) => {
        const isActive = currentPath === item.route;

        return (
          <Link key={item.route} href={item.route} asChild>
            <Pressable
              onPress={() => handleNavigate(item.route)}
              style={StyleSheet.flatten([
                styles.menuItem,
                isActive && styles.activeItem,
                isMobileDrawer && styles.drawerMenuItem,
              ])}
            >
              <Ionicons
                name={item.icon}
                size={isMobileDrawer ? 20 : 18}
                color={isActive ? 'white' : 'rgba(255,255,255,0.6)'}
              />
              <Text
                style={StyleSheet.flatten([
                  styles.menuText,
                  isActive && styles.activeText,
                  isMobileDrawer && styles.drawerMenuText,
                ])}
              >
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );

  const Branding = ({ isDrawer = false }) => (
    <Link href="/" asChild>
      <Pressable onPress={() => setIsMenuOpen(false)} style={styles.brandContainer}>
        <Image
          source={{ uri: getImagePath('/images/logo.png') }}
          style={isDrawer ? styles.drawerLogo : styles.logo}
        />
        <Text style={styles.brandText}>Northern Explorer</Text>
      </Pressable>
    </Link>
  );

  const MainContainer = isMobile ? SafeAreaView : View;

  return (
    <MainContainer edges={['top']} style={styles.navbarContainer}>
      <View style={[styles.navbar, isMobile ? styles.mobileNavbar : styles.desktopNavbar]}>
        {isMobile ? (
          <>
            {/* --- MOBILE NAVBAR --- */}
            <Pressable onPress={() => setIsMenuOpen(true)} style={styles.hamburger}>
              <Ionicons name="menu-outline" size={28} color="white" />
            </Pressable>

            <Branding />

            {/* Balance spacer for perfect centering layout alignments */}
            <View style={{ width: 28 }} />
          </>
        ) : (
          <>
            {/* --- DESKTOP NAVBAR --- */}
            <Branding />
            {renderLinks(false)}
          </>
        )}

        {/* --- MOBILE MODAL SLIDE-OUT DRAWER --- */}
        {isMobile && (
          <Modal
            visible={isMenuOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsMenuOpen(false)}
          >
            <Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)}>
              <SafeAreaView edges={['top']} style={styles.drawerContainer}>
                {/* Drawer Header */}
                <View style={styles.drawerHeader}>
                  <Branding isDrawer={true} />

                  <Pressable onPress={() => setIsMenuOpen(false)}>
                    <Ionicons name="close-outline" size={28} color="white" />
                  </Pressable>
                </View>

                {/* Menu Links List */}
                {renderLinks(true)}
              </SafeAreaView>
            </Pressable>
          </Modal>
        )}
      </View>
    </MainContainer>
  );
}
