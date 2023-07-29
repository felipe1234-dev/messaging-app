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

const width = "44px";

interface MessageCardProps {
    message: Message;
    sender: User;
    showSender?: boolean;
}

function MessageCard(props: MessageCardProps) {
    const { sender, message, showSender = true } = props;

    const { user } = useAuth();
    const { chats } = useChats();
    const alert = useAlert();
    const { forceUpdate } = useForceUpdate();

    const isSender = user?.uid === sender.uid;
    const chat = chats.find((c) => c.uid === message.chat);
    const color = chat?.color || "";
    const isChatAdmin =
        user && chat?.admins.map((user) => user.uid).includes(user.uid);

    const canDeleteMessage = isSender || user?.admin || isChatAdmin;

    const SenderPhoto = () => (
        <Avatar
            src={sender.photo}
            alt={sender.name}
        />
    );

    useInterval(() => forceUpdate(), 1000);

    if (!user || !chat) return <></>;

    const handleDeleteMessage = () => {
        Api.chats
            .connect(user, wrapperChatToChat(chat))
            .deleteMessage(message.uid)
            .then(() => alert.success("Message deleted successfully"));
    };

    const baseProps = {
        isSender, 
        showSender, 
        color, 
        deleted: message.deleted 
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
                                        round
                                        iconed
                                        transparent
                                        onClick={handleDeleteMessage}
                                        p={6}
                                    >
                                        <Icon icon={<Delete />} />
                                    </Button>
                                </ShowItem>
                            )}
                        </MessageActions>
                    }
                >
                    <MessageBalloon {...baseProps}>
                        {TextMessage.isTextMessage(message) ? (
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
