import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { OceanWordmark } from "../WaveLogo";
import { LineReveal } from "../motion/Reveal";
import { assetUrl, scrollToSection } from "../../lib/media";

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ hero, discordUrl }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
    const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const lines = (hero.title || "").split("\n").filter(Boolean);

    return (
        <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden" data-testid="hero">
            <motion.div style={{ y }} className="absolute inset-0">
                <motion.img
                    src={assetUrl(hero.bg_image)}
                    alt=""
                    aria-hidden="true"
                    initial={{ scale: 1.12, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.8, ease }}
                    className="h-[118%] w-full object-cover"
                    data-testid="hero-bg"
                />
            </motion.div>
            <div className="absolute inset-0 bg-[#06091A]/55" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06091A] to-transparent" />

            <motion.div style={{ opacity: fade }} className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-6 pb-14 pt-32 sm:px-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }}>
                    <OceanWordmark className="h-12 sm:h-16" />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-white/55"
                    data-testid="hero-eyebrow"
                >
                    {hero.eyebrow}
                </motion.p>

                <LineReveal
                    lines={lines}
                    delay={0.45}
                    className="mt-5 text-[13vw] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-[7.5rem]"
                />

                <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease, delay: 0.9 }}
                        className="max-w-md text-base leading-relaxed text-white/60"
                        data-testid="hero-subtitle"
                    >
                        {hero.subtitle}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease, delay: 1.05 }}
                        className="flex flex-wrap items-center gap-6"
                    >
                        <button
                            data-testid="hero-cta-catalogo"
                            onClick={() => scrollToSection(hero.cta_primary_target || "catalogo")}
                            className="group inline-flex items-center gap-3 rounded-full bg-white py-3.5 pl-7 pr-5 text-sm font-medium text-[#06091A] transition-transform duration-500 hover:-translate-y-0.5"
                        >
                            {hero.cta_primary}
                            <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
                        </button>
                        {discordUrl && (
                            <a
                                data-testid="hero-cta-discord"
                                href={discordUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="link-underline inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
                            >
                                {hero.cta_secondary}
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between border-t border-white/10 px-6 py-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 sm:px-10">
                <span data-testid="hero-note">{hero.note}</span>
                <span className="hidden items-center gap-3 sm:inline-flex">
                    Scroll
                    <span className="scroll-line block h-px w-10 bg-white/40" />
                </span>
            </div>
        </section>
    );
}
