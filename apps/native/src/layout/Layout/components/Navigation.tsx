import React, {useState} from 'react';
import {View, Pressable, useWindowDimensions, Modal} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '~/layout/Layout/styles';
import {MenuItemDefault} from '~/layout/Layout/components/MenuItemDefault';
import {MenuBranding} from '~/layout/Layout/components/MenuBranding';
import {MenuItemUser} from '~/layout/Layout/components/MenuItemUser';

const MENU_ITEMS = [
	{label: 'Dashboard', route: '/', icon: 'grid-outline' as const},
	{label: 'Map', route: '/map', icon: 'map' as const},
];

export function Navigation() {
	const {width} = useWindowDimensions();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isMobile = width < 768;

	const renderLinks = (isMobileDrawer = false) => (
		<View style={isMobileDrawer ? styles.drawerLinks : styles.desktopLinks}>
			{MENU_ITEMS.map(item => {
				return (
					<MenuItemDefault
						key={item.route}
						route={item.route}
						icon={item.icon}
						isMobileDrawer={isMobileDrawer}
						label={item.label}
						setIsMenuOpen={setIsMenuOpen}
					/>
				);
			})}
		</View>
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
						<MenuBranding setIsMenuOpen={setIsMenuOpen} isDrawer={false} />
						<View style={styles.drawerLinks}>
							<MenuItemUser isMobileDrawer={false} setIsMenuOpen={setIsMenuOpen} />
						</View>
					</>
				) : (
					<>
						{/* --- DESKTOP NAVBAR --- */}
						<MenuBranding setIsMenuOpen={setIsMenuOpen} isDrawer={false} />
						<View style={styles.desktopNavGroup}>
							{renderLinks(false)}
							<View style={styles.desktopLinks}>
								<MenuItemUser isMobileDrawer={false} setIsMenuOpen={setIsMenuOpen} />
							</View>
						</View>
					</>
				)}

				{/* --- MOBILE MODAL SLIDE-OUT DRAWER --- */}
				{isMobile && (
					<Modal visible={isMenuOpen} transparent={true} animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
						<Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)}>
							<SafeAreaView edges={['top']} style={styles.drawerContainer}>
								{/* Drawer Header */}
								<View style={styles.drawerHeader}>
									<MenuBranding setIsMenuOpen={setIsMenuOpen} isDrawer={true} />
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
