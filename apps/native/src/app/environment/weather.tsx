import {Layout} from '~/layout/Layout';
import {Weather} from '~/environment/Weather';

export default function () {
	return <Layout Content={Weather} title="Weather" />;
}
