import { Play } from "lucide-react";
import { FadeUp } from "../motion/Reveal";
import SectionHead from "./SectionHead";
import { assetUrl, isDirectVideo } from "../../lib/media";
import { toEmbedUrl } from "../../api";

function VideoTile({ v, index }) {
    const direct = isDirectVideo(v.url);
    return (
        <FadeUp delay={(index % 2) * 0.1} amount={0.15}>
            <article data-testid={`hl-video-${index}`}>
                <div className="frame relative aspect-video overflow-hidden rounded-sm bg-black">
                    {direct ? (
                        <video
                            src={assetUrl(v.url)}
                            poster={v.poster ? assetUrl(v.poster) : undefined}
                            controls
                            preload="metadata"
                            playsInline
                            className="h-full w-full"
                        />
                    ) : (
                        <iframe
                            src={toEmbedUrl(v.url)}
                            title={v.title || `HL ${index + 1}`}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3">
                    <h3 className="text-lg font-medium tracking-tight text-white">{v.title || `HL ${index + 1}`}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">{String(index + 1).padStart(2, "0")}</span>
                </div>
            </article>
        </FadeUp>
    );
}

export default function HLSection({ hl }) {
    const videos = hl.videos || [];
    return (
        <section id="hl" data-testid="section-hl">
            <SectionHead id="hl" label={hl.label} title={hl.title} text={hl.text} />
            <div className="mx-auto max-w-[1400px] px-6 pb-24 sm:px-10">
                {videos.length === 0 ? (
                    <FadeUp>
                        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-white/15 text-white/40" data-testid="hl-empty">
                            <Play className="h-5 w-5" />
                            <p className="font-mono text-[11px] uppercase tracking-[0.3em]">Em breve</p>
                        </div>
                    </FadeUp>
                ) : (
                    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2" data-testid="hl-grid">
                        {videos.map((v, i) => <VideoTile key={`${v.url}-${i}`} v={v} index={i} />)}
                    </div>
                )}
            </div>
        </section>
    );
}
