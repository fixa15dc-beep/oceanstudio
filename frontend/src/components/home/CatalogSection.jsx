import { ArrowUpRight } from "lucide-react";
import { FadeUp } from "../motion/Reveal";
import SectionHead from "./SectionHead";
import { assetUrl, scrollToSection } from "../../lib/media";

const SPANS = ["md:col-span-5", "md:col-span-4", "md:col-span-3"];
const RATIOS = ["aspect-[4/5]", "aspect-[4/5] md:aspect-[3/4]", "aspect-[4/5] md:aspect-[2/3]"];

export default function CatalogSection({ catalog }) {
    return (
        <section id="catalogo" className="pt-10" data-testid="section-catalogo">
            <SectionHead id="catalogo" label={catalog.label} title={catalog.title} text={catalog.subtitle} />
            <div className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-14 px-6 pb-24 sm:px-10 md:grid-cols-12 md:items-end">
                {(catalog.items || []).map((c, i) => (
                    <FadeUp key={`${c.title}-${i}`} delay={i * 0.1} className={SPANS[i % 3]}>
                        <button
                            data-testid={`catalog-${(c.title || "").toLowerCase()}`}
                            onClick={() => scrollToSection(c.target || "catalogo")}
                            className="group block w-full text-left"
                        >
                            <div className={`${RATIOS[i % 3]} frame overflow-hidden rounded-sm bg-white/5`}>
                                <img
                                    src={assetUrl(c.image)}
                                    alt={c.title}
                                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                                />
                            </div>
                            <div className="mt-5 flex items-start justify-between gap-4 border-t border-white/10 pt-4">
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">0{i + 1}</p>
                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{c.title}</h3>
                                    <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-white/55">{c.text}</p>
                                </div>
                                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                            </div>
                        </button>
                    </FadeUp>
                ))}
            </div>
        </section>
    );
}
