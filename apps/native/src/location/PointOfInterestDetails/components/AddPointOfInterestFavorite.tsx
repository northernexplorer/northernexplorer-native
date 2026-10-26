import {Pressable, GestureResponderEvent, StyleSheet, Text, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useEffect, useRef, useState} from 'react';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type PoiProps = {
	pointOfInterestId: string;
};

export function AddNewPointOfInterestFavorite({pointOfInterestId}: PoiProps) {
	const authentication = useAuthentication();
	const [favorited, setIsFavorited] = useState<boolean>(false);
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const {mutate: unfavoriteMutation} = useApiMutation('location', 'PointOfInterestController', 'unmarkPointOfInterestFavorite');
	const {mutate: favoriteMutation} = useApiMutation('location', 'PointOfInterestController', 'createPointOfInterestFavorite');

	const {data: isFavorited, refetch: refetchFavoritedState} = useApiFetch('location', 'PointOfInterestController', 'isPointOfInterestFavorite', {
		id: pointOfInterestId,
	});

	useEffect(() => {
		setIsFavorited(Boolean(isFavorited?.Favorited));
	}, [isFavorited]);

	const toggleFavorite = async (e: GestureResponderEvent) => {
		e.stopPropagation();

		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.9,
				duration: 80,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				friction: 4,
				tension: 120,
				useNativeDriver: true,
			}),
		]).start();

		const nextState = !favorited;
		setIsFavorited(nextState);

		try {
			if (favorited) {
				await unfavoriteMutation({id: pointOfInterestId});
			} else {
				await favoriteMutation({id: pointOfInterestId});
			}
		} catch {
			setIsFavorited(favorited);
		}

		await refetchFavoritedState();
	};

	if (!authentication?.userId) {
		return null;
	}

	return (
		<Animated.View style={{transform: [{scale: scaleAnim}]}}>
			<Pressable
				onPress={toggleFavorite}
				style={({pressed}) => [styles.favoriteButton, favorited && styles.favoriteButtonActive, pressed && styles.favoriteButtonPressed]}
				hitSlop={6}
				accessibilityRole="button"
				accessibilityLabel={favorited ? 'Remove from favorites' : 'Add to favorites'}
				accessibilityState={{selected: favorited}}
			>
				<Ionicons name={favorited ? 'star' : 'star-outline'} size={16} color={favorited ? '#f59e0b' : '#64748b'} style={styles.icon} />
				<Text style={[styles.favoriteButtonText, favorited && styles.favoriteButtonTextActive]}>{favorited ? 'Favorited' : 'Favorite'}</Text>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	favoriteButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	favoriteButtonActive: {
		backgroundColor: '#fffbeb',
		borderColor: '#fde68a',
	},
	favoriteButtonPressed: {
		opacity: 0.75,
	},
	icon: {
		marginRight: 4,
	},
	favoriteButtonText: {
		color: '#64748b',
		fontWeight: '600',
		fontSize: 13,
	},
	favoriteButtonTextActive: {
		color: '#b45309',
	},
});
