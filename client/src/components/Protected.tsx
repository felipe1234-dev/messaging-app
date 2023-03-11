import { useState, useEffect } from "react";
import { useAuth } from "@providers";
import { Login } from "@pages";

function Protected(props: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (!user) setAllowed(false);
        else setAllowed(true);
    }, [user]);

    if (!allowed) return <Login />;

    return <>{props.children}</>
}

export default Protected;