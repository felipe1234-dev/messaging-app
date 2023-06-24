import { Container, Rows } from "@styles/layout";
import ChatInfo from "./ChatInfo";
import ChatMessages from "./ChatMessages";

function ChatWindow() {
    return (
        <Rows
            variant="secondary"
            justify="stretch"
            align="start"
            height="100%"
            gap={3}
            style={{ flex: 1 }}
        >
            <ChatInfo />
            <ChatMessages />
        </Rows>
    );
}

export default ChatWindow;
