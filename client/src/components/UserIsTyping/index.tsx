import { User } from "messaging-app-globals";
import { Avatar } from "@components";
import { Container, Paragraph, TextSpan } from "@styles/layout";
import { ShowItem } from "@styles/animations";

interface UserIsTypingProps {
    user: User;
}

function UserIsTyping(props: UserIsTypingProps) {
    const { user } = props;
    return (
        <Container
            transparent
            direction="row"
            align="center"
            justify="start"
            gap={8}
            width="100%"
        >
            <ShowItem>
                <Avatar
                    src={user.photo}
                    alt={user.name}
                />
            </ShowItem>
            <ShowItem>
                <Paragraph variant="secondary">
                    <TextSpan variant="highlight">{user.name}</TextSpan> is
                    typing...
                </Paragraph>
            </ShowItem>
        </Container>
    );
}

export default UserIsTyping;
export type { UserIsTypingProps };
