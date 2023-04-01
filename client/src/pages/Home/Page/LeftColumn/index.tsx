import { Container } from "@styles/layout";
import { useAuth } from "@providers";

import Actions from "./Actions";
import Search from "./Search";
import Friends from "./Friends";
import Chats from "./Chats";

function LeftColumn() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Container
            direction="column"
            justify="start"
            align="center"
            p={10}
        >
            <Actions />
            <Search />
            {user.friends.length > 0 && <Friends />}
            <Chats />
        </Container>
    );
}

export default LeftColumn;