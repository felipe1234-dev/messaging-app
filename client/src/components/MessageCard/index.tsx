import { useAuth } from "@providers";
import { timeAgo } from "@functions";

import { MessageRow, MessageContainer, MessageBalloon } from "./styles";
import { Title, Columns, Paragraph } from "@styles/layout";

import { User, Message, TextMessage } from "messaging-app-globals";

import Avatar from "../Avatar";

interface MessageCardProps {
    message: Message;
    sender: User;
    showSender?: boolean;
}

function MessageCard(props: MessageCardProps) {
    const { sender, message, showSender = true } = props;
    const { user } = useAuth();
    if (!user) return <></>;

    const isSender = user.uid === sender.uid;

    const SenderPhoto = () => (
        <Avatar
            src={sender.photo}
            alt={sender.name}
        />
    );

    const baseProps = { isSender };

    return (
        <MessageRow {...baseProps}>
            {!isSender && showSender && <SenderPhoto />}
            <MessageContainer {...baseProps}>
                {showSender && (
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
                )}
                <MessageBalloon {...baseProps}>
                    {TextMessage.isTextMessage(message) ? message.text : <></>}
                </MessageBalloon>
            </MessageContainer>
            {isSender && showSender && <SenderPhoto />}
        </MessageRow>
    );
}

export default MessageCard;
export type { MessageCardProps };
