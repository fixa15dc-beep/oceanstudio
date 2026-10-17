import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { OceanWordmark } from "../components/WaveLogo";

const MAYBACH = [
    "/img/maybach-1.webp",
    "/img/maybach-2.webp",
    "/img/maybach-3.webp",
    "/img/maybach-4.webp",
    "/img/maybach-5.webp",
    "/img/maybach-6.webp",
    "/img/maybach-7.jpg",
    "/img/maybach-8.jpg",
];

const CATALOG = [
    {
        id: "roupas",
        title: "Roupas",
        text: "Corte, cor e acabamento desenhados para a sua fac.",
        img: "/img/cat-roupas.jpg",
        target: "catalogo",
    },
    {
        id: "carros",
        title: "Carros",
        text: "Pintura, rodas e interior no padrão da sua fac.",
        img: "/img/maybach-1.webp",
        target: "carros",
    },
    {
        id: "hl",
        title: "HL",
        text: "O detalhe que fecha a identidade da sua fac.",
        img: "/img/cat-hl.jpg",
        target: "catalogo",
    },
];

export default function Home() {
    const [facs, setFacs] = useState([]);
    const [shot, setShot] = useState(0);

    useEffect(() => {
        API.get("/facs").then((r) => setFacs(r.data)).catch(() => {});
    }, []);

    const goSection = (id) =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <div className="bg-[#050B18]">
            <Navbar />

            {/* HERO */}
            <section className="relative flex min-h-[88vh] flex-col overflow-hidden">
                <img
                    src="/img/hero-capa.jpg"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#050B18]/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/85 via-[#050B18]/30 to-[#050B18]/50" />

                <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-6 pt-24 sm:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <OceanWordmark />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.7 }}
                        className="mt-8 text-xs uppercase tracking-[0.28em] text-white/60"
                    >
                        Estúdio criativo para FiveM
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="font-display mt-4 text-6xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl lg:text-8xl"
                    >
                        Identidade para
                        <br />
                        sua fac.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.8 }}
                        className="mt-6 max-w-lg text-base font-light leading-relaxed text-white/65 sm:text-lg"
                    >
                        Roupas, carros e HL criados sob medida para a sua fac. Do esboço à
                        entrega, com acabamento profissional e prontos para o seu servidor.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-9 flex flex-wrap items-center gap-4"
                    >
                        <button
                            data-testid="hero-cta-catalogo"
                            onClick={() => goSection("catalogo")}
                            className="rounded-full bg-white px-7 py-3 text-sm font-medium text-[#050B18] transition-transform hover:scale-[1.03]"
                        >
                            Ver catálogo
                        </button>
                        <Link
                            data-testid="hero-cta-fac"
                            to="/admin"
                            className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
                        >
                            Criar fac
                        </Link>
                    </motion.div>
                </div>

                <p className="relative pb-7 pt-8 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-white/85">
                    Todos os direitos resevados ©
                </p>
            </section>

            {/* CATÁLOGO */}
            <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                    <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">Catálogo</h2>
                    <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/55">
                        Cada peça nasce do zero, seguindo a identidade da fac que a encomenda.
                    </p>
                </motion.div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {CATALOG.map((c, i) => (
                        <motion.button
                            key={c.id}
                            data-testid={`catalog-${c.id}`}
                            onClick={() => goSection(c.target)}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ delay: i * 0.08, duration: 0.6 }}
                            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0A1220] text-left transition-colors duration-300 hover:border-white/25"
                        >
                            <div className="aspect-square overflow-hidden bg-white/5">
                                <img
                                    src={c.img}
                                    alt={c.title}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-display text-2xl font-bold tracking-tight text-white">{c.title}</h3>
                                <p className="mt-2 text-sm font-light leading-relaxed text-white/55">{c.text}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* CARROS — galeria Maybach */}
            <section id="carros" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Carros</p>
                        <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Maybach S-Class
                        </h2>
                        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/55">
                            Pintura fosca, rodas e interior desenvolvidos no padrão da fac.
                            Projeto pronto para rodar no servidor.
                        </p>
                    </motion.div>
                    <span className="text-sm text-white/60" data-testid="carros-variant">
                        Preto fosco
                    </span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0A1220]" data-testid="maybach-main">
                        <img
                            src={MAYBACH[shot]}
                            alt="Maybach S-Class"
                            className="aspect-video w-full object-cover"
                        />
                        <p className="absolute bottom-5 left-0 right-0 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                            Todos os direitos resevados ©
                        </p>
                    </div>
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                        {MAYBACH.map((src, i) => (
                            <button
                                key={src}
                                data-testid={`maybach-thumb-${i}`}
                                onClick={() => setShot(i)}
                                className={`h-16 w-28 shrink-0 overflow-hidden rounded-lg border transition-all ${
                                    i === shot
                                        ? "border-white opacity-100"
                                        : "border-transparent opacity-55 hover:opacity-90"
                                }`}
                                aria-label={`Foto ${i + 1}`}
                            >
                                <img src={src} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* FACS */}
            <section id="facs" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">Facs</h2>
                        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/55">
                            Projetos publicados pelo painel. Envie o nome e as fotos e a
                            página é criada na hora.
                        </p>
                    </motion.div>
                    <Link
                        to="/admin"
                        data-testid="fac-add"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                        + Adicionar
                    </Link>
                </div>

                {facs.length === 0 ? (
                    <div
                        className="mt-10 flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]"
                        data-testid="facs-empty"
                    >
                        <p className="text-sm text-white/50">Nenhuma fac ainda. Crie a primeira no painel.</p>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="facs-grid">
                        {facs.map((f) => (
                            <article
                                key={f.id}
                                data-testid={`fac-card-${f.id}`}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A1220]"
                            >
                                {f.images && f.images.length > 0 && (
                                    <div className="aspect-video overflow-hidden bg-white/5">
                                        <img src={f.images[0]} alt={f.name} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="font-display text-xl font-bold tracking-tight text-white">{f.name}</h3>
                                    {f.description && (
                                        <p className="mt-2 text-sm font-light leading-relaxed text-white/55">
                                            {f.description}
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
