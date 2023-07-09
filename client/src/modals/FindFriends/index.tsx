import { useState } from "react";

import { Container, Icon, Paragraph } from "@styles/layout";
import { Input, Button, Spinner, UserCard } from "@components";
import { useAlert } from "@providers";
import { Api } from "@services";

import { User } from "messaging-app-globals";
import { SearchAlt } from "@styled-icons/boxicons-regular";

import {
    OuterContainer,
    SearchInputContainer,
    SearchResultsContainer,
} from "./styles";

function FindFriends() {
    const alert = useAlert();

    const [loading, setLoading] = useState(false);
    const [firstSearch, setFirstSearch] = useState(true);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);

    const handleSearchForFriends = async () => {
        setLoading(true);

        try {
            const results: User[] = [];
            const trimmedSearch = search.trim();

            results.push(
                ...(await Api.users.searchUsers({
                    wheres: [["name", "==", trimmedSearch]],
                }))
            );

            results.push(
                ...(await Api.users.searchUsers({
                    wheres: [["email", "==", trimmedSearch]],
                }))
            );

            setUsers(results);

            console.log("results", results);
        } catch (error) {
            alert.error((error as Error).message);
        } finally {
            setFirstSearch(false);
            setLoading(false);
        }
    };

    const FirstSearch = () => (
        <Container
            direction="column"
            align="center"
            justify="center"
        >
            <Paragraph>
                Use the input above for searching for people and make friends!
            </Paragraph>
        </Container>
    );

    const NoResults = () => (
        <Container
            direction="column"
            align="center"
            justify="center"
        >
            <Paragraph>No users found</Paragraph>
        </Container>
    );

    return (
        <OuterContainer>
            <SearchInputContainer>
                <Input
                    placeholder="Search for the name or email"
                    onChange={(evt) => setSearch(evt.target.value)}
                    value={search}
                    light={0.05}
                />

                <Button
                    variant="highlight"
                    onClick={handleSearchForFriends}
                    width="100px"
                    loading={loading}
                    fullWidth={false}
                >
                    Search
                    <Icon icon={<SearchAlt />} />
                </Button>
            </SearchInputContainer>
            <SearchResultsContainer>
                {loading ? (
                    <Spinner size={5} />
                ) : firstSearch ? (
                    <FirstSearch />
                ) : users.length === 0 ? (
                    <NoResults />
                ) : (
                    users.map((user) => (
                        <UserCard
                            key={user.uid}
                            user={user}
                        />
                    ))
                )}
            </SearchResultsContainer>
        </OuterContainer>
    );
}

export default FindFriends;
