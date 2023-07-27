import { useState } from "react";

import { Container, Icon } from "@styles/layout";
import { Button, ButtonProps } from "@components";
import { Variant } from "@types";

import { ArrowIosForward } from "@styled-icons/evaicons-solid";
import {
    DropdownContainer,
    ButtonContainer,
    ArrowButton,
    DropdownContent,
} from "./styles";

interface DropdownProps {
    label: string;
    iconVariant?: Variant;
    children: React.ReactNode;
    defaultOpen?: boolean;
    arrow?: React.ReactNode;
    secondaryActions?: React.ReactNode;
}

function Dropdown(props: DropdownProps) {
    const {
        label,
        iconVariant = "primary",
        defaultOpen = false,
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
                    fullWidth={false}
                    transparent
                    hoverDisabled
                    onClick={toggleDropdown}
                    direction="row"
                    justify="space-between"
                    px={0}
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
