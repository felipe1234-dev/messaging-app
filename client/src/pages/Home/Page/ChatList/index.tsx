import { Container, Divider } from "@styles/layout";

import Profile from "./Profile";
import Friends from "./Friends";
import Chats from "./Chats";

export const padding = 25;

function ChatList() {
    return (
        <Container
            variant="secondary"
            direction="column"
            justify="start"
            align="start"
            width="fit-content"
            height="100%"
            gap={0}
        >
            <Profile />
            <Divider
                light={0.08}
                thickness={0.5}
            />
            <Friends />
            <Chats />
        </Container>
    );
}

export default ChatList;
