import React from "react";

import { Message, TextMessage } from "messaging-app-globals";

import { useChatWindow } from "@pages/Home/providers";
import { Button, MessageView } from "@components";

import { CloseOutline } from "@styled-icons/evaicons-outline";
import { Icon, Paragraph } from "@styles/layout";
import { MessagePreviewContainer } from "./styles";

interface MessagePreviewProps {
    header: React.ReactNode;
    message: Message;
    onCancel: () => void;
}

function MessagePreview(props: MessagePreviewProps) {
    const { header, message, onCancel } = props;
    const { chatWindow } = useChatWindow();

    const isTextMessage = TextMessage.isTextMessage(message);

    const MessageViewWrapper = ({
        children,
    }: {
        children: React.ReactNode;
    }) => (
        <>
            {isTextMessage ? (
                <Paragraph
                    variant="primary"
                    fontStyle="italic"
                    fontWeight={300}
                >
                    {children}
                </Paragraph>
            ) : (
                children
            )}
        </>
    );

    return (
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
            <MessageViewWrapper>
                <MessageView
                    message={message}
                    color={chatWindow?.color}
                />
            </MessageViewWrapper>
        </MessagePreviewContainer>
    );
}

export default MessagePreview;
