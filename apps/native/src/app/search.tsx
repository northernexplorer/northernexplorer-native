import {Layout} from '~/layout/Layout';
import {Search, SearchSidebar} from '~/location/Search';

export default function () {
	return <Layout Content={Search} title="Search Destinations" sidebar={[SearchSidebar]} />;
}
