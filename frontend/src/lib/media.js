const BACKEND = process.env.REACT_APP_BACKEND_URL;

/** Resolve stored media paths ("/api/uploads/x.mp4", "/img/x.jpg", full URLs) to a usable src. */
export function assetUrl(u) {
    if (!u) return "";
    if (u.startsWith("/api/")) return `${BACKEND}${u}`;
    return u;
}

export function isVideoUrl(u = "") {
    return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(u);
}

export function isDirectVideo(u = "") {
    return isVideoUrl(u) || u.startsWith("/api/uploads/");
}

export function formatBytes(n) {
    if (!n) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
    return `${(n / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Scroll to a section id, using Lenis when available. */
export function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
}
