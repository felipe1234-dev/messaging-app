import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Severity } from "@types";
import { useTimeout } from "@hooks";

interface AlertValue {
    message: string | undefined;
    severity: Severity | undefined;
    visible: boolean;
    autoHideTime: number | null;
    show: (
        severity: Severity,
        message: string, 
        autoHideIn?: number
    ) => void;
    success: (
        message: string, 
        autoHideIn?: number
    ) => void;
    error: (
        message: string, 
        autoHideIn?: number
    ) => void;
    info: (
        message: string, 
        autoHideIn?: number
    ) => void;
    warning: (
        message: string, 
        autoHideIn?: number
    ) => void;
    hide: () => void;
}

const AlertContext = createContext<AlertValue | undefined>(undefined);

function AlertProvider(props: { children: ReactNode }) {
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [severity, setSeverity] = useState<Severity | undefined>("error");
    const [autoHideTime, setAutoHideTime] = useState<number | null>(null);
    const visible = !!severity && !!message;
    const defaultAutoHideTime = 5000;

    const show = (
        severity: Severity, 
        message: string,
        autoHideIn?: number
    ) => {
        setSeverity(severity);
        setMessage(message);
        setAutoHideTime(autoHideIn || defaultAutoHideTime);
    };

    const hide = () => {
        setSeverity(undefined);
        setMessage(undefined);
        setAutoHideTime(null);
    };

    const success = (
        message: string,
        autoHideIn?: number
    ) => show("success", message, autoHideIn);

    const error = (
        message: string,
        autoHideIn?: number
    ) => show("error", message, autoHideIn);

    const info = (
        message: string,
        autoHideIn?: number
    ) => show("info", message, autoHideIn);

    const warning = (
        message: string,
        autoHideIn?: number
    ) => show("warning", message, autoHideIn);

    useEffect(() => {
        if (!message || !severity) {
            return;
        }

        switch (severity) {
            case "error":
                console.error("Error!", message);
                break;
            case "warning":
                console.warn("Warning!", message);
                break;
            case "info":
                console.info("Info!", message);
                break;
            case "success":
                console.log("Success!", message);
                break;
        }
    }, [message, severity]);

    useTimeout(() => {
        if (visible) hide();
    }, autoHideTime, [visible]);

    return (
        <AlertContext.Provider
            value={{
                message,
                severity,
                visible,
                autoHideTime,
                show,
                success,
                error,
                info,
                warning,
                hide
            }}
        >
            {props.children}
        </AlertContext.Provider>
    );
}

function useAlert() {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error("useAlert must be used within a AlertProvider");
    }

    return context;
}

export { AlertProvider, useAlert, AlertContext };
export type { AlertValue };