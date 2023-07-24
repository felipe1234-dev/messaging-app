import { Container, Paragraph, Icon } from "@styles/layout";

import { Avatar, Button, OnlineNow } from "@components";
import { useAuth, useModal } from "@providers";
import { ProfileModal } from "@modals";

import { Settings } from "@styled-icons/ionicons-outline";

import { padding } from "./index";

function Profile() {
    const { user } = useAuth();
    const modal = useModal();

    if (!user) return <></>;

    const handleEditProfile = () => {
        modal.show({
            header: "Your profile",
            body: <ProfileModal />,
        });
    };

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
                <OnlineNow>
                    <Avatar
                        src={user.photo}
                        alt={user.name}
                        size={1.2}
                        borderWidth={2.3}
                        borderVariant="highlight"
                        borderStyle="solid"
                        borderOffset={3}
                    />
                </OnlineNow>

                <Container
                    transparent
                    direction="column"
                    justify="center"
                    align="start"
                    gap={5}
                >
                    <Paragraph
                        variant="primary"
                        size={1.2}
                    >
                        {user.name}
                    </Paragraph>
                    <Paragraph
                        variant="secondary"
                        size={0.8}
                    >
                        {user.bio}
                    </Paragraph>
                </Container>

                <Button
                    round
                    iconed
                    transparent
                    onClick={handleEditProfile}
                    p={8}
                >
                    <Icon icon={<Settings />} />
                </Button>
            </Container>
        </Container>
    );
}

export default Profile;
