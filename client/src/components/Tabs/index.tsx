import { Container } from "@styles/layout";

interface TabsProps {
    active: string;
    tabs: {
        tabId: string;
        label: string;
        Content: (props: any) => JSX.Element;
    }[];
}

function Tabs() {
    return (
        <Container
            direction="column"
            justify="start"
            align="start"
        >
            <Container
                direction="row"
                justify="start"
                align="start"
            >

            </Container>
        </Container>
    );
}

export default Tabs;