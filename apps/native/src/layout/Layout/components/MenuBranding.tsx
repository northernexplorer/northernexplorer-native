import {Link} from 'expo-router';
import {Image, Pressable, Text} from 'react-native';
import React from 'react';
import logo from '../../../../assets/images/logo.png';
import {styles} from '~/layout/Layout/styles';

interface Props {
	isDrawer: boolean;
	setIsMenuOpen: (isOpen: boolean) => void;
}

export function MenuBranding({isDrawer, setIsMenuOpen}: Props) {
	return (
		<Link href="/" asChild>
			<Pressable onPress={() => setIsMenuOpen(false)} style={styles.brandContainer}>
				<Image source={logo} style={isDrawer ? styles.drawerLogo : styles.logo} resizeMode="contain" />
				<Text style={styles.brandText}>Northern Explorer</Text>
			</Pressable>
		</Link>
	);
}
