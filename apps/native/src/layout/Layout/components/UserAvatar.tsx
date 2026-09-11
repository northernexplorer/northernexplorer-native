import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useApiFetch} from '~/core/useApiFetch';

const AVATAR_COLORS = [
	'#F03C3C',
	'#F04A3C',
	'#F0593C',
	'#F0683C',
	'#F0763C',
	'#F0843C',
	'#F0933C',
	'#F0A23C',
	'#F0B03C',
	'#E5C13C',
	'#A4C43C',
	'#5BBF40',
	'#2EAD67',
	'#21A877',
	'#1CA385',
	'#1CA399',
	'#2596BE',
	'#2E84E5',
	'#3C76F0',
	'#4A5DF0',
	'#593CF0',
	'#6F3CF0',
	'#843CF0',
	'#9A3CF0',
	'#B03CF0',
	'#D03CF0',
	'#F03CB0',
	'#F03C97',
	'#F03C76',
	'#F03C59',
];

const SUBSCRIPTION_TIER_COLORS: Record<string, string> = {
	Core: '#B45309', // Warm Metallic Bronze
	Pathfinder: '#64748B', // Steel Silver
	Trailblazer: '#e1b800', // Rich Gold
	Explorer: '#059669', // Vivid Emerald
	Pioneer: '#DC2626', // Deep Ruby Red
};

const SUBSCRIPTION_BADGE_BG_COLORS: Record<string, string> = {
	Core: '#FEF3C7', // Light Warm Cream / Copper Tint
	Pathfinder: '#F1F5F9', // Bright Ice Silver White
	Trailblazer: '#FEF9C3', // Soft Champagne Gold Glow
	Explorer: '#D1FAE5', // Mint Ice
	Pioneer: '#FEE2E2', // Light Rose Pearl
};

function getHashCode(str: string): number {
	let hash = 0;
	const len = str.length;

	for (let i = 0; i < len; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}

	return hash >>> 0;
}

function generateBackgroundColor(username: string): string {
	const hash = getHashCode(username);
	const index = hash % AVATAR_COLORS.length;

	return AVATAR_COLORS[index];
}

interface Props {
	username: string;
	size?: number;
}

export function UserAvatar(props: Props) {
	const {size = 36, username} = props;

	const {data} = useApiFetch('user', 'UserController', 'getAvatarDetails', {username});

	if (!username) return null;

	const subscriptionLevel = data?.subscriptionLevelName;
	const tierColor = subscriptionLevel && subscriptionLevel !== 'Core' ? SUBSCRIPTION_TIER_COLORS[subscriptionLevel] : undefined;

	const badgeBackgroundColor = (subscriptionLevel && SUBSCRIPTION_BADGE_BG_COLORS[subscriptionLevel]) ?? '#ffffff';

	const backgroundColor = generateBackgroundColor(data?.username || username);
	const initial = (data?.firstName ? data.firstName.charAt(0) : username.charAt(0)).toUpperCase();

	// Scale icon size relative to avatar size
	const iconSize = Math.max(12, Math.round(size * 0.42));
	const badgeWrapperSize = iconSize + 2;

	return (
		<View style={[styles.container, {width: size, height: size}]}>
			<View
				style={[
					styles.avatarCircle,
					{
						backgroundColor,
						width: size,
						height: size,
						borderRadius: size / 2,
					},
				]}
			>
				<Text style={[styles.avatarText, {fontSize: Math.round(size * 0.4)}]}>{initial}</Text>
			</View>

			{tierColor && (
				<View
					style={[
						styles.badgeWrapper,
						{
							backgroundColor: badgeBackgroundColor,
							width: badgeWrapperSize,
							height: badgeWrapperSize,
							borderRadius: badgeWrapperSize / 2,
						},
					]}
				>
					<MaterialCommunityIcons name="star" size={iconSize} color={tierColor} />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	avatarCircle: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		color: '#ffffff',
		fontWeight: '700',
	},
	badgeWrapper: {
		position: 'absolute',
		bottom: -2,
		right: -2,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.25,
		shadowRadius: 1.5,
		elevation: 3,
	},
});
