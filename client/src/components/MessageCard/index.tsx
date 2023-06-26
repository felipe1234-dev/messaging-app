import { useAuth } from "@providers";
import { timeAgo } from "@functions";
import { useInterval, useForceUpdate } from "@hooks";

import { Title, Columns, Paragraph, Container } from "@styles/layout";
import { MessageRow, MessageContainer, MessageBalloon } from "./styles";

import { User, Message, TextMessage } from "messaging-app-globals";

import Avatar from "../Avatar";

const width = "35px";

interface MessageCardProps {
    message: Message;
    sender: User;
    showSender?: boolean;
}

function MessageCard(props: MessageCardProps) {
    const { sender, message, showSender = true } = props;
    const { user } = useAuth();
    const { forceUpdate } = useForceUpdate();

    const isSender = user?.uid === sender.uid;

    const SenderPhoto = () => (
        <Avatar
            src={sender.photo}
            alt={sender.name}
        />
    );

    const baseProps = { isSender, showSender };

    useInterval(() => forceUpdate(), 1000);

    if (!user) return <></>;

    return (
        <MessageRow {...baseProps}>
            {!isSender && showSender && <SenderPhoto />}
            {!isSender && !showSender && <Container width={width} />}
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
            {isSender && !showSender && <Container width={width} />}
        </MessageRow>
    );
}

export default MessageCard;
export type { MessageCardProps };
