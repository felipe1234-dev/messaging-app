import { Container, Icon, Title } from "@styles/layout";
import { ShowItem } from "@styles/animations";

import { useAuth, useFriends, useModal } from "@providers";
import { Avatar, Carousel, Button, OnlineNow } from "@components";
import { FindFriendsModal } from "@modals";

import { PersonAdd } from "@styled-icons/ionicons-outline";

import { padding } from "./index";

function Friends() {
    const { user } = useAuth();
    const { friends } = useFriends();
    const modal = useModal();

    if (!user) return <></>;

    const onlineCount = friends.filter((friend) => friend.online).length;

    const handleFindNewFriends = () => {
        modal.show({
            variant: "primary",
            header: "Search for friends",
            body: <FindFriendsModal />,
        });
    };

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
                width="320px"
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
                        round
                        iconed
                        transparent
                        variant="secondary"
                        onClick={handleFindNewFriends}
                        p={16}
                    >
                        <Icon icon={<PersonAdd />} />
                    </Button>
                </Container>
                {friends.map((friend) => (
                    <ShowItem>
                        <Container
                            key={friend.uid}
                            transparent
                            direction="column"
                            align="center"
                            justify="center"
                            width="fit-content"
                        >
                            {friend.online ? (
                                <OnlineNow>
                                    <Avatar
                                        src={friend.photo}
                                        alt={friend.name}
                                    />
                                </OnlineNow>
                            ) : (
                                <Avatar
                                    src={friend.photo}
                                    alt={friend.name}
                                />
                            )}
                        </Container>
                    </ShowItem>
                ))}
            </Carousel>
        </Container>
    );
}

export default Friends;
