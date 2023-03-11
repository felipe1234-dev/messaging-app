import { useAuth } from "@providers";

function Nav() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        
    );
}

export default Nav;