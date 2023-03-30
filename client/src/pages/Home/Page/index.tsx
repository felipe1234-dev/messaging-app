import { Columns, Column } from "@styles/layout";
import { useAuth } from "@providers";


function Page() {
    const { user } = useAuth();

    if (!user) return <></>;

    return (
        <Columns>
            <Column>
                
            </Column>
            <Column>
            </Column>
        </Columns>
    );
}

export default Page;