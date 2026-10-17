import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ArrowUpRight, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { API, TYPE_LABEL, CATEGORY_LABEL } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { WaveMark } from "../components/WaveLogo";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState(null);
    const [discordUrl, setDiscordUrl] = useState("https://discord.gg/oceanstudio");

    useEffect(() => {
        API.get("/me/access").then((r) => setItems(r.data)).catch(() => setItems([]));
        API.get("/settings").then((r) => setDiscordUrl(r.data.discord_url || "https://discord.gg/oceanstudio")).catch(() => {});
    }, []);

    const handleLogout = async () => {
        await logout();
        toast.success("Você saiu da sua conta.");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#050B18]">
            <Navbar discordUrl={discordUrl} />

            <header className="border-b border-white/5 bg-[#050B18] pb-14 pt-32 text-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#007AFF]">Minha conta</p>
                        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl" data-testid="profile-greeting">
                            Olá, {(user?.name || "").split(" ")[0]}
                        </h1>
                        <p className="mt-2 text-sm font-light text-white/55">{user?.email}</p>
                    </div>
                    <button
                        data-testid="profile-logout"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
                <h2 className="font-display text-2xl font-bold tracking-tight text-white">Meus cursos e packs</h2>

                {items === null ? (
                    <p className="mt-10 text-sm text-white/50">Carregando...</p>
                ) : items.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-white/10 bg-[#0A1220] p-10" data-testid="profile-empty">
                        <Lock className="h-6 w-6 text-white/40" />
                        <h3 className="font-display mt-4 text-xl font-bold text-white">
                            Nenhum acesso liberado ainda
                        </h3>
                        <p className="mt-2 max-w-lg text-sm font-light leading-relaxed text-white/55">
                            Escolha seu curso ou pack na vitrine e feche a compra no nosso
                            Discord. Assim que o dono confirmar, o conteúdo aparece aqui no
                            seu perfil.
                        </p>
                        <a
                            data-testid="profile-empty-discord"
                            href={discordUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.04]"
                        >
                            Ir para o Discord
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-testid="profile-courses-grid">
                        {items.map((p) => (
                            <article key={p.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A1220] transition-colors hover:border-white/25" data-testid={`profile-item-${p.id}`}>
                                <div className="relative aspect-video overflow-hidden bg-white/5">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-[#050B18]">
                                            <WaveMark className="h-8 w-auto text-white/30" />
                                        </div>
                                    )}
                                    <span className="absolute left-4 top-4 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                                        {TYPE_LABEL[p.type] || p.type} • {CATEGORY_LABEL[p.category] || p.category}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                                    <p className="mt-2 line-clamp-2 text-sm font-light text-white/55">{p.description}</p>
                                    <div className="mt-5 flex-1" />
                                    <Link
                                        data-testid={`profile-open-${p.id}`}
                                        to={`/curso/${p.id}`}
                                        className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#050B18] transition-transform hover:scale-[1.04]"
                                    >
                                        {p.type === "curso" ? "Acessar curso" : "Ver conteúdo"}
                                        <LogIn className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer discordUrl={discordUrl} />
        </div>
    );
}
