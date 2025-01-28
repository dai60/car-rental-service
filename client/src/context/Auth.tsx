import { createContext, PropsWithChildren, useContext, useState } from "react";

type AuthUser = {
    email: string;
    admin: boolean;
    token: string;
}

type AuthContextValue = {
    user?: AuthUser;
    login: (user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<AuthUser | undefined>(() => {
        const storage = localStorage.getItem("user");
        if (!storage) {
            return undefined;
        }

        const data = JSON.parse(storage);
        return data;
    });

    const login = (user: AuthUser) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem("user");
        setUser(undefined);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextValue => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return auth;
}
