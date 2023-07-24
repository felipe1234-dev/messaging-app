import { Composer } from "@components";
import { ChatWindowProvider, TabsProvider } from "./providers";
import Page from "./Page";

function Home() {
    const providers = [ChatWindowProvider, TabsProvider];

    return (
        <Composer components={providers}>
            <Page />
        </Composer>
    );
}

export default Home;
