import { Fragment, useState, useEffect } from "react";

import { MessageCard, UserIsTyping } from "@components";
import { Columns, Paragraph } from "@styles/layout";
import { Message, User } from "messaging-app-globals";

import { Api } from "@services";
import { useInterval } from "@hooks";
import { useAuth } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { MessageListContainer } from "./styles";

interface MessageListProps {
    messageListEl: HTMLDivElement | null;
    setMessageListEl: (el: HTMLDivElement | null) => void;
    setMessageToReply: (message: Message) => void;
    setMessageToEdit: (message: Message) => void;
}

function MessageList(props: MessageListProps) {
    const {
        messageListEl,
        setMessageListEl,
        setMessageToReply,
        setMessageToEdit,
    } = props;

    const { user } = useAuth();
    const { chatWindow } = useChatWindow();

    const [startAfter, setStartAfter] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(false);

    const loadMoreMessagesIfLastVisible = async () => {
        if (loadingMessages) return;
        if (!messageListEl || !chatWindow) return;

        const oldestMessage = chatWindow?.getOldestMessage();
        if (!oldestMessage) return;
        if (oldestMessage.uid === startAfter) return;

        const oldestMessageEl = document.getElementById(oldestMessage.uid);
        if (!oldestMessageEl) return;

        const visible =
            messageListEl.scrollTop <=
            oldestMessageEl.offsetHeight + oldestMessageEl.offsetTop;
        if (!visible) return;

        setLoadingMessages(true);
        setStartAfter(oldestMessage.uid);

        try {
            await chatWindow.loadMoreMessages();
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleOnReplyMessage = (message: Message) => {
        setMessageToReply(message);
    };

    const handleOnEditMessage = (message: Message) => {
        setMessageToEdit(message);
    };

    useEffect(() => {
        loadMoreMessagesIfLastVisible();
    }, [messageListEl]);

    useInterval(() => {
        loadMoreMessagesIfLastVisible();
    }, 500);

    useInterval(() => {
        if (!user || !chatWindow) return;

        for (const message of chatWindow.messages) {
            Api.chats.connect(user, chatWindow).viewMessage(message);
        }
    }, 500);

    if (!user || !chatWindow) return <></>;

    const chatMessages = chatWindow.messages
        .filter((message) => {
            if (!user?.admin && message.deleted) return false;
            return true;
        })
        .reduce(
            (messages, message) => {
                const sender = chatWindow.members.find(
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

    const usersTyping = chatWindow.members.filter(
        (member) =>
            member.uid !== user.uid && chatWindow.typing.includes(member.uid)
    );

    return (
        <MessageListContainer ref={(el) => setMessageListEl(el)}>
            {usersTyping.map((user) => (
                <UserIsTyping
                    key={user?.uid}
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
                                        showSender={i === messages.length - 1}
                                        onReply={handleOnReplyMessage}
                                        onEdit={handleOnEditMessage}
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
        </MessageListContainer>
    );
}

export default MessageList;
