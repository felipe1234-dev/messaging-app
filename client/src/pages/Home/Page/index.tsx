import { Columns } from "@styles/layout";
import { useAuth } from "@providers";

import Sidebar from "./Sidebar";
import Chats from "./Chats";

function Page() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Columns align="start" justify="start" gap={0}>
            <Sidebar />
            <Chats />
        </Columns>
    );
}

export default Page;