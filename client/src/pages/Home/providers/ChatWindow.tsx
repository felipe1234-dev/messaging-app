import { createContext, useContext, useState, useEffect } from "react";
import { useChats } from "@providers";
import { WrapperChat } from "@types";

interface ChatWindowValue {
    chatWindow?: WrapperChat;
    openChatWindow: (chat: WrapperChat) => void;
}

const ChatWindowContext = createContext<ChatWindowValue | undefined>(undefined);

function ChatWindowProvider(props: { children: React.ReactNode }) {
    const [selectedChat, setSelectedChat] = useState("");
    const { chats } = useChats();

    const chatWindow = chats.find((chat) => chat.uid === selectedChat);

    const openChatWindow = (chat: WrapperChat) => {
        setSelectedChat(chat.uid);
    };

    return (
        <ChatWindowContext.Provider value={{ chatWindow, openChatWindow }}>
            {props.children}
        </ChatWindowContext.Provider>
    );
}

function useChatWindow() {
    const context = useContext(ChatWindowContext);

    if (!context)
        throw new Error(
            "useChatWindow must be used within a ChatWindowProvider"
        );

    return context;
}

export { ChatWindowContext, ChatWindowProvider, useChatWindow };
