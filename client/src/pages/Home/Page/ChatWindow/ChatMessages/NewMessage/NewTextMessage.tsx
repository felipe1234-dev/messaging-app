import React, { useState, Dispatch, SetStateAction } from "react";

import { Message, TextMessage } from "messaging-app-globals";

import { useAuth, useAlert } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { Input, Avatar } from "@components";
import { useInterval } from "@hooks";
import { Api } from "@services";

import { Icon } from "@styles/layout";

import { SendPlane } from "@styled-icons/remix-fill";
import { Attachment } from "@styled-icons/entypo/Attachment";
import { Microphone } from "@styled-icons/boxicons-regular";

interface NewTextMessageProps {
    textMessage: TextMessage;
    setTextMessage: Dispatch<SetStateAction<Message>>;
    scrollToBottom: () => void;
    resetMessage: () => void;
    recordAudio: () => void;
    messageToEdit?: Message | undefined;
    setMessageToEdit: Dispatch<SetStateAction<Message | undefined>>;
    messageToReply?: Message | undefined;
    setMessageToReply: Dispatch<SetStateAction<Message | undefined>>;
}

function NewTextMessage(props: NewTextMessageProps) {
    const {
        textMessage,
        setTextMessage,
        scrollToBottom,
        resetMessage,
        recordAudio,
        messageToEdit,
        setMessageToEdit,
        messageToReply,
        setMessageToReply,
    } = props;

    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const alert = useAlert();

    const [startedTypingAt, setStartedTypingAt] = useState<Date>();
    const isTextMessage = TextMessage.isTextMessage(textMessage);

    const handleTextMessageChange = (updates: Partial<TextMessage>) => {
        setTextMessage(
            (prev) => new TextMessage({ ...prev, ...updates, type: "text" })
        );
    };

    const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !chatWindow || !isTextMessage) return;

        handleTextMessageChange({ text: evt.target.value });

        setStartedTypingAt(new Date());
        Api.chats.connect(user, chatWindow).isTyping();
    };

    const handleSendMessage = async () => {
        if (!user || !chatWindow) return;

        const connection = Api.chats.connect(user, chatWindow);
        const isEditting = !!messageToEdit?.uid;
        let promise: Promise<void>;

        if (!isEditting) {
            if (isTextMessage) {
                promise = connection.sendTextMessage(
                    textMessage.text,
                    messageToReply?.uid
                );
            } else {
                promise = Promise.resolve();
            }
        } else {
            promise = connection.editMessage(textMessage, messageToEdit);
        }

        try {
            await promise;
            resetMessage();
            scrollToBottom();
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    const handleAttachFiles = async () => {
        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.onchange = () => {
            if (!input.files) return;

            for (let i = 0; i < input.files.length; i++) {
                const file = input.files.item(i);
            }
        };

        input.addEventListener("change", (evt) => {});

        input.click();
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

    if (!user || !chatWindow) return <></>;

    return (
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
                    icon={<Attachment />}
                    size={2}
                />,
                <Icon
                    icon={<SendPlane />}
                    size={2}
                />,
            ]}
            rightIconTitles={["Audio", "Send"]}
            onRightIconClick={[
                recordAudio,
                handleAttachFiles,
                handleSendMessage,
            ]}
            rightIconVariant="highlight"
            placeholder="Your message..."
            onEnterPress={handleSendMessage}
            onChange={handleTextChange}
            value={textMessage.text}
            light={0.05}
        />
    );
}

export default NewTextMessage;
