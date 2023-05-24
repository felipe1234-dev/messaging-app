import React from "react";

import { Container, Icon } from "@styles/layout";
import { Button, Dropdown } from "@components";
import { padding } from "../index";

import { PenToSquare } from "@styled-icons/fa-regular";
import { CreateGroup } from "@icons";

import Directs from "./Directs";
import Groups from "./Groups";

interface ChatListProps {
    label: string;
    action: {
        onClick: (
            evt: React.MouseEvent<HTMLButtonElement>
        ) => void | Promise<void>;
        icon: React.ReactNode;
    };
    list: React.ReactNode;
}

const ChatList = ({ label, action, list }: ChatListProps) => (
    <Container
        transparent
        direction="row"
        justify="space-between"
        align="baseline"
    >
        <Dropdown
            defaultOpen
            hoverDisabled
            label={label}
            iconVariant="primary"
            px={0}
            width="fit-content"
            gap={5}
        >
            {list}
        </Dropdown>

        <Button
            round
            iconed
            transparent
            p={8}
            onClick={action.onClick}
        >
            <Icon icon={action.icon} />
        </Button>
    </Container>
);

function Messages() {
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
                direction="column"
                justify="start"
                align="center"
                width={`calc(100% - ${padding}px)`}
                height="fit-content"
                gap={20}
                p={padding}
            >
                <ChatList
                    label="Directs"
                    list={<Directs />}
                    action={{
                        onClick: (evt) => {},
                        icon: <PenToSquare />,
                    }}
                />

                <ChatList
                    label="Groups"
                    list={<Groups />}
                    action={{
                        onClick: (evt) => {},
                        icon: <CreateGroup />,
                    }}
                />
            </Container>
        </Container>
    );
}

export default Messages;
