import { Columns, Column } from "@styles/layout";
import { useAuth } from "@providers";
import Nav from "./Nav";

function Page() {
    const { user } = useAuth();

    if (!user) return <></>;

    return (<>
        <Nav />
        <Columns>
            <Column>
                {user.name}
            </Column>
            <Column>
                test
            </Column>
        </Columns>
    </>);
}

export default Page;