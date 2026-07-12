import {Link, usePathname} from 'expo-router';
import {Pressable, StyleSheet, Text} from 'react-native';
import {styles} from '~/layout/Layout/styles';
import {Ionicons} from '@expo/vector-icons';
import React, {ComponentProps} from 'react';

interface Props {
	route: string;
	icon: ComponentProps<typeof Ionicons>['name'];
	label: string;
	isMobileDrawer: boolean;
	setIsMenuOpen: (isOpen: boolean) => void;
}

export function MenuItemDefault({route, icon, isMobileDrawer, label, setIsMenuOpen}: Props) {
	const currentPath = usePathname();
	const isActive = currentPath === route;

	return (
		<Link href={route} asChild>
			<Pressable
				onPress={() => setIsMenuOpen(false)}
				style={StyleSheet.flatten([styles.menuItem, isActive && styles.activeItem, isMobileDrawer && styles.drawerMenuItem])}
			>
				<Ionicons name={icon} size={isMobileDrawer ? 20 : 18} color={isActive ? 'white' : 'rgba(255,255,255,0.6)'} />
				<Text style={StyleSheet.flatten([styles.menuText, isActive && styles.activeText, isMobileDrawer && styles.drawerMenuText])}>
					{label}
				</Text>
			</Pressable>
		</Link>
	);
}
