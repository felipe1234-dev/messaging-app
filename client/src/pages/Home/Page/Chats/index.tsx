import { Container, Title } from "@styles/layout";

function Chats() {
    return (
        <Container
            variant="secondary"
            direction="column"
            justify="start"
            align="center"
            height="100vh"
            width="fit-content"
            roundedTL="10px"
            p={10}
        >
            <Container
                transparent
                direction="row"
                justify="space-between"
                align="center"
                height="fit-content"
                width="fit-content"
            >
                <Title level={5}>
                    Chats
                </Title>
            </Container>
        </Container>
    );
}

export default Chats;