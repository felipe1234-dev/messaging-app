import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

import { Message, TextMessage, Media } from "messaging-app-globals";

import { useAuth, useAlert } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { Input, Avatar, Carousel, MediaViewer, Spinner } from "@components";
import { useInterval } from "@hooks";
import { Api } from "@services";

import { Icon, Container } from "@styles/layout";

import { SendPlane } from "@styled-icons/remix-fill";
import { Attachment } from "@styled-icons/entypo/Attachment";
import { Microphone } from "@styled-icons/boxicons-regular";

import { paddingX } from "../styles";

type AttachmentList = Required<TextMessage>["attachments"];

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
        messageToReply,
    } = props;

    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const alert = useAlert();

    const [startedTypingAt, setStartedTypingAt] = useState<Date>();
    const [loadingAttachments, setLoadingAttachments] = useState(false);
    const [attachmentList, setAttachmentList] = useState<AttachmentList>([]);

    const handleTextMessageChange = (updates: Partial<TextMessage>) => {
        setTextMessage(
            (prev) => new TextMessage({ ...prev, ...updates, type: "text" })
        );
    };

    const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !chatWindow) return;

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
            promise = connection.sendTextMessage(textMessage.text, {
                repliedTo: messageToReply?.uid,
                attachments: attachmentList,
            });
        } else {
            promise = connection.editMessage(textMessage, messageToEdit);
        }

        try {
            await promise;
            setAttachmentList([]);
            resetMessage();
            scrollToBottom();
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    const handleAttachFiles = async () => {
        if (!chatWindow || loadingAttachments) return;

        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.setAttribute("multiple", "multiple");
        input.onchange = async () => {
            if (!input.files) return;

            const files = Array.from(input.files);

            const promises: Promise<AttachmentList[number]>[] = files.map(
                (file) =>
                    new Promise(async (resolve) => {
                        try {
                            const path = `chats/${
                                chatWindow.uid
                            }/attachments/${new Date()}-${file.name}`;
                            const { filename, extension, mimetype, size, url } =
                                await Api.media.upload(file, path);

                            resolve({
                                filename,
                                extension,
                                mimetype,
                                size,
                                path,
                                url,
                            });
                        } catch {}
                    })
            );

            setLoadingAttachments(true);

            const attachments = await Promise.all(promises);
            setAttachmentList((prev) => [...prev, ...attachments]);

            setLoadingAttachments(false);
        };

        input.click();
    };

    const handleUnattachFile = (i: number) => () => {
        setAttachmentList((prev) => {
            const newList = [];

            for (let j = 0; j < prev.length; j++) {
                if (j === i) continue;
                newList.push(prev[i]);
            }

            return newList;
        });
    };

    useEffect(() => {
        const isTextMessage = TextMessage.isTextMessage(messageToEdit);
        const hasAttachments =
            isTextMessage &&
            !!messageToEdit &&
            !!messageToEdit.attachments &&
            messageToEdit.attachments.length > 0;
        if (!isTextMessage || !hasAttachments) return setAttachmentList([]);
        setAttachmentList(messageToEdit.attachments || []);
    }, [messageToEdit]);

    useEffect(() => {
        handleTextMessageChange({ attachments: attachmentList });
    }, [attachmentList]);

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
        <>
            {attachmentList.length > 0 && (
                <Container
                    transparent
                    width="600px"
                    height="fit-content"
                >
                    <Carousel
                        hideScrollbar
                        scrollWithWheel
                        direction="row"
                        justify="start"
                        align="center"
                        width={`calc(100% - ${2 * paddingX}px)`}
                        height="fit-content"
                        gap={10}
                    >
                        {attachmentList.map((attachment, i) => (
                            <MediaViewer
                                key={attachment.url}
                                media={new Media({ ...attachment })}
                                onRemove={handleUnattachFile(i)}
                            />
                        ))}
                    </Carousel>
                </Container>
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
                    !loadingAttachments ? (
                        <Icon
                            icon={<Attachment />}
                            size={2}
                        />
                    ) : (
                        <Spinner size={2} />
                    ),
                    <Icon
                        icon={<SendPlane />}
                        size={2}
                    />,
                ]}
                rightIconTitles={["Audio", "Attachments", "Send"]}
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
        </>
    );
}

export default NewTextMessage;
