import React, { 
    createContext, 
    useContext, 
    useState,
    useEffect
} from "react";
import { User } from "messaging-app-globals";

interface SearchValue {
    users: User[];
    search: string;
    setSearch(text: string): void;
}

const UserSearchContext = createContext<SearchValue | undefined>(undefined);

function UserSearchProvider(props: { children: React.ReactNode }) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {

    }, [search]);

    return (
        <UserSearchContext.Provider
            value={{
                search,
                setSearch,
                users
            }}
        >
            {props.children}
        </UserSearchContext.Provider>
    );
}

function useUserSearch() {
    const context = useContext(UserSearchContext);

    if (!context) throw new Error("useUserSearch must be used within a UserSearchProvider");

    return context;
}

export { UserSearchProvider, useUserSearch, UserSearchContext };