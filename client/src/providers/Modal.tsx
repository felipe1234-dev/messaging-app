import { ReactNode, createContext, useContext, useState } from "react";
import { ModalProps } from "@components";

interface ModalValue {
    visible: boolean;
    header?: ReactNode;
    body?: ReactNode;
    footer?: ReactNode;
    show: (props: ModalProps) => void;
    hide: () => void;
    props: ModalProps;
}

const ModalContext = createContext<ModalValue>({
    visible: false,
    show: () => {},
    hide: () => {},
    props: {},
});

function ModalProvider(props: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [header, setHeader] = useState<ReactNode>();
    const [body, setBody] = useState<ReactNode>();
    const [footer, setFooter] = useState<ReactNode>();
    const [modalProps, setModalProps] = useState<ModalProps>({});

    const show = ({ header, body, footer, visible, ...rest }: ModalProps) => {
        setHeader(header);
        setBody(body);
        setFooter(footer);
        setVisible(true);
        setModalProps(rest);
    };

    const hide = () => {
        setHeader(undefined);
        setBody(undefined);
        setFooter(undefined);
        setVisible(false);
        setModalProps({});
    };

    return (
        <ModalContext.Provider
            value={{
                visible,
                header,
                body,
                footer,
                show,
                hide,
                props: modalProps,
            }}
        >
            {props.children}
        </ModalContext.Provider>
    );
}

function useModal() {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
}

export { ModalProvider, ModalContext, useModal };
export type { ModalValue };
