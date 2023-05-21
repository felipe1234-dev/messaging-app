import { Container, Paragraph, Icon } from "@styles/layout";
import { Avatar, Button, Badge } from "@components";
import { useAuth } from "@providers";

import { Settings } from "@styled-icons/ionicons-outline";
import { Circle } from "@styled-icons/material-rounded";

function Profile() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Container
            variant="primary"
            direction="row"
            justify="space-between"
            align="center"
            width="100%"
            height="fit-content"
        >
            <Container
                direction="row"
                justify="start"
                align="center"
                gap={10}
                p={10}
                width="100%"
                height="fit-content"
            >
                <Badge badge={<Icon icon={<Circle />} />}>
                    <Avatar
                        src={user.photo}
                        alt={user.name}
                    />
                </Badge>

                <Container
                    direction="column"
                    justify="center"
                    align="start"
                    gap={3}
                >
                    <Paragraph variant="primary">
                        {user.name}
                    </Paragraph>
                    <Paragraph variant="secondary">
                        {user.bio}
                    </Paragraph>
                </Container>

                <Button transparent iconed round>
                    <Icon icon={<Settings />} />
                </Button>
            </Container>
        </Container>
    );
}

export default Profile;