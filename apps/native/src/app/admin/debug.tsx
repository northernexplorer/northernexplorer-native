import {Layout} from '~/layout/Layout';
import {AdminSidebar} from '~/system/AdminSidebar';
import {Debug} from '~/system/Debug';

export default function () {
	return <Layout Content={Debug} title="Debug" subtitle="Server Diagnostics & Web Environment" sidebar={[AdminSidebar]} />;
}
