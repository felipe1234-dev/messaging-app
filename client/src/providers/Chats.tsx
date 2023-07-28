import React, { createContext, useContext, useState } from "react";
import { Chat, Message, User } from "messaging-app-globals";
import { useAuth } from "@providers";
import { useAsyncEffect } from "@hooks";
import { Api } from "@services";
import { convertToHashMap } from "@functions";
import { WrapperChat, HashMap } from "@types";

interface ChatsValue {
    chats: WrapperChat[];
}

const ChatsContext = createContext<ChatsValue | undefined>(undefined);

function ChatsProvider(props: { children: React.ReactNode }) {
    const { user } = useAuth();

    const [chats, setChats] = useState<HashMap<Chat>>({});
    const [members, setMembers] = useState<HashMap<User>>({});
    const [messages, setMessages] = useState<HashMap<Message>>({});

    const onUserChatUpdated = (updatedChat: Chat) => {
        setChats((prev) => {
            const newChats = { ...prev };
            newChats[updatedChat.uid] = updatedChat;
            return newChats;
        });
    };

    const onMemberUpdated = (updatedUser: User) => {
        setMembers((prev) => {
            const newMembers = { ...prev };
            newMembers[updatedUser.uid] = updatedUser;
            return newMembers;
        });
    };

    const onMessageSent = (message: Message) => {
        setMessages((prev) => {
            const newMessages = { ...prev };
            newMessages[message.uid] = message;
            return newMessages;
        });
    };

    useAsyncEffect(async () => {
        if (!user) {
            setChats({});
            setMembers({});
            setMessages({});
            return;
        }

        const chats = await Api.chats.getUserChats();

        for (const chat of chats) {
            const memberList = await Api.chats.getChatMembers(chat.uid);

            for (const member of memberList) {
                Api.users.onUserUpdated(member.uid, onMemberUpdated);
            }

            setMembers((prev) => {
                const membersHashMap = convertToHashMap(
                    [...Object.values(prev), ...memberList],
                    (member) => member.uid
                );
                return membersHashMap;
            });

            const messageList = await Api.chats.getChatMessages(chat.uid, {
                limit: 10,
                orderBy: ["createdAt", "desc"],
            });

            Api.messages.onMessageSentToChat(chat.uid, onMessageSent);

            setMessages((prev) => {
                const messagesHashMap = convertToHashMap(
                    [...Object.values(prev), ...messageList],
                    (message) => message.uid
                );
                return messagesHashMap;
            });
        }

        const chatHashMap = convertToHashMap(chats, (chat) => chat.uid);
        setChats(chatHashMap);

        Api.chats.onUserChatUpdated(user.uid, onUserChatUpdated);
    }, [user?.uid]);

    const sortMessages = (chat: Chat) => {
        const chatMessages = Object.values(messages).filter((message) => {
            return message.chat === chat.uid;
        });

        return chatMessages.sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1;
            if (a.createdAt < b.createdAt) return 1;
            return 0;
        });
    };

    const getNewestMessage = (chat: Chat) => () => {
        const chatMessages = sortMessages(chat);
        return chatMessages[0];
    };

    const getOldestMessage = (chat: Chat) => () => {
        const chatMessages = sortMessages(chat);
        return chatMessages[chatMessages.length - 1];
    };

    const loadMoreMessages = (chat: Chat) => async () => {
        const oldestMessage = getOldestMessage(chat)();
        if (!oldestMessage) return;

        const messageList = await Api.chats.getChatMessages(chat.uid, {
            limit: 10,
            startAfter: oldestMessage.uid,
            orderBy: ["createdAt", "desc"],
        });

        setMessages((prev) => {
            const messagesHashMap = convertToHashMap(
                [...Object.values(prev), ...messageList],
                (message) => message.uid
            );
            return messagesHashMap;
        });
    };

    const wrapperChats = Object.values(chats)
        .map((chat) => ({
            ...chat,
            isGroupChat: chat.isGroupChat,
            isDirectChat: chat.isDirectChat,
            members: Object.values(members).filter((member) => {
                return chat.members.includes(member.uid);
            }),
            blocked: Object.values(members).filter((member) => {
                return chat.blocked.includes(member.uid);
            }),
            admins: Object.values(members).filter((member) => {
                return chat.admins.includes(member.uid);
            }),
            createdBy: Object.values(members).find((member) => {
                return member.uid === chat.createdBy;
            }) as User,
            messages: sortMessages(chat),
            getNewestMessage: getNewestMessage(chat),
            getOldestMessage: getOldestMessage(chat),
            loadMoreMessages: loadMoreMessages(chat),
        }))
        .sort((a, b) => {
            const aLastMessage = a.getNewestMessage();
            const bLastMessage = b.getNewestMessage();

            if (aLastMessage.createdAt > bLastMessage.createdAt) return -1;
            if (aLastMessage.createdAt < bLastMessage.createdAt) return 1;
            return 0;
        });

    return (
        <ChatsContext.Provider value={{ chats: wrapperChats }}>
            {props.children}
        </ChatsContext.Provider>
    );
}

function useChats() {
    const context = useContext(ChatsContext);

    if (!context)
        throw new Error("useChats must be used within a ChatsProvider");

    return context;
}

export { ChatsProvider, useChats, ChatsContext };
