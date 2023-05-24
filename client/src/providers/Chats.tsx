import React, { createContext, useContext, useEffect, useState } from "react";
import { Chat, Message, User } from "messaging-app-globals";
import { useAuth } from "@providers";
import { useAsyncEffect } from "@hooks";
import { Api } from "@services";
import { WrapperChat } from "@types";

interface ChatsValue {
    chats: WrapperChat[];
    messages: Message[];
    members: User[];
}

const ChatsContext = createContext<ChatsValue | undefined>(undefined);

function ChatsProvider(props: { children: React.ReactNode }) {
    const { user } = useAuth();

    const [chats, setChats] = useState<Chat[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const onUserChatUpdated = (updatedChat: Chat) => {
        setChats((prev) =>
            prev.map((chat) => {
                if (chat.uid === updatedChat.uid) return updatedChat;
                return chat;
            })
        );
    };

    const onMemberUpdated = (updatedUser: User) => {
        const userUid = updatedUser.uid;

        const userInChats = !!members.find((member) => member.uid === userUid);
        if (!userInChats) return;

        setMembers((prev) =>
            prev.map((member) => {
                if (member.uid === userUid) return updatedUser;
                return member;
            })
        );
    };

    const onMessageSent = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    useAsyncEffect(async () => {
        if (!user) {
            setChats([]);
            setMembers([]);
            setMessages([]);
        } else {
            const chats = await Api.chats.getUserChats();
            setChats(chats);

            for (const chat of chats) {
                const memberList = await Api.chats.getChatMembers(chat.uid);
                setMembers(memberList);

                for (const member of memberList) {
                    Api.users.onUserUpdated(member.uid, onMemberUpdated);
                }

                Api.messages.onMessageSentToChat(chat.uid, onMessageSent);
            }

            Api.chats.onUserChatUpdated(user.uid, onUserChatUpdated);
        }
    }, [user?.uid]);

    const sortMessages = (messages: Message[]) => {
        return messages.sort((a, b) => {
            if (a.createdAt > b.createdAt) return 1;
            if (a.createdAt < b.createdAt) return -1;
            return 0;
        });
    };

    const getLastMessage = (chat: Chat) => () => {
        const chatMessages = sortMessages(
            messages.filter((message) => {
                return message.chat === chat.uid;
            })
        );

        return chatMessages[chatMessages.length - 1];
    };

    const wrapperChats = chats
        .map((chat) => ({
            ...chat,
            members: members.filter((member) => {
                return chat.members.includes(member.uid);
            }),
            blocked: members.filter((member) => {
                return chat.blocked.includes(member.uid);
            }),
            admins: members.filter((member) => {
                return chat.admins.includes(member.uid);
            }),
            createdBy: members.find((member) => {
                return member.uid === chat.createdBy;
            }) as User,
            messages: sortMessages(
                messages.filter((message) => {
                    return message.chat === chat.uid;
                })
            ),

            getLastMessage: getLastMessage(chat),
        }))
        .sort((a, b) => {
            const aLastMessage = a.getLastMessage();
            const bLastMessage = b.getLastMessage();

            if (aLastMessage.createdAt > bLastMessage.createdAt) return -1;
            if (aLastMessage.createdAt < bLastMessage.createdAt) return 1;
            return 0;
        });

    return (
        <ChatsContext.Provider
            value={{
                chats: wrapperChats,
                members,
                messages,
            }}
        >
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
