import { Container, Paragraph, Icon } from "@styles/layout";
import { Avatar, Button, Badge } from "@components";
import { useAuth } from "@providers";

import { Settings } from "@styled-icons/ionicons-outline";
import { Circle } from "@styled-icons/material-rounded";

function Profile() {
    const { user } = useAuth();
    if (!user) return <></>;

    const padding = 25;

    return (
        <Container
            transparent
            direction="row"
            justify="start"
            align="center"
            width="100%"
            height="fit-content"
        >
            <Container
                transparent
                direction="row"
                justify="start"
                align="center"
                width={`calc(100% - ${padding}px)`}
                height="fit-content"
                gap={20}
                p={padding}
            >
                <Badge
                    badge={<Icon variant="success" icon={<Circle />} />}
                    mr={-5}
                >
                    <Avatar
                        src={user.photo}
                        alt={user.name}
                        size={1.2}
                        borderWidth={3}
                        borderVariant="highlight"
                        borderStyle="solid"
                        borderOffset={3}
                    />
                </Badge>

                <Container
                    transparent
                    direction="column"
                    justify="center"
                    align="start"
                    gap={5}
                >
                    <Paragraph variant="primary" size={1.2}>
                        {user.name}
                    </Paragraph>
                    <Paragraph variant="secondary" size={0.8}>
                        {user.bio}
                    </Paragraph>
                </Container>

                <Button transparent iconed round p={8}>
                    <Icon icon={<Settings />} />
                </Button>
            </Container>
        </Container>
    );
}

export default Profile;