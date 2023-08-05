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
    const [replyTo, setReplyTo] = useState("");

    const scrollToBottom = () => {
        if (!messageListEl) return;

        messageListEl.scrollTo({
            top: messageListEl.scrollHeight,
            behavior: "smooth",
        });
    };

    const setMessageToReply = (message: Message) => {
        setReplyTo(message.uid);
    };

    return (
        <ChatBackground cover={chatWindow?.cover}>
            <MessageList
                messageListEl={messageListEl}
                setMessageListEl={setMessageListEl}
                setMessageToReply={setMessageToReply}
            />
            <NewMessage
                scrollToBottom={scrollToBottom}
                defaultReplyTo={replyTo}
            />
        </ChatBackground>
    );
}

export default ChatMessages;
