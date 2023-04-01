import { Container, Icon, Paragraph } from "@styles/layout";
import { Avatar, Button } from "@components";
import { useAuth } from "@providers";

import { ThreeDots as Dots } from "@styled-icons/bootstrap";

function Actions() {
    const { user } = useAuth();

    if (!user) return <></>;

    return (
        <Container
            direction="row"
            justify="space-between"
            align="center"
        >
            <Container
                direction="row"
                justify="start"
                align="center"
            >
                <Avatar
                    src={user.photo}
                    alt={user.name}
                />
                <Container
                    direction="column"
                    justify="center"
                    align="start"
                    gap={5}
                >
                    <Paragraph
                        variant="primary"
                        size={1}
                    >
                        {user.name}
                    </Paragraph>
                    {user.bio && (
                        <Paragraph
                            variant="secondary"
                            size={0.8}
                        >
                            {user.bio}
                        </Paragraph>
                    )}
                </Container>
            </Container>

            <Button
                iconed
                transparent
            >
                <Icon icon={<Dots />} size={1.5} />
            </Button>
        </Container>
    );
}

export default Actions;