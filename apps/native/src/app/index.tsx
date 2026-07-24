import {Layout} from '~/layout/Layout';
import {Home} from '~/layout/Home';

export default function () {
	return <Layout Content={Home} home showOffline />;
}
