import { useState } from "react";
import { Container } from "@styles/layout";
import { Input, ChatCard } from "@components";
import { useChats } from "@providers";
import { SearchAlt2 } from "@styled-icons/boxicons-regular";

function Directs() {
    const [search, setSearch] = useState("");
    const { chats } = useChats();

    return (
        <Container
            direction="column"
            justify="start"
            align="center"
            width="123%"
            gap={5}
            p={0}
        >
            <Input
                variant="secondary"
                leftIcon={<SearchAlt2 />}
                placeholder="Search"
                onChange={(evt) => setSearch(evt.target.value)}
                value={search}
                light={0.2}
            />

            {chats.map((chat) => (
                <ChatCard
                    key={chat.uid}
                    members={chat.members}
                    lastMessage={chat.getLastMessage()}
                />
            ))}
        </Container>
    );
}

export default Directs;
