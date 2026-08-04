import React, {ComponentProps, useState} from 'react';
import {Modal, Pressable, useWindowDimensions, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RolesEnum} from '@northernexplorer/types';
import {styles} from '~/layout/Layout/styles';
import {MenuItemDefault} from '~/layout/Layout/components/MenuItemDefault';
import {MenuBranding} from '~/layout/Layout/components/MenuBranding';
import {MenuItemUser} from '~/layout/Layout/components/MenuItemUser';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type Icon = ComponentProps<typeof MenuItemDefault>['icon'];

type MenuItem = {
	label: string;
	route: string;
	icon: Icon;
	role?: RolesEnum;
};

const MENU_ITEMS: MenuItem[] = [
	{label: 'Dashboard', route: '/', icon: 'grid-outline'},
	{label: 'Map', route: '/map', icon: 'map'},
	{label: 'Admin', route: '/admin', icon: 'shield-checkmark', role: RolesEnum.Admin},
];

export function Navigation() {
	const authentication = useAuthentication();
	const {width} = useWindowDimensions();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isMobile = width < 768;

	const renderLinks = (isMobileDrawer = false) => (
		<View style={isMobileDrawer ? styles.drawerLinks : styles.desktopLinks}>
			{MENU_ITEMS.map(item => {
				if (!item.role || authentication?.roles?.includes(item.role)) {
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
				}
				return null;
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
