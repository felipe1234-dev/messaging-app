import { Columns, Column } from "@styles/layout";
import { useAuth } from "@providers";

function Home() {
    const { user } = useAuth();

    if (!user) return <></>;

    return (
        <Columns>
            <Column>
                {user.name}
            </Column>
            <Column>
            </Column>
        </Columns>
    );
}

export default Home;