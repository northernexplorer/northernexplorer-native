import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Link} from 'expo-router';
import {styles} from '~/layout/Layout/styles';

interface MenuItem {
	label: string;
	href: string;
}

interface FooterProps {
	items?: MenuItem[];
}

export function Footer({items}: FooterProps) {
	const insets = useSafeAreaInsets();

	const defaultItems: MenuItem[] = [
		{label: 'Privacy Policy', href: '/support/privacy-policy'},
		{label: 'Terms of Service', href: '/support/terms-of-service'},
		{label: 'Code of Conduct', href: '/support/explorers-code-of-conduct'},
		{label: 'Support', href: '/support'},
	];

	const menuItems = items || defaultItems;

	return (
		<View style={[styles.footerContainer, {paddingBottom: (insets.bottom || 0) + 16}]}>
			{/* Footer Navigation Links */}
			<View style={styles.footerLinks}>
				{menuItems.map((item, index) => (
					<Link key={index} href={item.href}>
						<Text style={styles.menuText}>{item.label}</Text>
					</Link>
				))}
			</View>

			{/* Copyright Note */}
			<Text style={styles.subtitle}>© {new Date().getFullYear()} Northern Explorer. All rights reserved.</Text>
		</View>
	);
}
