import { useEffect } from "react";

import { useAuth, useChats, useAlert } from "@providers";
import { timeAgo, wrapperChatToChat } from "@functions";
import { useInterval, useForceUpdate } from "@hooks";
import { Api } from "@services";

import { Title, Columns, Paragraph, Container, Icon } from "@styles/layout";
import { ShowItem } from "@styles/animations";
import {
    MessageRow,
    MessageContainer,
    MessageBalloon,
    MessageActions,
} from "./styles";

import { User, Message, TextMessage } from "messaging-app-globals";

import Avatar from "../Avatar";
import Overlay from "../Overlay";
import Button from "../Button";

import { Delete } from "@styled-icons/fluentui-system-regular";
import { Reply } from "@styled-icons/bootstrap";

const width = "44px";

interface MessageCardProps {
    message: Message;
    sender: User;
    showSender?: boolean;
    wasReplied?: boolean;
    onReply?: (message: Message) => void | Promise<void>;
    onEdit?: (message: Message) => void | Promise<void>;
}

function MessageCard(props: MessageCardProps) {
    const {
        sender,
        message,
        showSender = true,
        wasReplied = false,
        onReply,
        onEdit,
    } = props;

    const { user } = useAuth();
    const { chats } = useChats();
    const alert = useAlert();
    const { forceUpdate } = useForceUpdate();

    const isSender = user?.uid === sender.uid;
    const chat = chats.find((c) => c.uid === message.chat);
    const color = chat?.color || "";
    const isChatAdmin =
        user && chat?.admins.map((user) => user.uid).includes(user.uid);

    const repliedMessage = chat?.messages.find(
        (msg) => msg.uid === message.repliedTo
    );

    const repliedMessageSender = chat?.members.find(
        (member) => member.uid === repliedMessage?.sentBy
    );

    const isReply = !!repliedMessage && !!repliedMessageSender;

    const canDeleteMessage = isSender || user?.admin || isChatAdmin;
    const canReplyMessage = !isSender && !message.deleted;

    const SenderPhoto = () => (
        <Avatar
            src={sender.photo}
            alt={sender.name}
        />
    );

    useInterval(() => forceUpdate(), 1000);

    useEffect(() => {
        if (!chat) return;
        if (!message.repliedTo) return;
        if (repliedMessage) return;

        chat.loadMoreMessages();
    }, [message.repliedTo, repliedMessage, chat?.messages]);

    if (!user || !chat) return <></>;

    const handleDeleteMessage = () => {
        Api.chats
            .connect(user, wrapperChatToChat(chat))
            .deleteMessage(message.uid)
            .then(() => alert.success("Message deleted successfully"));
    };

    const handleReplyMessage = () => {
        if (onReply) onReply(message);
    };

    const baseProps = {
        isSender,
        showSender,
        color,
        wasReplied,
        isReply,
        deleted: message.deleted,
    };

    const baseButtonProps = {
        round: true,
        iconed: true,
        transparent: true,
        p: 6,
    };

    return (
        <MessageRow
            id={`${message.uid}`}
            {...baseProps}
        >
            {!isSender && showSender && <SenderPhoto />}
            {!isSender && !showSender && (
                <Container
                    transparent
                    width={width}
                />
            )}
            <MessageContainer {...baseProps}>
                {isReply && (
                    <MessageCard
                        message={repliedMessage}
                        sender={repliedMessageSender}
                        showSender={false}
                        wasReplied
                    />
                )}
                {showSender && (
                    <ShowItem>
                        <Columns
                            justify="center"
                            align="center"
                            width="fit-content"
                            gap={5}
                        >
                            <Title level={6}>
                                {isSender ? "You" : sender.name}
                            </Title>
                            <Paragraph variant="secondary">
                                {timeAgo(message.createdAt)}
                            </Paragraph>
                        </Columns>
                    </ShowItem>
                )}
                <Overlay
                    overlay={
                        <MessageActions isSender={isSender}>
                            {canDeleteMessage && (
                                <ShowItem>
                                    <Button
                                        {...baseButtonProps}
                                        onClick={handleDeleteMessage}
                                    >
                                        <Icon icon={<Delete />} />
                                    </Button>
                                </ShowItem>
                            )}

                            {canReplyMessage && (
                                <ShowItem>
                                    <Button
                                        {...baseButtonProps}
                                        onClick={handleReplyMessage}
                                    >
                                        <Icon icon={<Reply />} />
                                    </Button>
                                </ShowItem>
                            )}
                        </MessageActions>
                    }
                >
                    <MessageBalloon {...baseProps}>
                        {wasReplied && message.deleted ? (
                            "Message deleted"
                        ) : TextMessage.isTextMessage(message) ? (
                            message.text
                        ) : (
                            <></>
                        )}
                    </MessageBalloon>
                </Overlay>
            </MessageContainer>
            {isSender && showSender && <SenderPhoto />}
            {isSender && !showSender && (
                <Container
                    transparent
                    width={width}
                />
            )}
        </MessageRow>
    );
}

export default MessageCard;
export type { MessageCardProps };
