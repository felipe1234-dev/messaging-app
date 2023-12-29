import React, { ReactNode, createContext, useContext, useState } from "react";
import { generateUid } from "messaging-app-globals";

const defaultAutoHideTime = 5000;

interface Notification {
    uid: string;
    image: JSX.Element;
    title: ReactNode;
    subtitle: ReactNode;
}

interface NotificationParams extends Omit<Notification, "uid"> {}

interface NotificationValue {
    notifications: Notification[];
    notify: (params: NotificationParams, autoHideIn?: number) => void;
    autoHideTime: number;
}

const NotificationContext = createContext<NotificationValue>({
    notifications: [],
    notify: () => {},
    autoHideTime: defaultAutoHideTime,
});

function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [autoHideTime, setAutoHideTime] = useState(defaultAutoHideTime);

    const notify = (params: NotificationParams, autoHideIn?: number) => {
        const newNotification = {
            uid: generateUid(),
            ...params,
        };

        const time = autoHideIn || defaultAutoHideTime;
        setNotifications((prev) => [...prev, newNotification]);
        setAutoHideTime(time);

        setTimeout(() => {
            setNotifications((prev) =>
                prev.filter((item) => item.uid !== newNotification.uid)
            );
        }, time);
    };

    return (
        <NotificationContext.Provider
            value={{ notifications, notify, autoHideTime }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

function useNotification() {
    const context = useContext(NotificationContext);

    if (!context)
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );

    return context;
}

export { NotificationContext, NotificationProvider, useNotification };
