import {Layout} from '~/layout/Layout';
import {Forecast} from '~/environment/Forecast';

export default function () {
    return <Layout Content={Forecast} title="Forecast" />;
}
