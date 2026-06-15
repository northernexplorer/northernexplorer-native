import { Home } from "~/home";
import {PageWrapper} from "~/layout";
import {PrivacyPolicy} from "~/pages";
import {HomeSidebar} from "~/home/HomeSidebar";

export default function Page() {
    return <PageWrapper Content={Home} Sidebar={HomeSidebar} />;
}