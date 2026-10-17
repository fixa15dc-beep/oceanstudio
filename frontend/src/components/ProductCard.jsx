import { ArrowUpRight } from "lucide-react";
import { formatPrice, CATEGORY_LABEL, TYPE_LABEL } from "../api";
import { assetUrl } from "../lib/media";

export default function ProductCard({ product, discordUrl }) {
    const p = product;
    return (
        <article
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A1220] transition-colors duration-300 hover:border-white/25"
            data-testid={`product-card-${p.id}`}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                {p.image_url ? (
                    <img
                        src={assetUrl(p.image_url)}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center font-display text-4xl font-bold text-white/15">
                        OS
                    </div>
                )}
                <span className="absolute left-4 top-4 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                    {TYPE_LABEL[p.type] || p.type} • {CATEGORY_LABEL[p.category] || p.category}
                </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold tracking-tight text-white">
                    {p.name}
                </h3>
                {p.description && (
                    <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-white/55">
                        {p.description}
                    </p>
                )}
                <div className="mt-4 flex flex-1 items-end justify-between gap-4">
                    <span
                        className="font-display text-2xl font-bold text-white"
                        data-testid={`product-price-${p.id}`}
                    >
                        {formatPrice(p.price)}
                    </span>
                    <a
                        data-testid={`buy-discord-${p.id}`}
                        href={discordUrl || "https://discord.gg/oceanstudio"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#5865F2] px-5 py-2.5 text-[13px] font-medium text-white transition-transform hover:scale-[1.04]"
                    >
                        Comprar no Discord
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </article>
    );
}
