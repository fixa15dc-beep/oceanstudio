import { WaveIcon } from "./WaveLogo";

function Sequence({ text, hidden = false }) {
    const parts = text.split("·").map((s) => s.trim()).filter(Boolean);
    return (
        <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
            {parts.map((item, i) => (
                <span key={`${item}-${i}`} className="flex items-center gap-10 pr-10">
                    <span className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.3em] text-white/70">{item}</span>
                    <WaveIcon className="h-3.5 w-3.5 opacity-50" />
                </span>
            ))}
        </span>
    );
}

export default function Marquee({ text }) {
    if (!text) return null;
    return (
        <div className="overflow-hidden border-y border-white/10 py-5" data-testid="marquee">
            <div className="animate-marquee flex w-max">
                <Sequence text={text} />
                <Sequence text={text} hidden />
            </div>
        </div>
    );
}
