import {Layout} from '~/layout/Layout';
import {Admin} from '~/system/Admin';

export default function () {
	return <Layout Content={Admin} title="Admin Dashboard" subtitle="System Overview & Overview Metrics" />;
}
