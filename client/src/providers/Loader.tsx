import React, { createContext, useContext, useState } from "react";

interface LoaderValue {
    show: () => void;
    hide: () => NodeJS.Timeout;
    visible: boolean;
    delay: number;
}

const LoaderContext = createContext<LoaderValue | undefined>(undefined);

function LoaderProvider(props: { children: React.ReactNode }) {
    const [processes, setProcesses] = useState(0);
    const visible = processes > 0;
    const delay = 3000;

    const show = () => setProcesses((prev) => prev + 1);
    const hide = () =>
        setTimeout(() => setProcesses((prev) => Math.max(prev - 1, 0)), delay);

    return (
        <LoaderContext.Provider
            value={{
                show,
                hide,
                visible,
                delay,
            }}
        >
            {props.children}
        </LoaderContext.Provider>
    );
}

function useLoader() {
    const context = useContext(LoaderContext);

    if (!context) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }

    return context;
}

export { LoaderContext, LoaderProvider, useLoader };
export type { LoaderValue };
