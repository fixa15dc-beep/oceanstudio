import { FadeUp, Rule } from "../motion/Reveal";

/** Editorial section header: mono label | large title | right-aligned text. */
export default function SectionHead({ label, title, text, aside, id }) {
    return (
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
            <Rule />
            <div className="grid gap-6 py-10 md:grid-cols-12 md:items-end md:py-14">
                <FadeUp className="md:col-span-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45" data-testid={`${id}-label`}>{label}</p>
                </FadeUp>
                <FadeUp delay={0.08} className="md:col-span-6">
                    <h2 className="text-4xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl" data-testid={`${id}-title`}>
                        {title}
                    </h2>
                </FadeUp>
                <FadeUp delay={0.16} className="md:col-span-4 md:justify-self-end">
                    <p className="max-w-xs text-sm leading-relaxed text-white/55 md:text-right" data-testid={`${id}-text`}>{text}</p>
                    {aside}
                </FadeUp>
            </div>
        </div>
    );
}
