import { useState } from "react";

import { Container, Icon } from "@styles/layout";
import { Button, ButtonProps } from "@components";

import { ArrowIosForward } from "@styled-icons/evaicons-solid";
import { ArrowButton, DropdownContent } from "./styles";

interface DropdownProps extends Omit<ButtonProps, "onClick"> {
    label: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    width?: string;
    height?: string;
    gap?: number;
    arrow?: React.ReactNode;
}

function Dropdown(props: DropdownProps) {
    const {
        label,
        iconVariant = "primary",
        transparent = true,
        defaultOpen = false,
        width = "100%",
        height = "fit-content",
        gap = 0,
        arrow = <ArrowIosForward />,
        children,
        ...buttonProps
    } = props;

    const [open, setOpen] = useState(defaultOpen);

    const toggleDropdown = () => setOpen((prev) => !prev);

    return (
        <Container
            transparent
            direction="column"
            justify="start"
            align="start"
            width="fit-content"
            height="fit-content"
            gap={5}
        >
            <Button
                {...buttonProps}
                transparent={transparent}
                onClick={toggleDropdown}
            >
                <Container
                    transparent
                    direction="row"
                    justify="space-between"
                    align="center"
                    width={width}
                    height={height}
                    gap={gap}
                >
                    <span>{label}</span>
                    <ArrowButton
                        iconVariant={iconVariant}
                        open={open}
                    >
                        <Icon icon={arrow} />
                    </ArrowButton>
                </Container>
            </Button>
            <DropdownContent open={open}>{children}</DropdownContent>
        </Container>
    );
}

export default Dropdown;
export type { DropdownProps };
