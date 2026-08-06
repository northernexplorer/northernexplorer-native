import {Layout} from '~/layout/Layout';
import {AllUsers} from '~/user/AllUsers';

export default function () {
	return <Layout Content={AllUsers} title="Users" />;
}
