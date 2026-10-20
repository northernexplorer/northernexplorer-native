import {useLocalSearchParams} from 'expo-router';
import {Layout} from '~/layout/Layout';
import {DestinationList} from '~/location/DestinationList/DestinationList';

export default function DestinationsPage() {
	const params = useLocalSearchParams<{sort?: string}>();
	const title = params.sort === 'newest' ? 'Newest Locations' : 'Nearby Destinations';
	const subtitle = params.sort === 'newest' ? 'Explore recently added places' : 'Explore destinations close to you';

	return <Layout Content={DestinationList} title={title} subtitle={subtitle} />;
}
