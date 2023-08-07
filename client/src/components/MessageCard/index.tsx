import { useState, useEffect } from "react";

import { useAuth, useChats, useAlert } from "@providers";
import { useInterval, useForceUpdate } from "@hooks";
import { timeAgo } from "@functions";
import { Api } from "@services";

import { User, Message, TextMessage } from "messaging-app-globals";

import {
    Title,
    Columns,
    Paragraph,
    Container,
    Icon,
    TextSpan,
} from "@styles/layout";
import {
    MessageRow,
    MessageContainer,
    MessageBalloon,
    MessageActions,
    NotViewedMark,
    BalloonOverlay,
} from "./styles";
import { ShowItem } from "@styles/animations";

import Avatar from "../Avatar";
import Button from "../Button";
import MessageView from "../MessageView";

import { Delete } from "@styled-icons/fluentui-system-regular";
import { Reply } from "@styled-icons/bootstrap";
import { EditAlt } from "@styled-icons/boxicons-regular";

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

    const [repliedMessage, setRepliedMessage] = useState<Message>();

    const isSender = user?.uid === sender.uid;
    const chat = chats.find((c) => c.uid === message.chat);
    const color = chat?.color || "";
    const isChatAdmin =
        user && chat?.admins.map((user) => user.uid).includes(user.uid);

    const repliedMessageSender = chat?.members.find(
        (member) => member.uid === repliedMessage?.sentBy
    );

    const isReply = !!repliedMessage && !!repliedMessageSender;
    const canDeleteMessage = isSender || user?.admin || isChatAdmin;
    const canReplyMessage = !isSender && !message.deleted;
    const canEditMessage = isSender && !message.deleted;
    const wasViewed = !!user?.uid && message.wasViewedBy(user.uid);

    useInterval(() => forceUpdate(), 1000);

    useEffect(() => {
        if (!user) return;
        if (!chat) return;
        if (!message.repliedTo) return;

        const foundMsg = chat?.messages.find(
            (msg) => msg.uid === message.repliedTo
        );
        if (foundMsg) return setRepliedMessage(foundMsg);

        Api.chats
            .connect(user, chat)
            .getMessage(message.repliedTo)
            .then(setRepliedMessage);
    }, [user?.uid, message.repliedTo, chat?.messages]);

    if (!user || !chat || !sender) return <></>;

    const handleDeleteMessage = () => {
        Api.chats
            .connect(user, chat)
            .deleteMessage(message.uid)
            .then(() => alert.success("Message deleted successfully"));
    };

    const handleReplyMessage = () => {
        if (onReply) onReply(message);
    };

    const handleEditMessage = () => {
        if (onEdit) onEdit(message);
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

    const SenderPhoto = () => (
        <Avatar
            src={sender.photo}
            alt={sender.name}
        />
    );

    const Actions = () => (
        <MessageActions>
            {canDeleteMessage && (
                <Button
                    {...baseButtonProps}
                    onClick={handleDeleteMessage}
                >
                    <Icon icon={<Delete />} />
                </Button>
            )}

            {canReplyMessage && (
                <Button
                    {...baseButtonProps}
                    onClick={handleReplyMessage}
                >
                    <Icon icon={<Reply />} />
                </Button>
            )}

            {canEditMessage && (
                <Button
                    {...baseButtonProps}
                    onClick={handleEditMessage}
                >
                    <Icon icon={<EditAlt />} />
                </Button>
            )}
        </MessageActions>
    );

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
                {showSender && !isReply && (
                    <ShowItem>
                        <Columns
                            justify="center"
                            align="center"
                            width="fit-content"
                            gap={5}
                        >
                            <Title
                                level={6}
                                variant="highlight"
                            >
                                {isSender ? "You" : sender.name}
                            </Title>
                            <Paragraph variant="secondary">
                                {timeAgo(message.createdAt)}
                            </Paragraph>
                        </Columns>
                    </ShowItem>
                )}
                {isReply && !wasReplied && (
                    <ShowItem>
                        <Columns
                            justify="center"
                            align="center"
                            width="fit-content"
                            gap={5}
                        >
                            <Title level={6}>
                                <TextSpan variant="highlight">
                                    {isSender ? "You" : sender.name}
                                </TextSpan>{" "}
                                replied to{" "}
                                <TextSpan variant="highlight">
                                    {repliedMessageSender.name}
                                </TextSpan>
                            </Title>
                            <Paragraph variant="secondary">
                                {timeAgo(message.createdAt)}
                            </Paragraph>
                        </Columns>
                    </ShowItem>
                )}
                {isReply && !wasReplied && (
                    <MessageCard
                        message={repliedMessage}
                        sender={repliedMessageSender}
                        showSender={false}
                        wasReplied
                    />
                )}
                <Container
                    transparent
                    direction="row"
                    width="fit-content"
                >
                    {!wasReplied && isSender && !wasViewed && <NotViewedMark />}
                    <BalloonOverlay>
                        {isSender && !wasReplied && <Actions />}
                        <MessageBalloon {...baseProps}>
                            <MessageView
                                message={message}
                                wasReplied={wasReplied}
                            />
                        </MessageBalloon>
                        {!isSender && !wasReplied && <Actions />}
                    </BalloonOverlay>
                    {!wasReplied && !isSender && !wasViewed && (
                        <NotViewedMark />
                    )}
                </Container>
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
