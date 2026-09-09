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
	Core: '#d19462', // Bronze
	Pathfinder: '#c0c9d5', // Silver
	Trailblazer: '#b99210', // Gold
	Explorer: '#10b3b9', // Cyan / Diamond
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
	const {data: subscriptionData, loading: subscriptionLoading} = useApiFetch('user', 'SubscriptionController', 'getByUsername', {username});

	if (!userData || userLoading) return null;
	if (!subscriptionData || subscriptionLoading) return null;

	const subscriptionLevel = subscriptionData.subscriptionLevel.name;
	const tierColor = subscriptionLevel ? SUBSCRIPTION_TIER_COLORS['Core'] : undefined;
	const backgroundColor = generateBackgroundColor(userData.username);
	const initial = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '?';

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
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.25,
		shadowRadius: 1.5,
		elevation: 3,
	},
});
