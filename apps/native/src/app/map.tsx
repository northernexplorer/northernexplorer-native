import {Layout} from '~/layout/Layout';
import {Map, MapSidebar} from '~/location/Map';

export default function () {
	return <Layout Content={Map} fullPage sidebar={[MapSidebar]} />;
}
