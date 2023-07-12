import React, { createContext, useContext, useEffect, useState } from "react";
import { User, codes } from "messaging-app-globals";
import { Api } from "@services";
import { WrapperUser } from "@types";
import { useLoader } from "./Loader";

interface AuthValue {
    user?: WrapperUser;
    login: (
        email: string,
        password: string,
        rememberMe: boolean
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

function AuthProvider(props: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>();
    const loader = useLoader();

    const login = async (
        email: string,
        password: string,
        rememberMe: boolean
    ) => {
        const response = await Api.auth.login(email, password, rememberMe);
        setUser(response);
    };

    const logout = async () => {
        if (!user) return;
        await Api.auth.logout();
        setUser(undefined);
    };

    const onUserUpdated = (updatedUser: User) => {
        const updatedUserJson = JSON.stringify(updatedUser);
        const currentUserJson = JSON.stringify(user);

        if (updatedUserJson !== currentUserJson) setUser(updatedUser);
    };

    useEffect(() => {
        Api.httpEndpoint.interceptors.response.use(
            (response) => response,
            async (error) => {
                console.log("error", error);
                if (error.code === codes.UNAUTHENTICATED) await logout();
                return Promise.reject(error);
            }
        );

        loader.show();
        Api.auth.recoverSession().then(setUser).finally(loader.hide);
    }, []);

    useEffect(() => {
        if (!user) return;
        Api.users.onUserUpdated(user.uid, onUserUpdated);
    }, [user?.uid]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

export { AuthContext, AuthProvider, useAuth };
