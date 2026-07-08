import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { styles } from '~/layout/Layout/styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';

interface Props {
    isMobileDrawer: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

export function MenuItemUser({ isMobileDrawer, setIsMenuOpen }: Props) {
    const currentPath = usePathname();
    const isActive = currentPath.includes('/profile');
    const authentication = useAuthentication();

    return (
        <Link href={authentication ? `profile/${authentication.userId}` : 'profile/login'} asChild>
            <Pressable
                onPress={() => setIsMenuOpen(false)}
                style={StyleSheet.flatten([
                    styles.menuItem,
                    isActive && styles.activeItem,
                    isMobileDrawer && styles.drawerMenuItem,
                ])}
            >
                <Ionicons
                    name="person-circle-outline"
                    size={isMobileDrawer ? 20 : 18}
                    color={isActive ? 'white' : 'rgba(255,255,255,0.6)'}
                />
            </Pressable>
        </Link>
    );
}
