import { useState } from "react";

import { Container, Icon, Divider } from "@styles/layout";
import { Avatar, Button, Tabs } from "@components";
import { useAuth } from "@providers";
import { Variant, Position } from "@types";

import { ChatSquareDotsFill, PeopleFill } from "@styled-icons/bootstrap";
import { Phone } from "@styled-icons/boxicons-solid";
import { VideoChat } from "@styled-icons/fluentui-system-filled";
import { NewMessage } from "@styled-icons/entypo";

const icons = {
    textChats: <ChatSquareDotsFill />,
    voiceChats: <Phone />,
    videoChats: <VideoChat />,
    friendRequests: <PeopleFill />
};

const baseTabButton = {
    transparent: true,
    iconed: true
};

const indicator = {
    position: "center-left" as Position,
    variant: "highlight" as Variant,
    offset: 0,
    margin: 1,
    thickness: 3,
    borderRadius: 5
};

function Sidebar() {
    const [tab, setTab] = useState("textChats");

    const { user } = useAuth()
    if (!user) return <></>;

    const generateTabProps = (id: keyof typeof icons) => ({
        id,
        button: {
            ...baseTabButton,
            iconVariant: (tab === id ? "highlight" : "secondary") as Variant,
            selected: tab === id,
            children: <Icon icon={icons[id]} />
        }
    })

    const tabs = [
        generateTabProps("textChats"),
        generateTabProps("videoChats"),
        generateTabProps("voiceChats"),
        generateTabProps("friendRequests")
    ];

    return (
        <Container
            direction="column"
            align="center"
            justify="space-between"
            width="fit-content"
            height="100%"
        >
            <Container
                direction="column"
                justify="start"
                align="center"
                height="fit-content"
            >
                <Button
                    iconed
                    transparent
                >
                    <Avatar
                        src={user.photo}
                        alt={user.name}
                        size={0.55}
                    />
                </Button>

                <Divider size={0.6} thickness={2.8} />

                <Tabs
                    direction="column"
                    align="center"
                    justify="start"
                    gap={5}
                    active={tab}
                    tabs={tabs}
                    onSelect={selectedTab => setTab(selectedTab.id)}
                    indicator={indicator}
                />

                <Divider size={0.6} thickness={2.8} />

                <Button iconVariant="secondary" transparent iconed>
                    <Icon icon={<NewMessage />} />
                </Button>
            </Container>

        </Container>
    );
}

export default Sidebar;