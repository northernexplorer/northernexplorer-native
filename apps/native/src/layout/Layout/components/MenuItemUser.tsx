import {Link, usePathname} from 'expo-router';
import {Pressable, StyleSheet, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {styles} from '~/layout/Layout/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {UserAvatar} from '~/layout/Layout/components/UserAvatar';

export function MenuItemUser() {
	const currentPath = usePathname();
	const isActiveProfile = currentPath.includes('/profile');
	const isActiveLogout = currentPath.includes('/logout');
	const authentication = useAuthentication();

	const isLoggedIn = !!(authentication?.username && authentication.accessToken);
	const profileHref = isLoggedIn ? `/profile/${authentication.username}` : '/profile/login';
	const logoutHref = isLoggedIn ? `/profile/${authentication.username}/logout` : '/profile/logout';

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			{!isLoggedIn && (
				<Link href={profileHref} asChild>
					<Pressable style={StyleSheet.flatten([styles.menuItem, isActiveProfile && !isActiveLogout && styles.activeItem])}>
						<Ionicons name="log-in" size={18} color="#d9d9d9" />
					</Pressable>
				</Link>
			)}

			{isLoggedIn && (
				<Link href={profileHref} asChild>
					<Pressable style={StyleSheet.flatten([styles.menuItemAvatar, isActiveProfile && !isActiveLogout && styles.activeItemAvatar])}>
						<UserAvatar size={30} username={authentication.username} />
					</Pressable>
				</Link>
			)}
			{isLoggedIn && (
				<Link href={logoutHref} asChild>
					<Pressable style={StyleSheet.flatten([styles.menuItem, isActiveLogout && styles.activeItem])}>
						<Ionicons name="log-out" size={18} color={isActiveLogout ? 'white' : 'rgba(255,100,100,0.6)'} />
					</Pressable>
				</Link>
			)}
		</View>
	);
}
