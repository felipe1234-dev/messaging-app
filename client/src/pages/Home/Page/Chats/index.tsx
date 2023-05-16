import { useState } from "react";
import { Container, Title } from "@styles/layout";

import { Icon } from "@styles/layout";
import { Input, Button } from "@components";

import { Plus } from "@styled-icons/bootstrap";
import { SearchOutline } from "@styled-icons/evaicons-outline";
import { Filter } from "@styled-icons/feather";

function Chats() {
    const [search, setSearch] = useState("");

    return (
        <Container
            variant="secondary"
            direction="column"
            justify="start"
            align="center"
            height="100%"
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
                width="100%"
            >
                <Title level={5}>
                    Chats
                </Title>

                <Button transparent iconed>
                    <Icon icon={<Filter />} />
                </Button>
            </Container>

            <Input
                fullWidth
                leftIcon={<Icon icon={<SearchOutline />} size={1.5} />}
                rightIcon={<Icon icon={<Plus />} size={1.5} />}
                type="text"
                placeholder="People, group and messages..."
                onChange={evt => setSearch(evt.target.value)}
                value={search}
            />
        </Container>
    );
}

export default Chats;