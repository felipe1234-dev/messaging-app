import { Columns } from "@styles/layout";
import { useAuth } from "@providers";
import { useTabs, useChatWindow } from "../providers";

import Sidebar from "./Sidebar";
import TextChats from "./TextChats";
import FriendRequests from "./FriendRequests";
import ChatWindow from "./ChatWindow";
import NoChat from "./NoChat";

function Page() {
    const { user } = useAuth();
    const { tab } = useTabs();
    const { chatWindow } = useChatWindow();

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
            {tab === "textChats" && <TextChats />}
            {tab === "friendRequests" && <FriendRequests />}
            {chatWindow ? <ChatWindow /> : <NoChat />}
        </Columns>
    );
}

export default Page;
