import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API } from "../api";

const SiteContext = createContext({ site: null, settings: { discord_url: "" }, refresh: () => {} });

export function SiteProvider({ children }) {
    const [site, setSite] = useState(null);
    const [settings, setSettings] = useState({ discord_url: "" });

    const refresh = useCallback(() => {
        API.get("/site").then((r) => setSite(r.data)).catch(() => {});
        API.get("/settings").then((r) => setSettings(r.data)).catch(() => {});
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    return (
        <SiteContext.Provider value={{ site, settings, refresh }}>
            {children}
        </SiteContext.Provider>
    );
}

export const useSite = () => useContext(SiteContext);
