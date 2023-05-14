import { useState } from "react";

import { Container, Icon } from "@styles/layout";
import { Avatar, Button, Tabs } from "@components";
import { useAuth } from "@providers";
import { Variant, Position } from "@types";

import { Settings } from "@styled-icons/feather";
import {
    ChatDots,
    Telephone,
    CameraVideo
} from "@styled-icons/bootstrap";

function Sidebar() {
    const [tab, setTab] = useState("chats");

    const { user } = useAuth()
    if (!user) return <></>;

    const padding = 5;

    const baseTabButton = {
        transparent: true,
        iconed: true
    };

    const tabs = [
        {
            id: "chats",
            button: {
                ...baseTabButton,
                selected: tab === "chats",
                children: <Icon icon={<ChatDots />} />
            }
        },
        {
            id: "voiceCalls",
            button: {
                ...baseTabButton,
                selected: tab === "voiceCalls",
                children: <Icon icon={<Telephone />} />
            }
        },
        {
            id: "videoCalls",
            button: {
                ...baseTabButton,
                selected: tab === "videoCalls",
                children: <Icon icon={<CameraVideo />} />
            }
        }
    ];

    const indicator = {
        position: "center-left" as Position,
        variant: "primary" as Variant,
        offset: 20,
        margin: 8,
        thickness: 3,
        borderRadius: 5
    };

    return (
        <Container
            direction="column"
            align="center"
            justify="space-between"
            width="fit-content"
            height={`calc(100vh - ${2 * padding}px)`}
            p={padding}
        >
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

            <Container
                direction="column"
                align="center"
                justify="end"
            >
                <Button
                    iconed
                    transparent
                >
                    <Icon icon={<Settings />} />
                </Button>

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
            </Container>
        </Container>
    );
}

export default Sidebar;