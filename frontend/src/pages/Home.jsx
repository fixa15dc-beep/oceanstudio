import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, ArrowUpRight, UserPlus, MessageCircle, KeyRound, ChevronRight } from "lucide-react";
import { API, formatPrice } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import ProductCard from "../components/ProductCard";
import { WaveIcon, WaveMark } from "../components/WaveLogo";

const HERO_BANNER =
    "https://static.prod-images.emergentagent.com/jobs/de40f0ef-399a-4f28-a909-bb7c68b70e1a/images/61a0b40bcf4b15d0e106c1c12e8c53dcd7908467291052647d3f4a8fdf895825.jpeg";

const lineVariants = {
    hidden: { y: "110%" },
    show: (i) => ({
        y: 0,
        transition: { delay: 0.15 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    }),
};

const CATALOG = [
    {
        id: "roupas",
        title: "Roupas",
        text: "Corte, cor e acabamento desenhados para a sua fac.",
        img: "https://images.unsplash.com/photo-1508216310976-c518daae0cdc?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
        id: "carros",
        title: "Carros",
        text: "Pintura, rodas e interior no padrão da sua fac.",
        img: "https://images.unsplash.com/photo-1673170717377-93fd50d26689?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
        id: "hl",
        title: "HL",
        text: "O detalhe que fecha a identidade da sua fac.",
        img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
];

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

function SectionHeader({ title, sub }) {
    return (
        <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
            {sub && <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/55">{sub}</p>}
        </div>
    );
}

function ProductGrid({ id, title, sub, products, discordUrl, emptyText }) {
    return (
        <section id={id} className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <SectionHeader title={title} sub={sub} />
            {products.length > 0 ? (
                <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} discordUrl={discordUrl} />
                    ))}
                </div>
            ) : (
                <p className="mt-10 rounded-2xl border border-white/10 bg-[#0A1220] p-8 text-sm text-white/50">
                    {emptyText}
                </p>
            )}
        </section>
    );
}

export default function Home() {
    const [products, setProducts] = useState([]);
    const [discordUrl, setDiscordUrl] = useState("https://discord.gg/oceanstudio");

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
        <div className="bg-[#050B18]">
            <Navbar discordUrl={discordUrl} />

            {/* HERO com banner Ocean Studio */}
            <section className="relative min-h-[92vh] overflow-hidden text-white">
                <img
                    src={HERO_BANNER}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/75 to-[#050B18]/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-[#050B18]/70" />

                <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-flex items-end">
                            <OceanWordmarkInline />
                        </span>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
                    >
                        Estúdio criativo para FiveM
                    </motion.p>
                    <h1 className="font-display mt-5 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl">
                        <span className="block overflow-hidden pb-1">
                            <motion.span custom={0} variants={lineVariants} initial="hidden" animate="show" className="block">
                                Identidade para
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden pb-2">
                            <motion.span custom={1} variants={lineVariants} initial="hidden" animate="show" className="block">
                                sua fac.
                            </motion.span>
                        </span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-6 max-w-lg text-base font-light leading-relaxed text-white/65 sm:text-lg"
                    >
                        Roupas, carros e HL criados sob medida para a sua fac. Do esboço à
                        entrega, com acabamento profissional e prontos para o seu servidor.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.8 }}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <button
                            data-testid="hero-cta-catalogo"
                            onClick={() => goSection("catalogo")}
                            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#050B18] transition-transform hover:scale-[1.04]"
                        >
                            Ver catálogo
                        </button>
                        <a
                            data-testid="hero-cta-discord"
                            href={discordUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                        >
                            Comprar no Discord
                        </a>
                    </motion.div>
                </div>
            </section>

            <Marquee />

            {/* CATÁLOGO */}
            <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
                <SectionHeader
                    title="Catálogo"
                    sub="Cada peça nasce do zero, seguindo a identidade da fac que encomenda."
                />
                <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {CATALOG.map((c, i) => (
                        <motion.button
                            key={c.id}
                            data-testid={`catalog-${c.id}`}
                            onClick={() => goSection(c.id)}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ delay: i * 0.08, duration: 0.6 }}
                            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0A1220] text-left transition-colors duration-300 hover:border-white/25"
                        >
                            <div className="aspect-[4/3] overflow-hidden bg-white/5">
                                <img
                                    src={c.img}
                                    alt={c.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-display text-2xl font-bold tracking-tight text-white">{c.title}</h3>
                                <p className="mt-2 text-sm font-light leading-relaxed text-white/55">{c.text}</p>
                                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#007AFF]">
                                    Ver produtos
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* DESTAQUE HL */}
            {featured && (
                <section id="hl" ref={spotRef} className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                    <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#0A1220] lg:grid-cols-2">
                        <motion.div style={{ y: spotImageY }} className="relative min-h-[280px] overflow-hidden">
                            {featured.image_url && (
                                <img
                                    src={featured.image_url}
                                    alt={featured.name}
                                    className="absolute inset-0 h-full w-full scale-110 object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1220] via-transparent to-transparent lg:bg-gradient-to-r" />
                        </motion.div>
                        <div className="p-8 sm:p-12">
                            <p className="inline-block bg-[#007AFF] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                                Curso em destaque
                            </p>
                            <h3 className="font-display mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl" data-testid="featured-title">
                                {featured.name}
                            </h3>
                            <p className="mt-4 text-sm font-light leading-relaxed text-white/60 sm:text-base">
                                {featured.description}
                            </p>
                            <ul className="mt-6 space-y-3">
                                {HL_FEATURES.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                                        <Check className="h-4 w-4 shrink-0 text-[#007AFF]" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-9 flex flex-wrap items-center gap-6">
                                <span className="font-display text-3xl font-bold text-white" data-testid="featured-price">
                                    {formatPrice(featured.price)}
                                </span>
                                <a
                                    data-testid="featured-buy-discord"
                                    href={discordUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.04]"
                                >
                                    Comprar no Discord
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            </div>
                            <p className="mt-4 text-xs font-light text-white/45">
                                A compra é fechada direto no nosso Discord. Depois, o acesso aparece no seu perfil aqui do site.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* CARROS + ROUPAS */}
            <ProductGrid
                id="carros"
                title="Carros"
                sub="Packs prontos para instalar e cursos para deixar os veículos do seu servidor com cara de profissional."
                products={carros}
                discordUrl={discordUrl}
                emptyText="Novos packs de carros em breve. Fique de olho no Discord."
            />
            <ProductGrid
                id="roupas"
                title="Roupas"
                sub="Packs de roupas exclusivas para a sua comunidade e cursos para você criar as suas."
                products={roupas}
                discordUrl={discordUrl}
                emptyText="Novos packs de roupas em breve. Fique de olho no Discord."
            />

            {/* COMO FUNCIONA */}
            <section className="border-y border-white/5">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
                    <SectionHeader title="Como funciona" sub="Do Discord para o seu perfil em três passos." />
                    <div className="mt-12 grid gap-10 md:grid-cols-3">
                        {STEPS.map((s, i) => (
                            <div key={s.title} className="border-t-2 border-[#007AFF] pt-6">
                                <s.icon className="h-6 w-6 text-[#007AFF]" />
                                <p className="font-display mt-5 text-sm font-bold tracking-[0.2em] text-white/35">0{i + 1}</p>
                                <h3 className="font-display mt-2 text-xl font-bold text-white">{s.title}</h3>
                                <p className="mt-2 text-sm font-light leading-relaxed text-white/55">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOBRE / CONTATO */}
            <section id="sobre" className="relative overflow-hidden">
                <WaveMark className="pointer-events-none absolute -left-16 top-10 h-64 w-auto text-white/[0.03]" />
                <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#007AFF]">Sobre a Ocean Studio</p>
                        <h2 className="font-display mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Feita por quem vive GTA RP, para a sua fac aparecer.
                        </h2>
                        <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-white/60">
                            A Ocean Studio nasceu dentro da comunidade FiveM GTA RP BR para
                            transformar gameplays comuns em highlights memoráveis — e para
                            deixar servidores com carros e roupas de altíssimo nível.
                        </p>
                        <WaveIcon className="mt-10 h-10 w-10 text-white/25" />
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0A1220] p-10">
                        <h3 className="font-display text-2xl font-bold">Pronto para destacar?</h3>
                        <p className="mt-3 text-sm font-light leading-relaxed text-white/55">
                            Crie sua conta no site, escolha seu curso ou pack e feche a
                            compra direto no nosso Discord. O acesso é liberado no seu perfil.
                        </p>
                        <a
                            data-testid="sobre-discord"
                            href={discordUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.04]"
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

function OceanWordmarkInline() {
    return (
        <span className="inline-flex items-center" aria-label="Ocean">
            <WaveIcon className="h-11 w-11 sm:h-14 sm:w-14" stroke="#FFFFFF" />
            <span className="font-display text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl">
                cean
            </span>
        </span>
    );
}
