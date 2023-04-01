import { useState } from "react";

import { Icon } from "@styles/layout";
import { Input } from "@components";

import { Plus } from "@styled-icons/bootstrap";
import { SearchOutline } from "@styled-icons/evaicons-outline";

function Search() {
    const [search, setSearch] = useState("");

    return (
        <Input
            fullWidth
            leftIcon={<Icon icon={<SearchOutline />} size={1.5} />}
            rightIcon={<Icon icon={<Plus />} size={1.5} />}
            type="text"
            placeholder="People, group and messages..."
            onChange={evt => setSearch(evt.target.value)}
            value={search}
        />
    );
}

export default Search;