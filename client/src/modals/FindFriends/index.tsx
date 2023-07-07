import { useState } from "react";

import { Container, Icon, Paragraph } from "@styles/layout";
import { Input, Button, Spinner } from "@components";
import { useAlert } from "@providers";
import { Api } from "@services";

import { User } from "messaging-app-globals";
import { SearchAlt } from "@styled-icons/boxicons-regular";
import { FaceSmileWink } from "@styled-icons/fa-regular";
import { EmojiFrown } from "@styled-icons/bootstrap";

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
        setFirstSearch(false);

        try {
            const results: User[] = [];

            results.push(
                ...(await Api.users.searchUsers({
                    wheres: [["name", "==", search]],
                }))
            );

            results.push(
                ...(await Api.users.searchUsers({
                    wheres: [["email", "==", search]],
                }))
            );

            setUsers(results);

            console.log("results", results);
        } catch (error) {
            alert.error((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const FirstSearch = () => (
        <Container
            direction="column"
            align="center"
            justify="center"
        >
            <Icon
                variant="highlight"
                icon={<FaceSmileWink />}
            />
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
            <Icon
                variant="highlight"
                icon={<EmojiFrown />}
            />
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
                {firstSearch ? (
                    <FirstSearch />
                ) : users.length === 0 ? (
                    <NoResults />
                ) : loading ? (
                    <Spinner />
                ) : (
                    <></>
                )}
            </SearchResultsContainer>
        </OuterContainer>
    );
}

export default FindFriends;
