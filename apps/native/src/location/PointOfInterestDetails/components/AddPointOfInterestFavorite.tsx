import {Pressable, GestureResponderEvent} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useEffect, useState} from 'react';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
type PoiProps = {
	pointOfInterestId: string;
};

export default function AddNewPointOfInterestFavorite({pointOfInterestId}: PoiProps) {
	const authentication = useAuthentication();
	const [favorited, setIsFavorited] = useState<boolean>(false);

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

		const nextState = !favorited;
		setIsFavorited(nextState);

		if (favorited) {
			await unfavoriteMutation({id: pointOfInterestId});
		} else {
			await favoriteMutation({id: pointOfInterestId});
		}

		await refetchFavoritedState();
	};

	return (
		<>
			{authentication?.userId && (
				<Pressable onPress={toggleFavorite}>
					<Ionicons name={favorited ? 'star' : 'star-outline'} size={40} color={favorited ? '#d8db14' : '#ffffff'} />
				</Pressable>
			)}
		</>
	);
}
