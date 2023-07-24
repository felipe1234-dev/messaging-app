import React from "react";

import { Container, Icon } from "@styles/layout";
import { Button, Dropdown } from "@components";
import { padding } from "../index";

import { PenToSquare } from "@styled-icons/fa-regular";
import { CreateGroup } from "@icons";

import Directs from "./Directs";
import Groups from "./Groups";

interface DropdownListProps {
    label: string;
    action: {
        onClick: (
            evt: React.MouseEvent<HTMLButtonElement>
        ) => void | Promise<void>;
        icon: React.ReactNode;
    };
    list: React.ReactNode;
}

const DropdownList = ({ label, action, list }: DropdownListProps) => (
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
            onClick={action.onClick}
            p={8}
        >
            <Icon icon={action.icon} />
        </Button>
    </Container>
);

function ChatList() {
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
                <DropdownList
                    label="Directs"
                    list={<Directs />}
                    action={{
                        onClick: (evt) => {},
                        icon: <PenToSquare />,
                    }}
                />

                <DropdownList
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

export default ChatList;
