import {Layout} from '~/layout/Layout';
import {Logout} from '~/user/Logout';

export default function () {
	return <Layout Content={Logout} title="Logged Out" />;
}
