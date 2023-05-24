import React, { createContext, useContext, useState } from "react";

interface LoaderValue {
    show: () => void;
    hide: () => NodeJS.Timeout;
    visible: boolean;
    delay: number;
}

const LoaderContext = createContext<LoaderValue | undefined>(undefined);

function LoaderProvider(props: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    const delay = 3000;

    const show = () => setVisible(true);
    const hide = () => setTimeout(() => setVisible(false), delay);

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
