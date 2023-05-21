import { useState } from "react";

import {
    Container,
    Icon,
    Whitespace,
    Title
} from "@styles/layout";
import { appName } from "@constants";
import { Button, Tabs } from "@components";
import { useTheme } from "@providers";
import { Variant } from "@types";

import { Sun, Moon, People } from "@styled-icons/bootstrap";
import { Call, ChatMultiple, VideoChat } from "@styled-icons/fluentui-system-regular";

function Sidebar() {
    const { theme, toggleTheme } = useTheme();
    const [tab, setTab] = useState("textChats");

    const iconSize = 1.5;

    const icons = {
        textChats: <ChatMultiple />,
        voiceChats: <Call />,
        videoChats: <VideoChat />,
        friendRequests: <People />
    };

    const generateTabProps = (id: keyof typeof icons) => ({
        id,
        button: {
            iconed: true,
            transparent: true,
            size: iconSize,
            iconVariant: (tab === id ? "primary" : "secondary") as Variant,
            children: <Icon icon={icons[id]} />
        }
    });

    const tabs = [
        generateTabProps("textChats"),
        generateTabProps("videoChats"),
        generateTabProps("voiceChats"),
        generateTabProps("friendRequests")
    ];

    return (
        <Container
            variant="primary"
            height="100%"
            width="fit-content"
        >
            <Container
                transparent
                direction="column"
                justify="space-between"
                height="100%"
                width="fit-content"
                gap={0}
                p={5}
            >
                <Title level={3}>
                    {appName[0]}.
                </Title>

                <Tabs
                    direction="column"
                    align="center"
                    justify="start"
                    height="fit-content"
                    gap={5}
                    active={tab}
                    tabs={tabs}
                    onSelect={selectedTab => setTab(selectedTab.id)}
                    indicator={{ thickness: 0 }}
                />

                <Button
                    transparent iconed round
                    onClick={toggleTheme}
                    size={iconSize}
                >
                    <Icon icon={theme === "light" ? <Moon /> : <Sun />} />
                </Button>
            </Container>
        </Container>
    );
}

export default Sidebar;