import { Home, Login, Register } from "@pages";
import { Protected } from "@components";

const routes = [
    {
        key: "/",
        index: true,
        path: "/",
        element: (
            <Protected>
                <Home />
            </Protected>
        ),
    },
    {
        key: "/login",
        index: false,
        path: "/login",
        element: <Login />,
    },
    {
        key: "/register",
        index: false,
        path: "/register",
        element: <Register />,
    },
];

export default routes;
