import { useEffect } from "react";

import { Page } from "./styles/layout";
import { routes } from "./constants";
import { useLoader, useAlert, useModal } from "./providers";
import { PageLoader, Alert, Modal } from "./components";
import { useTimeout } from "./hooks";
import { Api } from "./services";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
    const alert = useAlert();
    const loader = useLoader();
    const modal = useModal();
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
            <Modal
                visible={modal.visible}
                header={modal.header}
                body={modal.body}
                footer={modal.footer}
                {...modal.props}
            />
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
