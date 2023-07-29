import React, { Fragment, useMemo, useState, useEffect } from "react";

import { MessageCard, Input, Avatar, UserIsTyping } from "@components";
import { Icon, Columns, Paragraph } from "@styles/layout";
import { Message, User } from "messaging-app-globals";

import { Api } from "@services";
import { wrapperChatToChat } from "@functions";
import { useInterval } from "@hooks";
import { useAuth, useAlert } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { SendPlane } from "@styled-icons/remix-fill";
import { ChatBackground, MessageList, NewMessageContainer } from "./styles";

function ChatMessages() {
    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const alert = useAlert();

    const [messageListEl, setMessageListEl] = useState<HTMLDivElement | null>(
        null
    );
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState("");
    const [startedTypingAt, setStartedTypingAt] = useState<Date>();
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [startAfter, setStartAfter] = useState("");

    const scrollToBottom = () => {
        if (!messageListEl) return;

        messageListEl.scrollTo({
            top: messageListEl.scrollHeight,
            behavior: "smooth",
        });
    };

    const loadMoreMessagesIfLastVisible = async () => {
        if (loadingMessages) return Promise.resolve();
        if (!messageListEl || !chatWindow) return Promise.resolve();

        const oldestMessage = chatWindow.getOldestMessage();
        if (!oldestMessage) return Promise.resolve();
        if (oldestMessage.uid === startAfter) return Promise.resolve();

        const oldestMessageEl = document.getElementById(oldestMessage.uid);
        if (!oldestMessageEl) return Promise.resolve();

        const visible =
            messageListEl.scrollTop <=
            oldestMessageEl.offsetHeight + oldestMessageEl.offsetTop;
        if (!visible) return Promise.resolve();

        setLoadingMessages(true);
        setStartAfter(oldestMessage.uid);

        try {
            await chatWindow.loadMoreMessages();
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !chatWindow) return;

        setText(evt.target.value);

        setStartedTypingAt(new Date());
        Api.chats.connect(user, wrapperChatToChat(chatWindow)).isTyping();
    };

    const handleSendMessage = () => {
        if (!user || !chatWindow) return;

        Api.chats
            .connect(user, wrapperChatToChat(chatWindow))
            .sendTextMessage(text)
            .then(() => {
                setText("");
                scrollToBottom();
            })
            .catch((err: Error) => alert.error(err.message));
    };

    const handleMessageListScroll = () => {
        loadMoreMessagesIfLastVisible();
    };

    const handleOnReplyMessage = (message: Message) => {
        setReplyTo(message.uid);
    };

    useEffect(() => {
        loadMoreMessagesIfLastVisible();
    }, [messageListEl]);

    useInterval(
        (timerId) => {
            if (!startedTypingAt || !user || !chatWindow)
                return clearInterval(timerId);

            const today = new Date();
            const intervalSecs =
                (today.getTime() - startedTypingAt.getTime()) / 1000;

            if (intervalSecs >= 1) {
                setStartedTypingAt(undefined);
                Api.chats
                    .connect(user, wrapperChatToChat(chatWindow))
                    .isNotTyping();
                clearInterval(timerId);
            }
        },
        1000,
        [startedTypingAt]
    );

    const filterMessages = (message: Message) => {
        if (!chatWindow || !user) return false;

        const isChatAdmin = chatWindow.admins
            .map((user) => user.uid)
            .includes(user.uid);
        const isSender = message.sentBy === user.uid;

        if (!isChatAdmin && !user.admin && !isSender && message.deleted)
            return false;

        return true;
    };

    const chatMessages = useMemo(() => {
        return [...(chatWindow?.messages || [])].filter(filterMessages).reduce(
            (messages, message) => {
                const sender = chatWindow?.members.find(
                    (member) => member.uid === message.sentBy
                );
                if (!sender) return messages;

                const messageDate = message.createdAt.toDateString();

                if (!messages[messageDate]) {
                    messages[messageDate] = {};
                }

                const dateMessages = messages[messageDate];

                if (!dateMessages[sender.uid]) {
                    dateMessages[sender.uid] = { sender, messages: [] };
                }

                const senderMessages = dateMessages[sender.uid];

                senderMessages.messages.push(message);

                return messages;
            },
            {} as {
                [time: string]: {
                    [senderUid: string]: {
                        sender: User;
                        messages: Message[];
                    };
                };
            }
        );
    }, [chatWindow]);

    const usersTyping = useMemo(() => {
        return (chatWindow?.members || []).filter(
            (member) =>
                member.uid !== user?.uid &&
                chatWindow?.typing.includes(member.uid)
        );
    }, [chatWindow?.members, chatWindow?.typing, user?.uid]);

    if (!user || !chatWindow) return <></>;

    return (
        <ChatBackground cover={chatWindow?.cover}>
            <MessageList
                ref={(el) => setMessageListEl(el)}
                onScroll={handleMessageListScroll}
            >
                {usersTyping.map((user) => (
                    <UserIsTyping
                        key={user.uid}
                        user={user}
                    />
                ))}
                {Object.entries(chatMessages).map(([timeAgo, senders]) => (
                    <Fragment key={timeAgo}>
                        {Object.entries(senders).map(
                            ([senderUid, { sender, messages }]) => (
                                <Fragment key={senderUid}>
                                    {messages.map((message, i) => (
                                        <MessageCard
                                            key={message.uid}
                                            message={message}
                                            sender={sender}
                                            showSender={
                                                i === messages.length - 1
                                            }
                                            onReply={handleOnReplyMessage}
                                        />
                                    ))}
                                </Fragment>
                            )
                        )}
                        <Columns
                            align="center"
                            justify="center"
                            width="100%"
                        >
                            <Paragraph variant="secondary">{timeAgo}</Paragraph>
                        </Columns>
                    </Fragment>
                ))}
            </MessageList>
            <NewMessageContainer>
                <Input
                    autoResize
                    variant="secondary"
                    leftIcon={
                        <Avatar
                            src={user.photo}
                            alt={user.name}
                        />
                    }
                    rightIcon={
                        <Icon
                            icon={<SendPlane />}
                            size={2}
                        />
                    }
                    rightIconVariant="highlight"
                    onRightIconClick={handleSendMessage}
                    onEnterPress={handleSendMessage}
                    placeholder="Your message..."
                    onChange={handleTextChange}
                    value={text}
                    light={0.05}
                />
            </NewMessageContainer>
        </ChatBackground>
    );
}

export default ChatMessages;
