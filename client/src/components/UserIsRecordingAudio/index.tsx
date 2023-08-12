import { User } from "messaging-app-globals";
import { Avatar } from "@components";
import { Container, Paragraph, TextSpan } from "@styles/layout";
import { ShowItem } from "@styles/animations";

interface UserIsRecordingAudioProps {
    user: User;
}

function UserIsRecordingAudio(props: UserIsRecordingAudioProps) {
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
                    recording an audio...
                </Paragraph>
            </ShowItem>
        </Container>
    );
}

export default UserIsRecordingAudio;
export type { UserIsRecordingAudioProps };
