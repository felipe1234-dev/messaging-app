import { Composer } from "@components";
import { ChatWindowProvider } from "./providers";
import Page from "./Page";

function Home() {
    const providers = [ChatWindowProvider];

    return (
        <Composer components={providers}>
            <Page />
        </Composer>
    );
}

export default Home;
