import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, ArrowUpRight, UserPlus, MessageCircle, KeyRound } from "lucide-react";
import { API, formatPrice, CATEGORY_LABEL } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import ProductCard from "../components/ProductCard";
import { WaveMark } from "../components/WaveLogo";

const lineVariants = {
    hidden: { y: "110%" },
    show: (i) => ({
        y: 0,
        transition: { delay: 0.15 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    }),
};

const HL_FEATURES = [
    "Da clipe bruta ao edit final",
    "Ritmo, cortes e sincronia com a música",
    "Identidade visual que marca o seu estilo",
    "Exportação pronta para YouTube e TikTok",
];

const STEPS = [
    { icon: UserPlus, title: "Crie sua conta no site", text: "É rapidinho: e-mail e senha, sem complicação." },
    { icon: MessageCircle, title: "Feche a compra no Discord", text: "Escolheu o curso ou pack? A compra é fechada direto no nosso servidor." },
    { icon: KeyRound, title: "Receba o acesso no seu perfil", text: "O dono seta o acesso e o conteúdo aparece aqui no seu perfil do site." },
];

function SectionHeader({ eyebrow, title, sub }) {
    return (
        <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#007AFF]">{eyebrow}</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-wide text-[#0A192F] sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            {sub && <p className="mt-4 text-base font-light leading-relaxed text-[#0F172A]/60">{sub}</p>}
        </div>
    );
}

function ProductGrid({ id, eyebrow, title, sub, products, discordUrl, emptyText }) {
    return (
        <section id={id} className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <SectionHeader eyebrow={eyebrow} title={title} sub={sub} />
            {products.length > 0 ? (
                <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} discordUrl={discordUrl} />
                    ))}
                </div>
            ) : (
                <p className="mt-12 border border-[#0A192F]/10 bg-[#F8FAFC] p-8 text-sm text-[#0F172A]/50">
                    {emptyText}
                </p>
            )}
        </section>
    );
}

export default function Home() {
    const [products, setProducts] = useState([]);
    const [discordUrl, setDiscordUrl] = useState("https://discord.gg/oceanstudio");

    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroImageY = useTransform(heroScroll, [0, 1], [0, 90]);
    const heroMarkY = useTransform(heroScroll, [0, 1], [0, -60]);

    const spotRef = useRef(null);
    const { scrollYProgress: spotScroll } = useScroll({ target: spotRef, offset: ["start end", "end start"] });
    const spotImageY = useTransform(spotScroll, [0, 1], [-30, 30]);

    useEffect(() => {
        API.get("/products").then((r) => setProducts(r.data)).catch(() => {});
        API.get("/settings").then((r) => setDiscordUrl(r.data.discord_url || "https://discord.gg/oceanstudio")).catch(() => {});
    }, []);

    const featured = products.find((p) => p.category === "hl" && p.featured) || products.find((p) => p.category === "hl");
    const carros = products.filter((p) => p.category === "carros");
    const roupas = products.filter((p) => p.category === "roupas");

    const goSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <div className="bg-white">
            <Navbar discordUrl={discordUrl} />

            {/* HERO */}
            <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden bg-[#0A192F] text-white">
                <WaveMark className="pointer-events-none absolute -right-24 top-1/2 h-[80vh] w-auto -translate-y-1/2 text-white/[0.04]" />
                <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                            <span className="h-px w-10 bg-[#007AFF]" />
                            FiveM • GTA RP • Brasil
                        </p>
                        <h1 className="font-display mt-8 text-5xl font-semibold leading-[1.05] tracking-wide sm:text-6xl lg:text-7xl">
                            <span className="block overflow-hidden pb-1">
                                <motion.span custom={0} variants={lineVariants} initial="hidden" animate="show" className="block">
                                    Sua gameplay
                                </motion.span>
                            </span>
                            <span className="block overflow-hidden pb-2">
                                <motion.span custom={1} variants={lineVariants} initial="hidden" animate="show" className="block">
                                    em <em className="italic text-[#007AFF]">destaque.</em>
                                </motion.span>
                            </span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/65"
                        >
                            Curso de HL, packs de carros e roupas para FiveM GTA RP —
                            direto da Ocean Studio, com acabamento profissional.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65, duration: 0.8 }}
                            className="mt-10 flex flex-wrap items-center gap-4"
                        >
                            <button
                                data-testid="hero-cta-vitrine"
                                onClick={() => goSection("vitrine")}
                                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#0A192F] transition-transform hover:scale-[1.04]"
                            >
                                Ver cursos e packs
                            </button>
                            <a
                                data-testid="hero-cta-discord"
                                href={discordUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-[#5865F2] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.04]"
                            >
                                Comprar no Discord
                            </a>
                        </motion.div>
                    </div>

                    <motion.div style={{ y: heroImageY }} className="relative hidden lg:block">
                        <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
                            {featured?.image_url ? (
                                <img
                                    src={featured.image_url}
                                    alt={featured.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-white/5">
                                    <WaveMark className="h-24 w-auto text-white/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent" />
                        </div>
                        {featured && (
                            <div className="absolute -bottom-6 -left-10 border border-white/10 bg-[#001524] p-6">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                                    {CATEGORY_LABEL[featured.category]} em destaque
                                </p>
                                <p className="font-display mt-2 text-2xl font-semibold">{featured.name}</p>
                                <p className="mt-1 text-sm text-white/60">{formatPrice(featured.price)} • feche a compra no Discord</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <Marquee />

            {/* VITRINE — destaque HL */}
            <section id="vitrine" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
                <SectionHeader
                    eyebrow="A vitrine"
                    title="Tudo para o seu servidor FiveM"
                    sub="Cursos para aprender a editar e criar conteúdo, packs prontos para instalar. Escolha, feche a compra no Discord e estude no seu perfil."
                />

                {featured && (
                    <div ref={spotRef} className="mt-16 grid items-center gap-12 lg:grid-cols-2">
                        <motion.div style={{ y: spotImageY }} className="relative aspect-video overflow-hidden bg-[#0A192F]/5">
                            {featured.image_url && (
                                <img src={featured.image_url} alt={featured.name} className="h-full w-full scale-110 object-cover" />
                            )}
                        </motion.div>
                        <div>
                            <p className="inline-block bg-[#0A192F] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                                Curso em destaque
                            </p>
                            <h3 className="font-display mt-5 text-4xl font-semibold tracking-wide text-[#0A192F] sm:text-5xl">
                                {featured.name}
                            </h3>
                            <p className="mt-5 text-base font-light leading-relaxed text-[#0F172A]/65">{featured.description}</p>
                            <ul className="mt-7 space-y-3">
                                {HL_FEATURES.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-[#0F172A]/80">
                                        <Check className="h-4 w-4 shrink-0 text-[#007AFF]" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-9 flex flex-wrap items-center gap-6">
                                <span className="font-display text-4xl font-semibold text-[#0A192F]" data-testid="featured-price">
                                    {formatPrice(featured.price)}
                                </span>
                                <a
                                    data-testid="featured-buy-discord"
                                    href={discordUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.04]"
                                >
                                    Comprar no Discord
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            </div>
                            <p className="mt-4 text-xs text-[#0F172A]/45">
                                A compra é fechada direto no nosso Discord. Depois, o acesso aparece no seu perfil aqui do site.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* CARROS + ROUPAS */}
            <div className="bg-[#F8FAFC]">
                <ProductGrid
                    id="carros"
                    eyebrow="Velocidade"
                    title="Carros"
                    sub="Packs prontos para instalar e cursos para deixar os veículos do seu servidor com cara de profissional."
                    products={carros}
                    discordUrl={discordUrl}
                    emptyText="Novos packs de carros em breve. Fique de olho no Discord."
                />
                <ProductGrid
                    id="roupas"
                    eyebrow="Estilo"
                    title="Roupas"
                    sub="Packs de roupas exclusivas para a sua comunidade e cursos para você criar as suas."
                    products={roupas}
                    discordUrl={discordUrl}
                    emptyText="Novos packs de roupas em breve. Fique de olho no Discord."
                />
            </div>

            {/* COMO FUNCIONA */}
            <section className="border-y border-[#0A192F]/10 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
                    <SectionHeader eyebrow="Como funciona" title="Do Discord para o seu perfil em três passos" />
                    <div className="mt-12 grid gap-10 md:grid-cols-3">
                        {STEPS.map((s, i) => (
                            <div key={s.title} className="border-t-2 border-[#0A192F] pt-6">
                                <s.icon className="h-6 w-6 text-[#007AFF]" />
                                <p className="font-display mt-5 text-sm tracking-[0.2em] text-[#0A192F]/40">0{i + 1}</p>
                                <h3 className="font-display mt-2 text-xl font-semibold text-[#0A192F]">{s.title}</h3>
                                <p className="mt-2 text-sm font-light leading-relaxed text-[#0F172A]/60">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOBRE / CONTATO */}
            <section id="sobre" className="bg-[#0A192F] text-white">
                <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Sobre a Ocean Studio</p>
                        <h2 className="font-display mt-5 text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
                            Feita por quem vive GTA RP, para quem quer aparecer.
                        </h2>
                        <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-white/60">
                            A Ocean Studio nasceu dentro da comunidade FiveM GTA RP BR para
                            transformar gameplays comuns em highlights memoráveis — e para
                            deixar servidores com carros e roupas de altíssimo nível.
                        </p>
                        <WaveMark className="mt-10 h-10 w-auto text-white/25" />
                    </div>
                    <div className="border border-white/10 bg-white/[0.04] p-10 backdrop-blur">
                        <h3 className="font-display text-2xl font-semibold">Pronto para destacar?</h3>
                        <p className="mt-3 text-sm font-light leading-relaxed text-white/60">
                            Crie sua conta no site, escolha seu curso ou pack e feche a
                            compra direto no nosso Discord. O acesso é liberado no seu perfil.
                        </p>
                        <a
                            data-testid="sobre-discord"
                            href={discordUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.04]"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Entrar no Discord
                        </a>
                    </div>
                </div>
            </section>

            <Footer discordUrl={discordUrl} />
        </div>
    );
}
