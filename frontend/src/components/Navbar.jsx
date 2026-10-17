import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { WaveLogo } from "./WaveLogo";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

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
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050B18]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link to="/" data-testid="nav-logo" className="shrink-0">
                    <WaveLogo />
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <button
                        data-testid="nav-catalogo"
                        onClick={() => goSection("catalogo")}
                        className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                        Catálogo
                    </button>
                    <button
                        data-testid="nav-carros"
                        onClick={() => goSection("carros")}
                        className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                        Carros
                    </button>
                    <button
                        data-testid="nav-facs"
                        onClick={() => goSection("facs")}
                        className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                        Facs
                    </button>
                    <Link
                        data-testid="nav-painel"
                        to={user?.role === "student" ? "/perfil" : "/admin"}
                        className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#050B18] transition-transform hover:scale-[1.03]"
                    >
                        {user?.role === "student" ? "Meu Perfil" : "Painel"}
                    </Link>
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
                <div className="border-t border-white/5 bg-[#050B18] px-5 pb-6 pt-2 md:hidden">
                    <div className="flex flex-col gap-1">
                        <button
                            data-testid="nav-mobile-catalogo"
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
                            data-testid="nav-mobile-facs"
                            onClick={() => goSection("facs")}
                            className="rounded px-2 py-3 text-left text-sm text-white/80"
                        >
                            Facs
                        </button>
                        <Link
                            data-testid="nav-mobile-painel"
                            to={user?.role === "student" ? "/perfil" : "/admin"}
                            onClick={() => setOpen(false)}
                            className="rounded px-2 py-3 text-left text-sm text-white/80"
                        >
                            {user?.role === "student" ? "Meu Perfil" : "Painel"}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
