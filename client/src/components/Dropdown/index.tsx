import { useState } from "react";

import { Container, Icon } from "@styles/layout";
import { Button, ButtonProps } from "@components";

import { ArrowIosForward } from "@styled-icons/evaicons-solid";
import { ArrowButton } from "./styles";

interface DropdownProps extends Omit<ButtonProps, "onClick"> {
    label: string;
}

function Dropdown(props: DropdownProps) {
    const {
        label,
        iconVariant = "primary",
        transparent = true,
        ...buttonProps
    } = props;

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => setOpen((prev) => !prev);

    return (
        <>
            <Button
                {...buttonProps}
                transparent={transparent}
                onClick={toggleDropdown}
            >
                <span>{label}</span>
                <Container
                    direction="row"
                    justify="space-between"
                    align="center"
                >
                    <ArrowButton
                        iconVariant={iconVariant}
                        open={open}
                    >
                        <Icon icon={<ArrowIosForward />} />
                    </ArrowButton>
                </Container>
            </Button>
        </>
    );
}

export default Dropdown;
