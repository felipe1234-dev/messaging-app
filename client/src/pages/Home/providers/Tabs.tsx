import { createContext, useContext, useState, useEffect } from "react";

type Tab = "textChats" | "voiceChats" | "videoChats" | "friendRequests";

interface TabsValue {
    tab: Tab;
    setTab: (tab: Tab) => void;
}

const TabsContext = createContext<TabsValue | undefined>(undefined);

function TabsProvider(props: { children: React.ReactNode }) {
    const [tab, setTab] = useState<Tab>("textChats");

    return (
        <TabsContext.Provider value={{ tab, setTab }}>
            {props.children}
        </TabsContext.Provider>
    );
}

function useTabs() {
    const context = useContext(TabsContext);

    if (!context) throw new Error("useTabs must be used within a TabsProvider");

    return context;
}

export { TabsContext, TabsProvider, useTabs };
export type { Tab };
