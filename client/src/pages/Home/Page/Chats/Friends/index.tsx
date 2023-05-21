import { Container } from "@styles/layout";
import { useAuth } from "@providers";

function Friends() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Container
            variant="primary"
            width="100%"
            height="fit-content"
        >
            <Container
                transparent
                direction="row"
                justify="center"
                align="center"
                p={10}
                width="100%"
                height="fit-content"
            >

            </Container>
        </Container>
    );
}

export default Friends;