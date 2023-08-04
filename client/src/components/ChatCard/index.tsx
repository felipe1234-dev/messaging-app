import { Title, Paragraph } from "@styles/layout";

import { WrapperChat } from "@types";
import { timeAgo } from "@functions";
import { useAuth } from "@providers";
import { useForceUpdate, useInterval } from "@hooks";

import {
    Message,
    TextMessage,
    VideoMessage,
    AudioMessage,
    User,
} from "messaging-app-globals";

import {
    OuterContainer,
    InnerContainer,
    CardBody,
    CardSender,
    CardDate,
    CardInfo,
    CardText,
    UnseenMessagesCounter,
} from "./styles";

import Avatar from "../Avatar";
import OnlineNow from "../OnlineNow";

interface ChatCardProps {
    chat: WrapperChat;
    onClick?: () => Promise<void> | void;
    selected?: boolean;
}

function ChatCard(props: ChatCardProps) {
    const { chat, onClick, selected = false } = props;
    const { user } = useAuth();

    const { forceUpdate } = useForceUpdate();
    useInterval(() => forceUpdate(), 1000);

    if (!user) return <></>;

    const otherMembers = chat.members.filter(
        (member) => member.uid !== user.uid
    );
    const firstMember = otherMembers[0];
    if (!firstMember) return <></>;

    const lastMessage = chat.getNewestMessage();
    const senderUid = lastMessage?.sentBy;
    const sender = chat.members.find((member) => member.uid === senderUid);
    const senderName = sender?.uid === user.uid ? "You" : sender?.name;
    const isSender = user?.uid === sender?.uid;
    const chatTitle =
        chat.title || otherMembers.map((member) => member.name).join(", ");

    const usersTyping = otherMembers.filter((member) =>
        chat.typing.includes(member.uid)
    );

    const cardText =
        usersTyping.length === 1 ? (
            `${usersTyping[0].name} is typing...`
        ) : usersTyping.length > 1 ? (
            `${usersTyping.map((user) => user.name).join(", ")} are typing...`
        ) : TextMessage.isTextMessage(lastMessage) ? (
            lastMessage.text
        ) : (
            <></>
        );

    const unseenCount = chat.messages.reduce((sum, msg) => {
        if (msg.sentBy !== user.uid && !msg.wasViewedBy(user.uid))
            return sum + 1;
        return sum;
    }, 0);

    const Profile = () => (
        <Avatar
            src={firstMember.photo}
            alt={firstMember.name}
        />
    );

    return (
        <OuterContainer
            onClick={onClick}
            selected={selected}
        >
            <InnerContainer>
                {firstMember.online ? (
                    <OnlineNow>
                        <Profile />
                    </OnlineNow>
                ) : (
                    <Profile />
                )}
                <CardBody>
                    <Title level={5}>{chatTitle}</Title>
                    <CardInfo>
                        <CardSender>
                            {isSender ? "You: " : senderName}
                            <CardText>{cardText}</CardText>
                        </CardSender>
                        {lastMessage && (
                            <CardDate>
                                {timeAgo(lastMessage.createdAt)}
                            </CardDate>
                        )}
                        {unseenCount > 0 && (
                            <UnseenMessagesCounter color={chat.color}>
                                {unseenCount > 9 ? "9+" : unseenCount}
                            </UnseenMessagesCounter>
                        )}
                    </CardInfo>
                </CardBody>
            </InnerContainer>
        </OuterContainer>
    );
}

export default ChatCard;
export type { ChatCardProps };
