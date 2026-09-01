import {Layout} from '~/layout/Layout';
import {Signal} from '~/location/Signal';

export default function () {
	return <Layout Content={Signal} showOffline title="Signal Report" />;
}
