import { ReactNode, useState } from "react";
import {
    DarkBackground,
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "./styles";
import { useModal } from "@providers";
import { Variant } from "@types";

import Button from "../Button";

import { Icon, Whitespace } from "@styles/layout";
import { FadeIn, FadeOut } from "@styles/animations";
import { Close } from "@styled-icons/ionicons-solid";

interface ModalProps {
    variant?: Variant;
    textVariant?: Variant;
    visible?: boolean;
    onClose?: () => void;
    header?: ReactNode;
    body?: ReactNode;
    footer?: ReactNode;
    showCloseButton?: boolean;
    hideOnClickBackground?: boolean;
}

function Modal(props: ModalProps) {
    const modal = useModal();

    const {
        variant = "secondary",
        textVariant = "primary",
        visible = false,
        onClose = () => modal.hide(),
        header,
        body,
        footer,
        showCloseButton = false,
        hideOnClickBackground = true,
    } = props;

    const [fadeOut, setFadeOut] = useState(false);

    const handleCloseModal = () => {
        setFadeOut(true);
        setTimeout(() => {
            setFadeOut(false);
            onClose();
        }, 500);
    };

    const handleBackgroundClick = () => {
        if (!hideOnClickBackground) return;
        handleCloseModal();
    };

    const Fade = ({ children }: { children: ReactNode }) =>
        fadeOut ? <FadeOut>{children}</FadeOut> : <FadeIn>{children}</FadeIn>;

    return (
        <DarkBackground
            visible={visible}
            onClick={handleBackgroundClick}
        >
            <Fade>
                <ModalContainer
                    variant={variant}
                    textVariant={textVariant}
                    onClick={(evt) => evt.stopPropagation()}
                >
                    {(header || showCloseButton) && (
                        <ModalHeader>
                            {header}
                            {!header && showCloseButton && <Whitespace />}
                            {showCloseButton && (
                                <Button
                                    round
                                    iconed
                                    transparent
                                    onClick={handleCloseModal}
                                    size={1.2}
                                    p={8}
                                >
                                    <Icon icon={<Close />} />
                                </Button>
                            )}
                        </ModalHeader>
                    )}
                    {body && <ModalBody>{body}</ModalBody>}
                    {footer && <ModalFooter>{footer}</ModalFooter>}
                </ModalContainer>
            </Fade>
        </DarkBackground>
    );
}

export default Modal;
export type { ModalProps };
