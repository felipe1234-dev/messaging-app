import { Container, Paragraph } from "@styles/layout";
import { WrapperChat } from "@types";
import { Avatar } from "@components";
import { useAuth } from "@providers";

interface ChatCardProps {
    chat: WrapperChat;
}

function ChatCard(props: ChatCardProps) {
    const { chat } = props;
    const { user } = useAuth();
    if (!user) return <></>;

    const otherMembers = chat.members.filter(member => member.uid !== user.uid);
    const src = chat.thumbnail ? [chat.thumbnail] : otherMembers.map(member => member.photo);
    const alt = chat.title ? [chat.title] : otherMembers.map(member => member.name);
    const chatTitle = chat.title || otherMembers.map(member => member.name);
    const lastMessage = chat.getLastMessage();

    return (
        <Container
            direction="row"
            justify="start"
            align="center"
        >
            <Avatar 
                multiple
                src={src}
                alt={alt}
            />
            <Container
                direction="column"
                justify="center"
                align="center"
            >
                <Paragraph>{chatTitle}</Paragraph>
            </Container>
        </Container>
    );
}

export default ChatCard;