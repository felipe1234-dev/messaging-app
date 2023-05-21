import { Container } from "@styles/layout";

import { gap } from "../index";

import Profile from "./Profile";
import Search from "./Search";

function Chats() {
    return (
        <Container
            transparent
            direction="column"
            justify="start"
            align="center"
            width="fit-content"
            height="100%"
            gap={gap}
        >
            <Profile />
            <Search />
        </Container>
    );
}

export default Chats;