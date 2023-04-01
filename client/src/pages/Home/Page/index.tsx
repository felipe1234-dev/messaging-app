import { Columns, Column } from "@styles/layout";
import { useAuth } from "@providers";

import LeftColumn from "./LeftColumn";

function Page() {
    const { user } = useAuth();

    if (!user) return <></>;

    return (
        <Columns>
            <Column sm={3}>
                <LeftColumn />
            </Column>
            <Column sm={8}>
            </Column>
        </Columns>
    );
}

export default Page;