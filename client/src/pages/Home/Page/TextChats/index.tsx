import { Container, Divider } from "@styles/layout";

import Profile from "./Profile";
import Friends from "./Friends";
import ChatList from "./ChatList";

export const padding = 25;

function TextChats() {
    return (
        <Container
            variant="secondary"
            direction="column"
            justify="start"
            align="start"
            width="460px"
            height="100%"
            gap={0}
        >
            <Profile />
            <Divider
                light={0.08}
                thickness={0.5}
            />
            <Friends />
            <ChatList />
        </Container>
    );
}

export default TextChats;
