import { useMemo } from "react";
import { Container, Title, Paragraph } from "@styles/layout";
import { Avatar } from "@components";
import { useAuth } from "@providers";
import {
    Message,
    TextMessage,
    VideoMessage,
    AudioMessage,
    User,
} from "messaging-app-globals";

interface ChatCardProps {
    thumbnail?: string;
    members: User[];
    lastMessage: Message;
}

function ChatCard(props: ChatCardProps) {
    const { members, lastMessage } = props;
    const { user } = useAuth();

    const otherMembers = useMemo(
        () => members.filter((member) => member.uid !== user?.uid),
        [user?.uid, members]
    );
    const firstMember = otherMembers[0];

    if (!user) return <></>;
    if (!firstMember) return <></>;

    return (
        <Container
            transparent
            direction="row"
            align="center"
            justify="space-between"
        >
            <Container
                transparent
                direction="row"
                align="center"
                justify="start"
            >
                <Avatar
                    src={firstMember.photo}
                    alt={firstMember.name}
                />
                <Container
                    transparent
                    direction="column"
                    align="start"
                    justify="center"
                >
                    <Title>{firstMember.name}</Title>
                    <Paragraph>
                        {TextMessage.isTextMessage(lastMessage) ? (
                            lastMessage.text
                        ) : (
                            <></>
                        )}
                    </Paragraph>
                </Container>
            </Container>
        </Container>
    );
}

export default ChatCard;
export type { ChatCardProps };
