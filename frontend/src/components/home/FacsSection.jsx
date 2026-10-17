import { FadeUp } from "../motion/Reveal";
import SectionHead from "./SectionHead";
import { assetUrl } from "../../lib/media";

export default function FacsSection({ facs, items }) {
    return (
        <section id="facs" data-testid="section-facs">
            <SectionHead id="facs" label={facs.label} title={facs.title} text={facs.text} />
            <div className="mx-auto max-w-[1400px] px-6 pb-28 sm:px-10">
                {items.length === 0 ? (
                    <FadeUp>
                        <div className="flex h-40 items-center justify-center rounded-sm border border-dashed border-white/15" data-testid="facs-empty">
                            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Nenhuma fac publicada ainda</p>
                        </div>
                    </FadeUp>
                ) : (
                    <div className="divide-y divide-white/10 border-t border-white/10" data-testid="facs-grid">
                        {items.map((f, i) => (
                            <FadeUp key={f.id} amount={0.2}>
                                <article className="grid gap-6 py-10 md:grid-cols-12 md:items-start" data-testid={`fac-card-${f.id}`}>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:col-span-1">{String(i + 1).padStart(2, "0")}</p>
                                    <div className="md:col-span-4">
                                        <h3 className="text-2xl font-semibold tracking-tight text-white">{f.name}</h3>
                                        {f.description && <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">{f.description}</p>}
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-1 md:col-span-7">
                                        {(f.images || []).map((src, j) => (
                                            <div key={`${src}-${j}`} className={`frame shrink-0 overflow-hidden rounded-sm bg-white/5 ${j === 0 ? "h-44 w-72" : "h-44 w-44"}`}>
                                                <img src={assetUrl(src)} alt={f.name} className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04]" />
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            </FadeUp>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
