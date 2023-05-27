import { useAuth } from "@providers";
import { Login } from "@pages";

function Protected(props: { children: React.ReactNode }) {
    const { user } = useAuth();
    const allowed = !!user;

    if (!allowed) return <Login />;

    return <>{props.children}</>;
}

export default Protected;
