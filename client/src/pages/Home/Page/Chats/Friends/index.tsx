import { Container, Icon, Title } from "@styles/layout";
import { useAuth } from "@providers";
import { Avatar, Carousel, Button } from "@components";

import { PersonAdd } from "@styled-icons/ionicons-outline";

function Friends() {
    const { user } = useAuth();
    if (!user) return <></>;

    const onlineCount = user.friends.filter((friend) => friend.online).length;
    const padding = 25;

    return (
        <Container
            transparent
            direction="column"
            justify="start"
            align="start"
            width="100%"
            height="fit-content"
        >
            <Container
                transparent
                direction="row"
                justify="space-between"
                align="center"
                width={`calc(100% - ${2 * padding}px)`}
                height="fit-content"
                pt={padding}
                px={padding}
                pb={0}
            >
                <Title level={5}>Online now</Title>

                <Button
                    noInteraction
                    iconed
                    round
                    variant="highlight"
                    py={0}
                    px={9}
                >
                    {onlineCount}
                </Button>
            </Container>

            <Carousel
                draggable
                hideScrollbar
                scrollWithWheel
                direction="row"
                justify="start"
                align="center"
                width="360px"
                height="fit-content"
                gap={10}
                py={padding / 2}
                px={padding}
            >
                <Container
                    variant="secondary"
                    rounded="50%"
                    width="fit-content"
                    height="fit-content"
                    light={0.2}
                    p={3}
                >
                    <Button
                        iconed
                        round
                        transparent
                        variant="secondary"
                        p={16}
                    >
                        <Icon icon={<PersonAdd />} />
                    </Button>
                </Container>
                {user.friends.map((friend) => (
                    <Container
                        key={friend.uid}
                        direction="column"
                        align="center"
                        justify="center"
                    >
                        <Avatar
                            src={friend.photo}
                            alt={friend.name}
                        />
                    </Container>
                ))}
            </Carousel>
        </Container>
    );
}

export default Friends;
