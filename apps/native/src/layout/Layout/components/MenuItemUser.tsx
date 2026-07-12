import {Link, usePathname} from 'expo-router';
import {Pressable, StyleSheet, View} from 'react-native';
import {styles} from '~/layout/Layout/styles';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

interface Props {
	isMobileDrawer: boolean;
	setIsMenuOpen: (isOpen: boolean) => void;
}

export function MenuItemUser({isMobileDrawer, setIsMenuOpen}: Props) {
	const currentPath = usePathname();
	const isActiveProfile = currentPath.includes('/profile');
	const isActiveLogout = currentPath.includes('/logout');
	const authentication = useAuthentication();

	const isLoggedIn = !!(authentication?.username && authentication?.accessToken);
	const profileHref = isLoggedIn ? `/profile/${authentication.username}` : '/profile/login';
	const logoutHref = isLoggedIn ? `/profile/${authentication.username}/logout` : '/profile/logout';

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<Link href={profileHref} asChild>
				<Pressable
					onPress={() => setIsMenuOpen(false)}
					style={StyleSheet.flatten([
						styles.menuItem,
						isActiveProfile && !isActiveLogout && styles.activeItem,
						isMobileDrawer && styles.drawerMenuItem,
					])}
				>
					<Ionicons
						name={isLoggedIn ? 'person-circle-outline' : 'log-in'}
						size={isMobileDrawer ? 20 : 18}
						color={isLoggedIn ? 'rgba(100,255,100,0.6)' : 'rgba(255,255,255,0.6)'}
					/>
				</Pressable>
			</Link>

			{isLoggedIn && (
				<Link href={logoutHref} asChild>
					<Pressable
						onPress={() => setIsMenuOpen(false)}
						style={StyleSheet.flatten([styles.menuItem, isActiveLogout && styles.activeItem, isMobileDrawer && styles.drawerMenuItem])}
					>
						<Ionicons name="log-out" size={isMobileDrawer ? 20 : 18} color={isActiveLogout ? 'white' : 'rgba(255,100,100,0.6)'} />
					</Pressable>
				</Link>
			)}
		</View>
	);
}
