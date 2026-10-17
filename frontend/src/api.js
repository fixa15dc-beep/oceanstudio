import axios from "axios";

export const API = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    withCredentials: true,
});

export function apiError(e) {
    const d = e?.response?.data?.detail;
    if (d == null) return "Algo deu errado. Tente novamente.";
    if (typeof d === "string") return d;
    if (Array.isArray(d))
        return d
            .map((x) => (x && typeof x.msg === "string" ? x.msg : JSON.stringify(x)))
            .filter(Boolean)
            .join(" ");
    return String(d);
}

export function formatPrice(v) {
    return `R$ ${Number(v || 0).toFixed(2).replace(".", ",")}`;
}

export function toEmbedUrl(url) {
    if (!url) return "";
    try {
        const u = new URL(url.trim());
        const h = u.hostname.replace("www.", "");
        if (h === "youtube.com" || h === "m.youtube.com") {
            if (u.pathname.startsWith("/watch"))
                return `https://www.youtube.com/embed/${u.searchParams.get("v") || ""}`;
            if (u.pathname.startsWith("/shorts/"))
                return `https://www.youtube.com/embed/${u.pathname.split("/")[2] || ""}`;
            if (u.pathname.startsWith("/embed/")) return url;
            return url;
        }
        if (h === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
        if (h === "vimeo.com") return `https://player.vimeo.com/video${u.pathname}`;
        return url;
    } catch {
        return url;
    }
}

export const CATEGORY_LABEL = {
    hl: "HL",
    carros: "Carros",
    roupas: "Roupas",
};

export const TYPE_LABEL = {
    curso: "Curso",
    pack: "Pack",
};
