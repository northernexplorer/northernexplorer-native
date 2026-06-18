import {PageWrapper} from "~/layout";
import {PrivacyPolicy} from "~/pages/PrivacyPolicy";
import {HistoricSiteDetails} from "~/pages/HistoricSiteDetails";

export default function Page() {
    return <PageWrapper Content={HistoricSiteDetails} title="Historic Site" />;
}