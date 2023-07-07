import { ReactNode } from "react";
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

    const handleBackgroundClick = () => {
        if (!hideOnClickBackground) return;
        onClose();
    };

    return (
        <DarkBackground
            visible={visible}
            onClick={handleBackgroundClick}
        >
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
                                onClick={onClose}
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
        </DarkBackground>
    );
}

export default Modal;
export type { ModalProps };
