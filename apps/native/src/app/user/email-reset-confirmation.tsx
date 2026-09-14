import {Layout} from '~/layout/Layout';
import {EmailResetConfirmation} from '~/user/EmailResetConfirmation';

export default function () {
	return <Layout Content={EmailResetConfirmation} title="You have been sent an email." />;
}
