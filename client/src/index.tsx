import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";
import {
    ThemeProvider,
    LoaderProvider,
    NotificationProvider,
    AlertProvider,
    ModalProvider,
    AuthProvider,
    FriendsProvider,
    ChatsProvider,
} from "./providers";
import { Composer } from "./components";

import App from "./App";

import "./styles/index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const providers = [
    BrowserRouter,
    ThemeProvider,
    LoaderProvider,
    NotificationProvider,
    AlertProvider,
    ModalProvider,
    AuthProvider,
    FriendsProvider,
    ChatsProvider,
];

root.render(
    <React.StrictMode>
        <Composer components={providers}>
            <App />
        </Composer>
    </React.StrictMode>
);

reportWebVitals(console.log);
