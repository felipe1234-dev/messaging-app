import React, { 
    createContext, 
    useContext, 
    useState
} from "react";
import { User, codes } from "messaging-app-globals";
import { Api } from "@services";
import { useAsyncEffect } from "@hooks";
import { WrapperUser } from "@types";

interface AuthValue {
    user?: WrapperUser;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

function AuthProvider(props: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>();
    const [friends, setFriends] = useState<User[]>([]);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const response = await Api.auth.login(email, password, rememberMe);
        setUser(response);
        setFriends((await Api.friends.getUserFriends()).sort((a, b) => {
            if (a.online && !b.online) return -1;
            if (b.online && !a.online) return 1;
            
            if (a.online && b.online && a.sessionStart && b.sessionStart) {
                if (a.sessionStart > b.sessionStart) return -1;
                if (a.sessionStart < b.sessionStart) return 1;
            }

            if (!a.online && !b.online && a.sessionEnd && b.sessionEnd) {
                if (a.sessionEnd > b.sessionEnd) return -1;
                if (a.sessionEnd < b.sessionEnd) return 1;
            }
            
            return 0;
        }));
    };

    const logout = async () => {
        if (!user) return;
        await Api.auth.logout(user.uid);
        setUser(undefined);
        setFriends([]);
    };

    const onFriendUpdated = async (updatedFriend: User) => {
        setFriends(prev => prev.map(friend => {
            if (friend.uid === updatedFriend.uid) return updatedFriend;
            return friend;
        }));
    };

    useAsyncEffect(async () => {
        Api.httpEndpoint.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.code === codes.UNAUTHENTICATED) await logout();
                return Promise.reject(error);
            }
        );
        
        const user = await Api.auth.recoverSession();
        setUser(user);
        
        if (!user) return;

        Api.users.onUserUpdated(user.uid, setUser);
        Api.friends.onFriendUpdated(user.uid, onFriendUpdated);
    }, []);

    const wrapperUser = user ? {
        ...user,
        friends
    } : undefined;

    return (
        <AuthContext.Provider value={{ 
            user: wrapperUser, 
            login,
            logout 
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

export { AuthContext, AuthProvider, useAuth };