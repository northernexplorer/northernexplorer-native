import {Link} from 'expo-router';
import {Pressable, Text, View} from 'react-native';
import React from 'react';
import {ImageView} from '@northernexplorer/tools-web';
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
				<ImageView source={logo} style={isDrawer ? styles.drawerLogo : styles.logo} resizeMode="contain" />
				<View style={styles.brandTextContainer}>
					<Text style={styles.brandText}>Northern Explorer</Text>
					{__DEV__ && <Text style={styles.developmentText}>Development</Text>}
				</View>
			</Pressable>
		</Link>
	);
}
