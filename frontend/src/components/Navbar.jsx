import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { WaveLogo } from "./WaveLogo";
import { useAuth } from "../context/AuthContext";
import { useSite } from "../context/SiteContext";
import { scrollToSection } from "../lib/media";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { site } = useSite();
    const items = site?.nav || [];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const goSection = (id) => {
        setOpen(false);
        if (pathname !== "/") {
            navigate("/");
            setTimeout(() => scrollToSection(id), 250);
        } else {
            scrollToSection(id);
        }
    };

    const panelTo = user?.role === "student" ? "/perfil" : user ? "/admin" : "/entrar";
    const panelLabel = user?.role === "student" ? "Meu perfil" : user ? "Painel" : "Entrar";

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
                scrolled || open ? "bg-[#06091A]/85 backdrop-blur-xl" : "bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 sm:px-10">
                <Link to="/" data-testid="nav-logo" className="shrink-0">
                    <WaveLogo />
                </Link>

                <nav className="hidden items-center gap-9 md:flex">
                    {items.map((it) => (
                        <button
                            key={it.target}
                            data-testid={`nav-${it.target}`}
                            onClick={() => goSection(it.target)}
                            className="nav-link text-[13px] text-white/60 transition-colors hover:text-white"
                        >
                            {it.label}
                        </button>
                    ))}
                    <Link
                        data-testid="nav-painel"
                        to={panelTo}
                        className="rounded-full border border-white/20 px-5 py-2 text-[13px] text-white transition-colors hover:border-white hover:bg-white hover:text-[#06091A]"
                    >
                        {panelLabel}
                    </Link>
                </nav>

                <button
                    data-testid="nav-mobile-toggle"
                    className="p-2 text-white md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Abrir menu"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {open && (
                <div className="border-t border-white/5 px-6 pb-8 pt-3 md:hidden">
                    <div className="flex flex-col">
                        {items.map((it) => (
                            <button
                                key={it.target}
                                data-testid={`nav-mobile-${it.target}`}
                                onClick={() => goSection(it.target)}
                                className="border-b border-white/5 py-4 text-left text-base text-white/80"
                            >
                                {it.label}
                            </button>
                        ))}
                        <Link data-testid="nav-mobile-painel" to={panelTo} onClick={() => setOpen(false)} className="py-4 text-left text-base text-white">
                            {panelLabel}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
