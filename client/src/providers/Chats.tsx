import React, { createContext, useContext, useState, useEffect } from "react";
import { Chat, Message, User } from "messaging-app-globals";

import { useAlert, useAuth } from "@providers";
import { useAsyncEffect } from "@hooks";
import { Api } from "@services";
import { convertToHashMap } from "@functions";
import { WrapperChat, HashMap } from "@types";

import dingSound from "@assets/sounds/message_ding.wav";

interface ChatsValue {
    chats: WrapperChat[];
}

const ChatsContext = createContext<ChatsValue | undefined>(undefined);

function ChatsProvider(props: { children: React.ReactNode }) {
    const { user } = useAuth();
    const alert = useAlert();

    const [chats, setChats] = useState<HashMap<Chat>>({});
    const [members, setMembers] = useState<HashMap<User>>({});
    const [messages, setMessages] = useState<HashMap<Message>>({});

    const [listeners, setListeners] = useState<{
        [uid: string]: boolean;
    }>({});

    const registerListener = (uid: string) => {
        setListeners((prev) => ({ ...prev, [uid]: true }));
    };

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

            const sound = new Audio(dingSound);
            sound.play();

            return newMessages;
        });
    };

    const onMessageUpdated = (message: Message) => {
        setMessages((prev) => {
            const newMessages = { ...prev };
            newMessages[message.uid] = message;
            return newMessages;
        });
    };

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
        try {
            const oldestMessage = getOldestMessage(chat)();
            if (!oldestMessage) return [];

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

            return messageList;
        } catch (err) {
            alert.error((err as Error).message);
            return [];
        }
    };

    useAsyncEffect(async () => {
        if (!user) {
            setChats({});
            setMembers({});
            setMessages({});
            setListeners({});
            return;
        }

        try {
            const chats = await Api.chats.getUserChats();

            for (const chat of chats) {
                const memberList = await Api.chats.getChatMembers(chat.uid);

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
        } catch (err) {
            alert.error((err as Error).message);
        }
    }, [user?.uid]);

    useEffect(() => {
        if (!user?.uid) return;

        Api.chats.onUserChatUpdated(user.uid, onUserChatUpdated);
    }, [user?.uid]);

    useEffect(() => {
        if (!user?.uid) return;

        const chatList = Object.values(chats);

        for (const chat of chatList) {
            const listenerRegistered = listeners[chat.uid];
            if (listenerRegistered) continue;

            Api.chats.connect(user, chat).onMessageSent(onMessageSent);
            Api.chats.connect(user, chat).onMessageUpdated(onMessageUpdated);

            registerListener(chat.uid);
        }
    }, [user?.uid, chats]);

    useEffect(() => {
        const memberList = Object.values(members);
        for (const member of memberList) {
            const listenerRegistered = listeners[member.uid];
            if (listenerRegistered) continue;

            Api.users.onUserUpdated(member.uid, onMemberUpdated);

            registerListener(member.uid);
        }
    }, [members]);

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
