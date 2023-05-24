import { Container, Divider } from "@styles/layout";

import Profile from "./Profile";
import Friends from "./Friends";

function Chats() {
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
        </Container>
    );
}

export default Chats;
