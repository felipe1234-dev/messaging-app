import React, { 
    createContext, 
    useContext, 
    useEffect, 
    useState
} from "react";
import { Chat, Message } from "messaging-app-globals";
import { useAuth } from "@providers";
import { useAsyncEffect, useUnmount } from "@hooks";
import { Api } from "@services";

interface ChatsValue {
    chats: Chat[];
    selectedChat: Chat | undefined;
    selectChat(chatUid: string): void;
    unselectChat(): void;
}

const ChatsContext = createContext<ChatsValue | undefined>(undefined);

function ChatsProvider(props: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat>();

    const selectChat = (chatUid: string) => {
        const chat = chats.find(chat => chat.uid === chatUid);
        setSelectedChat(chat);
    };

    const unselectChat = () => {
        setSelectedChat(undefined);
    };

    const onChatUpdated = (updatedChat: Chat) => {
        setChats(prev => prev.map(chat => {
            if (chat.uid === updatedChat.uid) return updatedChat;
            return chat;
        }));

        if (updatedChat.uid === selectedChat?.uid) {
            setSelectedChat(updatedChat);
        }
    };

    const onConnect = () => {
        Api.chats.onChatUpdated(onChatUpdated);
    };

    const onDisconnect = () => {
        Api.chats.offChatUpdated(onChatUpdated);
    };

    useEffect(() => {
        Api.onConnect(onConnect);
        Api.onDisconnect(onDisconnect);
    }, []);

    useUnmount(() => {
        Api.offConnect(onConnect);
        Api.offDisconnect(onDisconnect);
    });

    useAsyncEffect(async () => {
        if (!user) {
            setChats([]);
            unselectChat();
        } else {
            const chats = await Api.chats.getUserChats();
            setChats(chats);
        }
    }, [user]);

    return (
        <ChatsContext.Provider
            value={{
                chats,
                selectedChat,
                selectChat,
                unselectChat
            }}
        >
            {props.children}
        </ChatsContext.Provider>
    );
}

function useChats() {
    const context = useContext(ChatsContext);

    if (!context) throw new Error("useChats must be used within a ChatsProvider");

    return context;
}

export { ChatsProvider, useChats, ChatsContext };