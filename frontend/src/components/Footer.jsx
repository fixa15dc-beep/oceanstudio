import { Link } from "react-router-dom";
import { WaveIcon } from "./WaveLogo";
import { useSite } from "../context/SiteContext";

export default function Footer() {
    const { site, settings } = useSite();
    const f = site?.footer || {};
    return (
        <footer className="border-t border-white/10 bg-[#04061A]">
            <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 sm:px-10 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                    <WaveIcon className="h-10 w-10" />
                    <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">{f.tagline}</p>
                </div>
                <div className="flex flex-col gap-3 text-sm text-white/50 md:items-end">
                    {settings?.discord_url && (
                        <a data-testid="footer-discord" href={settings.discord_url} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                            Discord ↗
                        </a>
                    )}
                    <Link data-testid="footer-login" to="/entrar" className="transition-colors hover:text-white">
                        Área do aluno
                    </Link>
                </div>
            </div>
            <div className="mx-auto flex max-w-[1400px] items-center justify-between border-t border-white/5 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 sm:px-10">
                <span>{f.copyright}</span>
                <span>FiveM</span>
            </div>
        </footer>
    );
}
