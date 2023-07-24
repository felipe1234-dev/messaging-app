import React, { Fragment, useMemo, useState, useEffect } from "react";

import { MessageCard, Input, Avatar, UserIsTyping } from "@components";
import { Icon, Columns, Rows, Paragraph } from "@styles/layout";
import { Message, User } from "messaging-app-globals";

import { Api } from "@services";
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
    const [startedTypingAt, setStartedTypingAt] = useState<Date>();

    const scrollToBottom = () => {
        if (!messageListEl) return;

        messageListEl.scrollTo({
            top: messageListEl.scrollHeight,
            behavior: "smooth",
        });
    };

    const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !chatWindow) return;

        setText(evt.target.value);

        setStartedTypingAt(new Date());
        Api.chats.connect(user, chatWindow).isTyping();
    };

    const handleSendMessage = () => {
        if (!user || !chatWindow) return;

        Api.chats
            .connect(user, chatWindow)
            .sendTextMessage(text)
            .then(() => {
                setText("");
                scrollToBottom();
            })
            .catch((err: Error) => alert.error(err.message));
    };

    useEffect(() => {
        scrollToBottom();
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
                Api.chats.connect(user, chatWindow).isNotTyping();
                clearInterval(timerId);
            }
        },
        1000,
        [startedTypingAt]
    );

    const chatMessages = useMemo(() => {
        let prevSender: User | undefined = undefined;

        return (chatWindow?.messages || []).reduce(
            (messages, message) => {
                const messageDate = message.createdAt.toDateString();
                const sender = chatWindow?.members.find(
                    (member) => member.uid === message.sentBy
                );
                let showSender = true;

                if (!sender) return messages;

                if (!messages[messageDate]) {
                    showSender = true;
                    messages[messageDate] = [];
                } else {
                    showSender = prevSender?.uid !== sender.uid;
                }

                messages[messageDate].push([message, sender, showSender]);

                prevSender = sender;

                return messages;
            },
            {} as {
                [time: string]: [
                    message: Message,
                    sender: User,
                    showSender: boolean
                ][];
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
            <MessageList ref={(el) => setMessageListEl(el)}>
                {Object.entries(chatMessages).map(
                    ([timeAgo, messagesAndSenders]) => (
                        <Fragment key={timeAgo}>
                            <Columns
                                align="center"
                                justify="center"
                                width="100%"
                            >
                                <Paragraph variant="secondary">
                                    {timeAgo}
                                </Paragraph>
                            </Columns>
                            {messagesAndSenders.map(
                                ([message, sender, showSender]) => (
                                    <MessageCard
                                        key={message.uid}
                                        message={message}
                                        sender={sender}
                                        showSender={showSender}
                                    />
                                )
                            )}
                        </Fragment>
                    )
                )}
                {usersTyping.map((user) => (
                    <UserIsTyping
                        key={user.uid}
                        user={user}
                    />
                ))}
            </MessageList>
            <NewMessageContainer>
                <Input
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
