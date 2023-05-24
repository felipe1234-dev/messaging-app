import { useEffect } from "react";

import { Page } from "./styles/layout";
import { routes } from "./constants";
import { useLoader, useAlert } from "./providers";
import { PageLoader, Alert } from "./components";
import { useTimeout } from "./hooks";
import { Api } from "./services";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
    const alert = useAlert();
    const loader = useLoader();
    const pageLocation = useLocation();
    const { pathname: pathNow } = pageLocation;

    useEffect(() => {
        loader.show();
    }, [pathNow]);

    useEffect(() => {
        loader.hide();
    });

    useTimeout(
        async () => {
            await Api.ping().catch(() => {
                alert.error("Network error");
            });
        },
        0,
        [pathNow]
    );

    return (
        <Page>
            <Routes>
                {routes.map((route) => (
                    <Route
                        key={route.key}
                        index={route.index}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Routes>
            <Alert
                severity={alert.severity}
                show={alert.visible}
                autoHideTime={alert.autoHideTime || 0}
            >
                {alert.message}
            </Alert>
            <PageLoader visible={loader.visible} />
        </Page>
    );
}

export default App;
