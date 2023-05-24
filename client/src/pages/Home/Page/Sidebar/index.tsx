import { useState } from "react";

import { Container, Icon, Title } from "@styles/layout";
import { appName } from "@constants";
import { Button, Tabs } from "@components";
import { useAuth, useTheme, useLoader } from "@providers";
import { Variant } from "@types";

import { Sun, Moon, People } from "@styled-icons/bootstrap";
import {
    Call,
    ChatMultiple,
    VideoChat,
} from "@styled-icons/fluentui-system-regular";
import { LogOut } from "@styled-icons/boxicons-regular";

function Sidebar() {
    const loader = useLoader();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [tab, setTab] = useState("textChats");

    const iconSize = 1.3;

    const icons = {
        textChats: <ChatMultiple />,
        voiceChats: <Call />,
        videoChats: <VideoChat />,
        friendRequests: <People />,
    };

    const generateTabProps = (id: keyof typeof icons) => ({
        id,
        button: {
            round: true,
            iconed: true,
            transparent: true,
            size: iconSize,
            p: 8,
            borderRadius: 0,
            iconVariant: (tab === id ? "highlight" : "secondary") as Variant,
            children: <Icon icon={icons[id]} />,
        },
    });

    const tabs = [
        generateTabProps("textChats"),
        generateTabProps("videoChats"),
        generateTabProps("voiceChats"),
        generateTabProps("friendRequests"),
    ];

    const handleLogout = async () => {
        loader.show();
        await logout();
        loader.hide();
    };

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
                <Title level={3}>{appName[0]}.</Title>

                <Tabs
                    direction="column"
                    align="center"
                    justify="start"
                    height="fit-content"
                    gap={5}
                    active={tab}
                    tabs={tabs}
                    onSelect={(selectedTab) => setTab(selectedTab.id)}
                    indicator={{
                        variant: "highlight",
                        margin: -3,
                        thickness: 3,
                    }}
                />

                <Container
                    transparent
                    direction="column"
                    align="center"
                    justify="start"
                    height="fit-content"
                >
                    <Button
                        transparent
                        iconed
                        round
                        onClick={toggleTheme}
                        size={iconSize}
                        p={8}
                    >
                        <Icon icon={theme === "light" ? <Moon /> : <Sun />} />
                    </Button>
                    <Button
                        transparent
                        iconed
                        round
                        onClick={handleLogout}
                        size={iconSize}
                        p={8}
                    >
                        <Icon icon={<LogOut />} />
                    </Button>
                </Container>
            </Container>
        </Container>
    );
}

export default Sidebar;
