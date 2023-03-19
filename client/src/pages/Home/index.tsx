import { UserSearchProvider, ChatsProvider } from "./providers";
import Page from "./Page";
import { Composer } from "@components";

function Home() {
    return (
        <Composer
            components={[
                ChatsProvider,
                UserSearchProvider
            ]}
        >
            <Page />
        </Composer>
    );
}

export default Home;