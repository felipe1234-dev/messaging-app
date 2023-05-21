import { Container } from "@styles/layout";
import { useAuth } from "@providers";

import Sidebar from "./Sidebar";
import Chats from "./Chats";

export const gap = 3;

function Page() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Container
            variant="secondary"
            direction="row"
            justify="start"
            align="start"
            height="100vh"
            width="100vw"
            gap={gap}
        >
            <Sidebar />
            <Chats />
        </Container>
    );
}

export default Page;