import { Columns, Column, Container } from "@styles/layout";
import { useAuth } from "@providers";

import LeftColumn from "./LeftColumn";
import Sidebar from "./Sidebar";

function Page() {
    const { user } = useAuth();

    if (!user) return <></>;

    return (
        <Columns align="start" justify="start">
            <Sidebar />
        </Columns>
    );
}

export default Page;