import { StyledNav } from "./styles";

import { useUserSearch } from "../../providers";
import { useAuth, useTheme } from "@providers";

import { Avatar, Switch, Input } from "@components";
import { Paragraph, Icon, Whitespace } from "@styles/layout";

import { Sun } from "@styled-icons/fa-regular";
import { Moon } from "@styled-icons/bootstrap";
import { Search } from "@styled-icons/evaicons-solid";

function Nav() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { search, setSearch } = useUserSearch();

    const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(evt.target.value);
    };

    const ThemeIcon = () => (
        <Icon 
            icon={theme === "light" ? <Sun /> : <Moon />} 
            variant="secondary"
            pl={10} 
        />
    );

    const SearhcIcon = () => (
        <Icon 
            icon={<Search />}
            variant="secondary"
        />
    );
    
    if (!user) return <></>;

    return (
        <StyledNav>
            <Input 
                variant="secondary"
                placeholder="Find user..."
                leftIcon={<SearhcIcon />}
                onChange={handleSearchChange}
                value={search}
            />
            <Whitespace />
            <Avatar
                src={user.photo}
                alt={user.name}
            />
            <Paragraph ml={10} mr={10} variant="primary">
                {user.name}
            </Paragraph>
            <Switch 
                round
                icon={<ThemeIcon />}
                onChange={toggleTheme}
                checked={theme === "light"}
            />
        </StyledNav>
    );
}

export default Nav;