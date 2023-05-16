import { Container } from "@styles/layout";
import { useAuth } from "@providers";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Chats from "./Chats";

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
            gap={2.5}
        >
            <Sidebar />
        </Container>
    );
}

export default Page;