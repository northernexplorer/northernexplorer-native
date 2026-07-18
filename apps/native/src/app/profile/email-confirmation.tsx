import {Layout} from '~/layout/Layout';
import {EmailConfirmation} from '~/user/EmailConfirmation';

export default function () {
	return <Layout Content={EmailConfirmation} title="You have been sent an email." />;
}
