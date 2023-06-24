import { Container, Columns } from "@styles/layout";
import { useAuth } from "@providers";

import Sidebar from "./Sidebar";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

function Page() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Columns
            justify="start"
            align="start"
            height="100vh"
            width="100vw"
            gap={0}
        >
            <Sidebar />
            <ChatList />
            <ChatWindow />
        </Columns>
    );
}

export default Page;
