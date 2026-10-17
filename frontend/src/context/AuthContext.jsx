import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API } from "../api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/auth/me")
            .then((r) => setUser(r.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, password) => {
        const r = await API.post("/auth/login", { email, password });
        setUser(r.data);
        return r.data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const r = await API.post("/auth/register", { name, email, password });
        setUser(r.data);
        return r.data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await API.post("/auth/logout");
        } finally {
            setUser(null);
        }
    }, []);

    return (
        <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export const useAuth = () => useContext(AuthCtx);
