import { ReactNode } from "react";
import {
    DarkBackground,
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "./styles";
import { useModal } from "@providers";

import Button from "../Button";

import { Icon, Whitespace } from "@styles/layout";
import { Close } from "@styled-icons/ionicons-solid";

interface ModalProps {
    visible?: boolean;
    onClose?: () => void;
    header?: ReactNode;
    body?: ReactNode;
    footer?: ReactNode;
    showCloseButton?: boolean;
}

function Modal(props: ModalProps) {
    const modal = useModal();

    const {
        visible = false,
        onClose = () => modal.hide(),
        header,
        body,
        footer,
        showCloseButton = false,
    } = props;

    return (
        <DarkBackground visible={visible}>
            <ModalContainer
                variant="secondary"
                textVariant="primary"
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
