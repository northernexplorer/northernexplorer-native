import {PageWrapper} from "~/layout";
import {Home} from "~/pages/Home";
import {HomeSidebar} from "~/pages/Home/HomeSidebar";

export default function Page() {
    return <PageWrapper Content={Home} Sidebar={HomeSidebar} />;
}