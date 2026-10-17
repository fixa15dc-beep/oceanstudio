import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp } from "../motion/Reveal";
import SectionHead from "./SectionHead";
import { assetUrl } from "../../lib/media";

export default function CarsSection({ cars }) {
    const [shot, setShot] = useState(0);
    const images = cars.images || [];
    const current = images[Math.min(shot, Math.max(images.length - 1, 0))];

    return (
        <section id="carros" data-testid="section-carros">
            <SectionHead
                id="carros"
                label={cars.label}
                title={cars.title}
                text={cars.text}
                aside={cars.badge ? (
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/70 md:text-right" data-testid="carros-variant">{cars.badge}</p>
                ) : null}
            />
            <div className="mx-auto max-w-[1400px] px-6 pb-24 sm:px-10">
                <FadeUp amount={0.15}>
                    <div className="frame relative aspect-[16/9] overflow-hidden rounded-sm bg-white/5 sm:aspect-[21/9]" data-testid="maybach-main">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                                key={current}
                                src={assetUrl(current)}
                                alt={cars.title}
                                initial={{ opacity: 0, scale: 1.03 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </AnimatePresence>
                        <span className="absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                            {String(shot + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                        </span>
                    </div>
                </FadeUp>
                <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                    {images.map((src, i) => (
                        <button
                            key={`${src}-${i}`}
                            data-testid={`maybach-thumb-${i}`}
                            onClick={() => setShot(i)}
                            aria-label={`Foto ${i + 1}`}
                            className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-sm transition-opacity duration-500 ${i === shot ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
                        >
                            <img src={assetUrl(src)} alt="" className="h-full w-full object-cover" />
                            {i === shot && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white" />}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
