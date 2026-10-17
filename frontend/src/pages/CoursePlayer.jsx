import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Play, FileText, Lock, ArrowUpRight } from "lucide-react";
import { API, toEmbedUrl, CATEGORY_LABEL } from "../api";
import Navbar from "../components/Navbar";

export default function CoursePlayer() {
    const { pid } = useParams();
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading"); // loading | ok | forbidden | missing
    const [discordUrl, setDiscordUrl] = useState("https://discord.gg/oceanstudio");
    const [sel, setSel] = useState({ m: 0, l: 0 });

    useEffect(() => {
        API.get("/settings").then((r) => setDiscordUrl(r.data.discord_url || "https://discord.gg/oceanstudio")).catch(() => {});
        API.get(`/me/products/${pid}`)
            .then((r) => {
                setProduct(r.data);
                setStatus("ok");
            })
            .catch((e) => setStatus(e?.response?.status === 403 ? "forbidden" : "missing"));
    }, [pid]);

    const flat = useMemo(() => {
        if (!product) return [];
        return (product.modules || []).flatMap((mod, mi) =>
            (mod.lessons || []).map((les, li) => ({ mod, mi, les, li }))
        );
    }, [product]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050B18] text-white/60">
                Carregando...
            </div>
        );
    }

    if (status === "forbidden" || status === "missing") {
        return (
            <div className="min-h-screen bg-[#050B18] text-white">
                <Navbar discordUrl={discordUrl} />
                <div className="mx-auto flex max-w-xl flex-col items-center px-5 pb-32 pt-40 text-center">
                    <Lock className="h-8 w-8 text-white/40" />
                    <h1 className="font-display mt-6 text-3xl font-semibold">
                        {status === "forbidden" ? "Sem acesso a este produto" : "Produto não encontrado"}
                    </h1>
                    <p className="mt-3 text-sm font-light leading-relaxed text-white/60">
                        {status === "forbidden"
                            ? "Este conteúdo não está liberado no seu perfil. Se você já fechou a compra no Discord, chame o dono para setar o acesso."
                            : "Volte para o seu perfil e escolha um dos seus cursos."}
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Link to="/perfil" data-testid="course-back-profile" className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A192F]">
                            Meu perfil
                        </Link>
                        <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                            Discord
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const current = flat.find((f) => f.mi === sel.m && f.li === sel.l) || flat[0];

    return (
        <div className="min-h-screen bg-[#050B18] text-white">
            <Navbar discordUrl={discordUrl} />

            <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8">
                <Link
                    to="/perfil"
                    data-testid="course-back-link"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Meu perfil
                </Link>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <h1 className="font-display text-3xl font-semibold tracking-wide sm:text-4xl" data-testid="course-title">
                        {product.name}
                    </h1>
                    <span className="bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                        {CATEGORY_LABEL[product.category] || product.category}
                    </span>
                </div>

                {flat.length === 0 ? (
                    <div className="mt-16 border border-white/10 bg-white/[0.04] p-12 text-center" data-testid="course-empty">
                        <h2 className="font-display text-2xl font-semibold">Conteúdo em breve</h2>
                        <p className="mt-3 text-sm font-light text-white/60">
                            As aulas deste {product.type === "curso" ? "curso" : "pack"} estão sendo preparadas.
                            Fique de olho no Discord.
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
                        {/* PLAYER */}
                        <div>
                            {current && (
                                <>
                                    <div className="relative aspect-video w-full bg-black" data-testid="course-player-area">
                                        {current.les.content_type === "video" ? (
                                            <iframe
                                                key={current.les.id}
                                                data-testid="course-video-frame"
                                                src={toEmbedUrl(current.les.video_url)}
                                                title={current.les.title}
                                                className="absolute inset-0 h-full w-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="absolute inset-0 overflow-auto border border-white/10 bg-[#0A1220] p-8 sm:p-10">
                                                <h2 className="font-display text-2xl font-semibold" data-testid="course-text-lesson-title">
                                                    {current.les.title}
                                                </h2>
                                                <p className="mt-6 whitespace-pre-line text-base font-light leading-relaxed text-white/75" data-testid="course-text-lesson-body">
                                                    {current.les.text}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                                                Aula {flat.findIndex((f) => f.mi === current.mi && f.li === current.li) + 1} de {flat.length} • {current.mod.title}
                                            </p>
                                            <h2 className="font-display mt-2 text-xl font-semibold sm:text-2xl" data-testid="course-lesson-title">
                                                {current.les.title}
                                            </h2>
                                        </div>
                                        {current.les.content_type === "video" ? (
                                            <Play className="h-5 w-5 shrink-0 text-[#007AFF]" />
                                        ) : (
                                            <FileText className="h-5 w-5 shrink-0 text-[#007AFF]" />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* PLAYLIST */}
                        <aside className="border border-white/10 bg-[#0A1220]">
                            <div className="playlist-scroll max-h-[70vh] overflow-auto p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                                    Conteúdo do curso
                                </p>
                                <div className="mt-6 space-y-8">
                                    {product.modules.map((mod, mi) => (
                                        <div key={mod.id}>
                                            <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
                                                {mod.title}
                                            </p>
                                            <ul className="mt-3 space-y-1.5">
                                                {(mod.lessons || []).map((les, li) => {
                                                    const active = current && current.mi === mi && current.li === li;
                                                    return (
                                                        <li key={les.id}>
                                                            <button
                                                                data-testid={`course-lesson-${mi}-${li}`}
                                                                onClick={() => setSel({ m: mi, l: li })}
                                                                className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-sm transition-colors ${
                                                                    active
                                                                        ? "border-white bg-white text-[#0A192F]"
                                                                        : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10"
                                                                }`}
                                                            >
                                                                <span className={`flex h-6 w-6 shrink-0 items-center justify-center text-[11px] font-semibold ${active ? "bg-[#0A192F] text-white" : "bg-white/10 text-white/70"}`}>
                                                                    {li + 1}
                                                                </span>
                                                                <span className="flex-1">{les.title}</span>
                                                                {les.content_type === "video" ? (
                                                                    <Play className="h-3.5 w-3.5 shrink-0" />
                                                                ) : (
                                                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                                                )}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
