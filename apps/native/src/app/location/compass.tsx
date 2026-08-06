import {Layout} from '~/layout/Layout';
import {Compass} from '~/location/Compass';

export default function () {
	return <Layout Content={Compass} showOffline />;
}
