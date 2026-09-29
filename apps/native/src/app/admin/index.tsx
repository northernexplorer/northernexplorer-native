import {Layout} from '~/layout/Layout';
import {Admin} from '~/system/Admin';
import {AdminSidebar} from '~/system/AdminSidebar';

export default function () {
	return <Layout Content={Admin} title="Admin Dashboard" subtitle="System Overview & Overview Metrics" sidebar={[AdminSidebar]} />;
}
