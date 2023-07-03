import { Container, Paragraph } from "@styles/layout";
import { useAuth } from "@providers";
import { Avatar } from "@components";

function Profile() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <Container
            transparent
            direction="column"
            align="center"
            justify="start"
            width="500px"
        >
            <Container
                transparent
                direction="column"
                align="start"
                justify="center"
                width="100%"
                height="200px"
            >
                <Avatar
                    src={user.photo}
                    alt={user.name}
                />
            </Container>
        </Container>
    );
}

export default Profile;
