import { WaveMark } from "./WaveLogo";

const ITEMS = [
    "Ocean Studio",
    "Curso de HL",
    "Packs de Carros",
    "Packs de Roupas",
    "FiveM",
    "GTA RP",
    "Edição Profissional",
];

function Sequence({ hidden = false }) {
    return (
        <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
            {ITEMS.map((item) => (
                <span key={item} className="flex items-center">
                    <span className="font-display px-8 text-lg tracking-[0.18em] uppercase sm:text-xl">
                        {item}
                    </span>
                    <WaveMark className="h-4 w-auto opacity-40" stroke="#0A192F" />
                </span>
            ))}
        </span>
    );
}

export default function Marquee() {
    return (
        <div className="overflow-hidden border-y border-[#0A192F]/10 bg-white py-5">
            <div className="animate-marquee flex w-max">
                <Sequence />
                <Sequence hidden />
            </div>
        </div>
    );
}
