import { Title, Container } from "@styles/layout";
import { appName } from "@constants";

function Topbar() {
    return (
        <Container
            direction="row"
            justify="start"
            align="center"
            width="100%"
            height="fit-content"
            p={16}
        >
            <Title level={5}>{appName}</Title>
        </Container>
    );
}

export default Topbar;