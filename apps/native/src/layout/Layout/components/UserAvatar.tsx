import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
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
	Core: '#CD7F32', // Bronze
	Pathfinder: '#C0C0C0', // Silver
	Trailblazer: '#FFD700', // Gold
	Explorer: '#00F0FF', // Cyan / Platinum Diamond
	Pioneer: '#10B981', // Imperial Emerald
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
	if (!username) return AVATAR_COLORS[0];

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

	const {data: userData, loading: userLoading} = useApiFetch('user', 'UserController', 'getByUsername', {username});

	const {data: subscriptionData} = useApiFetch('user', 'SubscriptionController', 'getByUsername', {username});

	if (!userData || userLoading) return null;

	const subscriptionLevel = subscriptionData?.subscriptionLevel.name;
	const outlineColor = subscriptionLevel ? SUBSCRIPTION_TIER_COLORS[subscriptionLevel] : undefined;
	const backgroundColor = generateBackgroundColor(userData.username);
	const initial = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '?';

	const borderWidth = outlineColor ? Math.max(2, Math.round(size * 0.06)) : 0;

	return (
		<View
			style={[
				styles.avatarCircle,
				{
					backgroundColor,
					width: size,
					height: size,
					borderRadius: size / 2,
					borderColor: outlineColor || 'transparent',
					borderWidth: borderWidth,
				},
			]}
		>
			<Text style={[styles.avatarText, {fontSize: Math.round(size * 0.4)}]}>{initial}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	avatarCircle: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		color: '#ffffff',
		fontWeight: '700',
	},
});
