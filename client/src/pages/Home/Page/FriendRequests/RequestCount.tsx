import { Container, Title } from "@styles/layout";
import { useFriends } from "@providers";
import { Button } from "@components";
import { padding } from "./index";

function RequestCount() {
    const { unasweredFriendRequests } = useFriends();
    const unasweredReqsCount = unasweredFriendRequests.length;

    return (
        <Container
            transparent
            direction="column"
            justify="start"
            align="start"
            width="100%"
            height="fit-content"
        >
            <Container
                transparent
                direction="row"
                justify="space-between"
                align="center"
                width={`calc(100% - ${2 * padding}px)`}
                height="fit-content"
                p={padding}
            >
                <Title level={5}>Unaswered</Title>

                <Button
                    round
                    iconed
                    noInteraction
                    variant="highlight"
                    py={0}
                    px={9}
                >
                    {unasweredReqsCount}
                </Button>
            </Container>
        </Container>
    );
}

export default RequestCount;
