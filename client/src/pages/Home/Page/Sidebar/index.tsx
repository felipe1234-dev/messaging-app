import { Container, Icon } from "@styles/layout";
import { Avatar, Button } from "@components";
import { useAuth } from "@providers";

import { ChatDots, Telephone, CameraVideo } from "@styled-icons/bootstrap";
import { Settings } from "@styled-icons/feather";

function Sidebar() {
    const { user } = useAuth();
    
    if (!user) return <></>;

    const padding = 5;
    
    return (
        <Container
            direction="column"
            align="center"
            justify="space-between"
            width="fit-content" 
            height={`calc(100vh - ${2*padding}px)`}
            p={padding}
        >
            <Container 
                direction="column" 
                align="center" 
                justify="start"
            >
                <Button 
                    iconed
                    transparent 
                >
                    <Icon icon={<ChatDots />} />
                </Button>
                <Button 
                    iconed
                    transparent 
                >
                    <Icon icon={<Telephone />} />
                </Button>
                <Button 
                    iconed
                    transparent 
                >
                    <Icon icon={<CameraVideo />} />
                </Button>
            </Container>

            <Container
                direction="column" 
                align="center" 
                justify="end"
            >
                <Button 
                    iconed
                    transparent 
                >
                    <Icon icon={<Settings />} />
                </Button>

                <Button
                    iconed
                    transparent 
                >
                    <Avatar
                        src={user.photo}
                        alt={user.name}
                        size={0.55}
                    />
                </Button>
            </Container>
        </Container>
    );
}

export default Sidebar;