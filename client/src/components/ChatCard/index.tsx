import { Title, Paragraph } from "@styles/layout";
import { Avatar } from "@components";
import { WrapperChat } from "@types";
import { timeAgo } from "@functions";
import { useAuth } from "@providers";
import {
    Message,
    TextMessage,
    VideoMessage,
    AudioMessage,
    User,
} from "messaging-app-globals";

import { OuterContainer, InnerContainer, CardInfo } from "./styles";

interface ChatCardProps {
    chat: WrapperChat;
    onClick?: () => Promise<void> | void;
}

function ChatCard(props: ChatCardProps) {
    const { chat, onClick } = props;
    const { user } = useAuth();
    if (!user) return <></>;

    const otherMembers = chat.members.filter(
        (member) => member.uid !== user.uid
    );
    const firstMember = otherMembers[0];
    if (!firstMember) return <></>;

    const lastMessage = chat.getLastMessage();
    const senderUid = lastMessage?.sentBy;
    const sender = chat.members.find((member) => member.uid === senderUid);
    const senderName = sender?.uid === user.uid ? "You" : sender?.name;

    const Message = () => (
        <>
            {senderName && lastMessage ? (
                TextMessage.isTextMessage(lastMessage) ? (
                    `${senderName}: ${lastMessage.text} ${timeAgo(
                        lastMessage.createdAt
                    )}`
                ) : (
                    <></>
                )
            ) : (
                <></>
            )}
        </>
    );

    return (
        <OuterContainer onClick={onClick}>
            <InnerContainer>
                <Avatar
                    src={firstMember.photo}
                    alt={firstMember.name}
                />
                <CardInfo>
                    <Title level={5}>{firstMember.name}</Title>
                    <Paragraph variant="secondary">
                        <Message />
                    </Paragraph>
                </CardInfo>
            </InnerContainer>
        </OuterContainer>
    );
}

export default ChatCard;
export type { ChatCardProps };
