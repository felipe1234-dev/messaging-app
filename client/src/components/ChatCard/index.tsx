import { useMemo } from "react";
import { TextMessage } from "messaging-app-globals";

import { Title, TextSpan, Icon } from "@styles/layout";

import { WrapperChat } from "@types";
import { timeAgo } from "@functions";
import { useAuth } from "@providers";
import { useForceUpdate, useInterval } from "@hooks";

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
import MessageView from "../MessageView";

import { Attachment } from "@styled-icons/icomoon";

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

    const otherMembers = chat.members.filter(
        (member) => member.uid !== user?.uid
    );
    const firstMember = otherMembers[0];
    const lastMessage = chat.getNewestMessage();
    const isTextMessage = TextMessage.isTextMessage(lastMessage);
    const senderUid = lastMessage?.sentBy;
    const sender = chat.members.find((member) => member.uid === senderUid);
    const senderName = sender?.uid === user?.uid ? "You" : sender?.name;
    const isSender = user?.uid === sender?.uid;
    const chatTitle =
        chat.title || otherMembers.map((member) => member.name).join(", ");

    const usersTyping = useMemo(() => {
        const users = otherMembers.filter((member) =>
            chat.typing.includes(member.uid)
        );

        return users.length === 1
            ? `${users[0].name} is typing...`
            : users.length > 1
            ? `${users.map((user) => user.name).join(", ")} are typing...`
            : "";
    }, [chat.typing, otherMembers]);

    const usersRecordingAudio = useMemo(() => {
        const users = otherMembers.filter((member) =>
            chat.recordingAudio.includes(member.uid)
        );

        return users.length === 1
            ? `${users[0].name} is recording an audio...`
            : users.length > 1
            ? `${users
                  .map((user) => user.name)
                  .join(", ")} are recording audio...`
            : "";
    }, [chat.recordingAudio, otherMembers]);

    const cardText =
        usersTyping ||
        usersRecordingAudio ||
        (lastMessage && (
            <MessageView
                shortened
                message={lastMessage}
            />
        ));

    const unseenCount = chat.messages.reduce((sum, msg) => {
        if (user && msg.sentBy !== user.uid && !msg.wasViewedBy(user.uid))
            return sum + 1;
        return sum;
    }, 0);

    const Profile = () => (
        <Avatar
            src={firstMember.photo}
            alt={firstMember.name}
        />
    );

    if (!user) return <></>;

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
                            {isTextMessage &&
                                lastMessage.attachments &&
                                lastMessage.attachments.length > 0 && (
                                    <TextSpan
                                        flex
                                        ml={8}
                                    >
                                        <Icon icon={<Attachment />} />
                                        <TextSpan ml={8}>
                                            {lastMessage.attachments.length}
                                        </TextSpan>
                                    </TextSpan>
                                )}
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
