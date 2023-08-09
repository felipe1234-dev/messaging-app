import React, { useState, useEffect } from "react";

import {
    AudioMessage,
    Message,
    TextMessage,
    VideoMessage,
} from "messaging-app-globals";

import { useAuth, useAlert } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { Input, Avatar, Button, AudioRecorder } from "@components";
import { useInterval } from "@hooks";
import { Api } from "@services";
import { AudioInfo } from "@types";

import { Icon, Paragraph, TextSpan } from "@styles/layout";

import { SendPlane } from "@styled-icons/remix-fill";
import { CloseOutline } from "@styled-icons/evaicons-outline";
import { Microphone } from "@styled-icons/boxicons-regular";

import { NewMessageContainer, MessagePreviewContainer } from "./styles";

interface MessagePreviewProps {
    header: React.ReactNode;
    message: Message;
    onCancel: () => void;
}

const MessagePreview = ({ header, message, onCancel }: MessagePreviewProps) => (
    <MessagePreviewContainer>
        <Paragraph variant="secondary">
            {header}
            <Button
                round
                iconed
                transparent
                variant="highlight"
                onClick={onCancel}
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
            {TextMessage.isTextMessage(message) ? message.text : <></>}
        </Paragraph>
    </MessagePreviewContainer>
);

interface NewMessageProps {
    scrollToBottom: () => void;
    messageToReply?: Message | undefined;
    setMessageToReply: (message: Message | undefined) => void;
    messageToEdit?: Message | undefined;
    setMessageToEdit: (message: Message | undefined) => void;
}

function NewMessage(props: NewMessageProps) {
    const {
        scrollToBottom,
        messageToReply,
        setMessageToReply,
        messageToEdit,
        setMessageToEdit,
    } = props;

    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const alert = useAlert();

    const [newMessage, setNewMessage] = useState<Message>(new TextMessage());
    const [startedTypingAt, setStartedTypingAt] = useState<Date>();

    const isTextMessage = TextMessage.isTextMessage(newMessage);
    const isAudioMessage = AudioMessage.isAudioMessage(newMessage);
    const isVideoMessage = VideoMessage.isVideoMessage(newMessage);

    const handleTextMessageChange = (updates: Partial<TextMessage>) => {
        setNewMessage(
            (prev) => new TextMessage({ ...prev, ...updates, type: "text" })
        );
    };

    const handleVideoMessageChange = (updates: Partial<VideoMessage>) => {
        setNewMessage(
            (prev) => new VideoMessage({ ...prev, ...updates, type: "video" })
        );
    };

    const handleAudioMessageChange = (updates: Partial<AudioMessage>) => {
        setNewMessage(
            (prev) => new AudioMessage({ ...prev, ...updates, type: "audio" })
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
                    newMessage.text,
                    messageToReply?.uid
                );
            } else if (isAudioMessage) {
                promise = connection.sendAudioMessage(
                    newMessage.audio.url,
                    newMessage.audio.duration,
                    messageToReply?.uid
                );
            } else {
                promise = Promise.resolve();
            }
        } else {
            promise = connection.editMessage(newMessage, messageToEdit);
        }

        try {
            await promise;
            setNewMessage(new TextMessage());
            setMessageToReply(undefined);
            setMessageToEdit(undefined);
            scrollToBottom();
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    const handleRecordAudio = () => {
        setNewMessage(new AudioMessage());
    };

    const handleSaveAudio = async (result: Blob, audioInfo: AudioInfo) => {
        if (!user || !chatWindow || !isAudioMessage) return;

        const file = new File(
            [result],
            `${new Date()}-${user.name}'s-audio.mp4`
        );
        const path = `chats/${chatWindow.uid}/audios/${file.name}`;

        try {
            const url = await Api.media.upload(file, path, { ...audioInfo });

            newMessage.audio.url = url;
            newMessage.audio.duration = audioInfo.duration;
            newMessage.audio.unit = "ms";

            await handleSendMessage();
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    const handleCancelReply = () => {
        setMessageToReply(undefined);
    };

    const handleCancelEdition = () => {
        setMessageToEdit(undefined);
        setNewMessage(new TextMessage());
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
        if (!messageToEdit?.uid) return;
        setNewMessage(messageToEdit.clone());
    }, [messageToEdit]);

    if (!user || !chatWindow) return <></>;

    const messageToReplySender = chatWindow.members.find(
        (member) => member.uid === messageToReply?.sentBy
    );

    return (
        <NewMessageContainer>
            {messageToReply && messageToReplySender && (
                <MessagePreview
                    header={
                        <>
                            Replying to{" "}
                            <TextSpan variant="highlight">
                                {messageToReplySender.name}
                            </TextSpan>{" "}
                        </>
                    }
                    message={messageToReply}
                    onCancel={handleCancelReply}
                />
            )}
            {messageToEdit && (
                <MessagePreview
                    header="Editting message"
                    message={messageToEdit}
                    onCancel={handleCancelEdition}
                />
            )}
            {isTextMessage ? (
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
                    rightIconTitles={["Audio", "Send"]}
                    onRightIconClick={[handleRecordAudio, handleSendMessage]}
                    rightIconVariant="highlight"
                    placeholder="Your message..."
                    onEnterPress={handleSendMessage}
                    onChange={handleTextChange}
                    value={newMessage.text}
                    light={0.05}
                />
            ) : isAudioMessage ? (
                <AudioRecorder
                    autoStart
                    color={chatWindow.color || ""}
                    onSave={handleSaveAudio}
                />
            ) : (
                <></>
            )}
        </NewMessageContainer>
    );
}

export default NewMessage;
