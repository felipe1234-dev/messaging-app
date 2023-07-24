import { useState } from "react";
import { Container } from "@styles/layout";
import { Input, ChatCard } from "@components";
import { useChats } from "@providers";
import { useChatWindow } from "@pages/Home/providers";
import { SearchAlt2 } from "@styled-icons/boxicons-regular";

function Directs() {
    const [search, setSearch] = useState("");
    const { chats } = useChats();
    const { chatWindow, openChatWindow } = useChatWindow();

    return (
        <Container
            transparent
            direction="column"
            justify="start"
            align="center"
            width="363px"
            gap={25}
            p={0}
        >
            <Input
                variant="secondary"
                leftIcon={<SearchAlt2 />}
                placeholder="People, messages and groups"
                onChange={(evt) => setSearch(evt.target.value)}
                value={search}
                light={0.05}
            />

            {chats
                .filter((chat) => {
                    return JSON.stringify(chat)
                        .toLowerCase()
                        .includes(search.toLowerCase());
                })
                .map((chat) => (
                    <ChatCard
                        key={chat.uid}
                        chat={chat}
                        onClick={() => openChatWindow(chat)}
                        selected={chat.uid === chatWindow?.uid}
                    />
                ))}
        </Container>
    );
}

export default Directs;
