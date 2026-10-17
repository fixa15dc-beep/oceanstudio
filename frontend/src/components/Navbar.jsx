import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { WaveLogo } from "./WaveLogo";
import { useAuth } from "../context/AuthContext";

const DISCORD_FALLBACK = "https://discord.gg/oceanstudio";

export default function Navbar({ discordUrl }) {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const discord = discordUrl || DISCORD_FALLBACK;

    const goSection = (id) => {
        setOpen(false);
        if (pathname !== "/") {
            navigate("/");
            setTimeout(
                () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
                120
            );
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050B18]/85 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link to="/" data-testid="nav-logo" className="shrink-0">
                    <WaveLogo />
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <button
                        data-testid="nav-vitrine"
                        onClick={() => goSection("catalogo")}
                        className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                        Catálogo
                    </button>
                    <button
                        data-testid="nav-carros"
                        onClick={() => goSection("carros")}
                        className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                        Carros
                    </button>
                    <button
                        data-testid="nav-sobre"
                        onClick={() => goSection("sobre")}
                        className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                        Facs
                    </button>
                    <a
                        data-testid="nav-discord"
                        href={discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                        Discord
                    </a>
                    {user ? (
                        <Link
                            data-testid="nav-profile-link"
                            to={user.role === "admin" ? "/admin" : "/perfil"}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#050B18] transition-transform hover:scale-[1.03]"
                        >
                            <User className="h-3.5 w-3.5" />
                            {user.role === "admin" ? "Painel" : "Meu Perfil"}
                        </Link>
                    ) : (
                        <Link
                            data-testid="nav-entrar"
                            to="/entrar"
                            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#050B18] transition-transform hover:scale-[1.03]"
                        >
                            Entrar
                        </Link>
                    )}
                </nav>

                <button
                    data-testid="nav-mobile-toggle"
                    className="p-2 text-white md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Abrir menu"
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {open && (
                <div className="border-t border-white/10 bg-[#050B18] px-5 pb-6 pt-2 md:hidden">
                    <div className="flex flex-col gap-1">
                        <button
                            data-testid="nav-mobile-vitrine"
                            onClick={() => goSection("catalogo")}
                            className="rounded px-2 py-3 text-left text-sm text-white/80"
                        >
                            Catálogo
                        </button>
                        <button
                            data-testid="nav-mobile-carros"
                            onClick={() => goSection("carros")}
                            className="rounded px-2 py-3 text-left text-sm text-white/80"
                        >
                            Carros
                        </button>
                        <button
                            data-testid="nav-mobile-sobre"
                            onClick={() => goSection("sobre")}
                            className="rounded px-2 py-3 text-left text-sm text-white/80"
                        >
                            Facs
                        </button>
                        {user ? (
                            <Link
                                data-testid="nav-mobile-profile"
                                to={user.role === "admin" ? "/admin" : "/perfil"}
                                onClick={() => setOpen(false)}
                                className="rounded px-2 py-3 text-left text-sm text-white/80"
                            >
                                {user.role === "admin" ? "Painel" : "Meu Perfil"}
                            </Link>
                        ) : (
                            <Link
                                data-testid="nav-mobile-entrar"
                                to="/entrar"
                                onClick={() => setOpen(false)}
                                className="rounded px-2 py-3 text-left text-sm text-white/80"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
