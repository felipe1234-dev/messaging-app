import React, { useState, useEffect } from "react";

import { useAuth, useAlert } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { Input, Avatar, Button } from "@components";
import { useInterval } from "@hooks";
import { Api } from "@services";

import { Icon, Paragraph, TextSpan } from "@styles/layout";
import { TextMessage } from "messaging-app-globals";

import { SendPlane } from "@styled-icons/remix-fill";
import { CloseOutline } from "@styled-icons/evaicons-outline";
import { Microphone } from "@styled-icons/boxicons-regular";

import { NewMessageContainer, MessagePreviewContainer } from "./styles";

interface NewMessageProps {
    scrollToBottom: () => void;
    defaultReplyTo?: string;
}

function NewMessage(props: NewMessageProps) {
    const { scrollToBottom, defaultReplyTo } = props;

    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const alert = useAlert();

    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState("");
    const [startedTypingAt, setStartedTypingAt] = useState<Date>();

    const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !chatWindow) return;

        setText(evt.target.value);

        setStartedTypingAt(new Date());
        Api.chats.connect(user, chatWindow).isTyping();
    };

    const handleSendMessage = () => {
        if (!user || !chatWindow) return;
        if (!text) return;

        Api.chats
            .connect(user, chatWindow)
            .sendTextMessage(text, replyTo)
            .then(() => {
                setText("");
                setReplyTo("");
                scrollToBottom();
            })
            .catch((err: Error) => alert.error(err.message));
    };

    const handleCancelReply = () => {
        setReplyTo("");
    };

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

    useEffect(() => {
        if (!defaultReplyTo) return;
        setReplyTo(defaultReplyTo);
    }, [defaultReplyTo]);

    if (!user || !chatWindow) return <></>;

    const replyingMessage = chatWindow.messages.find(
        (msg) => msg.uid === replyTo
    );
    const replyingMessageSender = chatWindow.members.find(
        (member) => member.uid === replyingMessage?.sentBy
    );

    return (
        <NewMessageContainer>
            {replyingMessage && replyingMessageSender && (
                <MessagePreviewContainer>
                    <Paragraph variant="secondary">
                        Replying to{" "}
                        <TextSpan variant="highlight">
                            {replyingMessageSender.name}
                        </TextSpan>{" "}
                        <Button
                            round
                            iconed
                            transparent
                            variant="highlight"
                            onClick={handleCancelReply}
                            p={4}
                        >
                            <Icon icon={<CloseOutline />} />
                        </Button>
                    </Paragraph>
                    <Paragraph
                        variant="primary"
                        fontStyle="italic"
                        fontWeight={300}
                    >
                        {TextMessage.isTextMessage(replyingMessage) ? (
                            replyingMessage.text
                        ) : (
                            <></>
                        )}
                    </Paragraph>
                </MessagePreviewContainer>
            )}
            <Input
                autoResize
                variant="secondary"
                leftIcon={
                    <Avatar
                        src={user?.photo}
                        alt={user?.name}
                    />
                }
                rightIcon={[
                    <Icon
                        icon={<Microphone />}
                        size={2}
                    />,
                    <Icon
                        icon={<SendPlane />}
                        size={2}
                    />,
                ]}
                onRightIconClick={[
                    () => console.log("test"),
                    handleSendMessage,
                ]}
                rightIconVariant="highlight"
                placeholder="Your message..."
                onEnterPress={handleSendMessage}
                onChange={handleTextChange}
                value={text}
                light={0.05}
            />
        </NewMessageContainer>
    );
}

export default NewMessage;
