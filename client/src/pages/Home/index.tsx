import { UserSearchProvider } from "./providers";
import { Composer } from "@components";
import Page from "./Page";

function Home() {
    const providers = [UserSearchProvider];

    return (
        <Composer components={providers}>
            <Page />
        </Composer>
    );
}

export default Home;