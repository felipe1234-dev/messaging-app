import { useState } from "react";

import { Container, Icon } from "@styles/layout";
import { Button, ButtonProps } from "@components";

import { ArrowIosForward } from "@styled-icons/evaicons-solid";
import {
    DropdownContainer,
    ButtonContainer,
    ArrowButton,
    DropdownContent,
} from "./styles";

interface DropdownProps extends Omit<ButtonProps, "onClick"> {
    label: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    width?: string;
    height?: string;
    gap?: number;
    arrow?: React.ReactNode;
    secondaryActions?: React.ReactNode;
}

function Dropdown(props: DropdownProps) {
    const {
        label,
        iconVariant = "primary",
        transparent = true,
        fullWidth = false,
        defaultOpen = false,
        width = "100%",
        height = "fit-content",
        gap = 0,
        arrow = <ArrowIosForward />,
        secondaryActions = <></>,
        children,
        ...containerProps
    } = props;

    const [open, setOpen] = useState(defaultOpen);

    const toggleDropdown = () => setOpen((prev) => !prev);

    return (
        <DropdownContainer>
            <ButtonContainer>
                <Button
                    fullWidth
                    transparent
                    onClick={toggleDropdown}
                    direction="row"
                    justify="space-between"
                >
                    <span>{label}</span>
                    <ArrowButton
                        iconVariant={iconVariant}
                        open={open}
                    >
                        <Icon icon={arrow} />
                    </ArrowButton>
                </Button>

                {secondaryActions}
            </ButtonContainer>
            <DropdownContent open={open}>{children}</DropdownContent>
        </DropdownContainer>
    );
}

export default Dropdown;
export type { DropdownProps };
