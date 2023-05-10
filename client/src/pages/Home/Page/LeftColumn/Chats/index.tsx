import { Container } from "@styles/layout";
import { useChats } from "@providers";
import ChatCard from "./ChatCard";

function Chats() {
    const { chats } = useChats();
    
    return (
        <Container
            direction="column"
            justify="start"
            align="center"
            gap={10}
        >
            {chats.map(chat => <ChatCard chat={chat} />)}
        </Container>
    );
}

export default Chats;