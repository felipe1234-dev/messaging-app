import { useState } from "react";

import { Message } from "messaging-app-globals";
import { useChatWindow } from "@pages/Home/providers";
import { ChatBackground } from "./styles";

import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

function ChatMessages() {
    const { chatWindow } = useChatWindow();

    const [messageListEl, setMessageListEl] = useState<HTMLDivElement | null>(
        null
    );
    const [messageToReply, setMessageToReply] = useState<Message>();
    const [messageToEdit, setMessageToEdit] = useState<Message>();

    const scrollToBottom = () => {
        if (!messageListEl) return;

        messageListEl.scrollTo({
            top: messageListEl.scrollHeight,
            behavior: "smooth",
        });
    };

    return (
        <ChatBackground cover={chatWindow?.cover}>
            <MessageList
                messageListEl={messageListEl}
                setMessageListEl={setMessageListEl}
                setMessageToReply={setMessageToReply}
                setMessageToEdit={setMessageToEdit}
            />
            <NewMessage
                scrollToBottom={scrollToBottom}
                messageToReply={messageToReply}
                setMessageToReply={setMessageToReply}
                messageToEdit={messageToEdit}
                setMessageToEdit={setMessageToEdit}
            />
        </ChatBackground>
    );
}

export default ChatMessages;
