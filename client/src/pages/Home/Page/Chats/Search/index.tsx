import { useState } from "react";

import { Container, Icon } from "@styles/layout";
import { Input } from "@components";

import { Search as Magnifier } from "@styled-icons/evaicons-solid";
import { Add } from "@styled-icons/ionicons-outline";

function Search() {
    const [search, setSearch] = useState("");

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
                <Input
                    fullWidth
                    disableHover
                    placeholder="People, groups and messages"
                    leftIcon={<Icon icon={<Magnifier />} />}
                    rightIcon={<Icon icon={<Add />} />}
                    onChange={evt => setSearch(evt.target.value)}
                    value={search}
                />
            </Container>
        </Container>
    );
}

export default Search;