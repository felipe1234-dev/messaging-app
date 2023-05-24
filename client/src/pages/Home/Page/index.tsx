import { Container } from "@styles/layout";
import { useAuth } from "@providers";

import Sidebar from "./Sidebar";
import Chats from "./Chats";

function Page() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Container
            transparent
            direction="row"
            justify="start"
            align="start"
            height="100vh"
            width="100vw"
            gap={0}
        >
            <Sidebar />
            <Chats />
        </Container>
    );
}

export default Page;
