import { useState } from "react";

import { Container, Icon } from "@styles/layout";
import { Input } from "@components";

import { Search as Magnifier } from "@styled-icons/evaicons-solid";

function Search() {
    const [search, setSearch] = useState("");

    return (
        <Container
            transparent
            direction="row"
            justify="start"
            align="center"
            width="270px"
            height="fit-content"
            p={10}
        >
            <Input
                fullWidth
                disableHover
                placeholder="People, groups and messages"
                leftIcon={<Icon icon={<Magnifier />} />}
                onChange={evt => setSearch(evt.target.value)}
                value={search}
            />
        </Container>
    );
}

export default Search;