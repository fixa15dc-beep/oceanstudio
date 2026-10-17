import { Link } from "react-router-dom";
import { WaveMark, WaveLogo } from "./WaveLogo";

export default function Footer({ discordUrl }) {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-[#001524] text-white">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-sm">
                        <WaveLogo />
                        <p className="mt-4 text-sm font-light leading-relaxed text-white/60">
                            Curso de HL, packs de carros e roupas para FiveM GTA RP.
                            Sua gameplay em destaque.
                        </p>
                        <WaveMark className="mt-6 h-8 w-auto text-white/20" />
                    </div>
                    <div className="flex gap-16">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                                Navegar
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-white/70">
                                <li>
                                    <Link to="/" className="transition-colors hover:text-white">
                                        Início
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/entrar" className="transition-colors hover:text-white">
                                        Entrar
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cadastro" className="transition-colors hover:text-white">
                                        Criar conta
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                                Fechar compra
                            </p>
                            <a
                                data-testid="footer-discord"
                                href={discordUrl || "https://discord.gg/oceanstudio"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
                            >
                                Entrar no Discord
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {year} Ocean Studio. Todos os direitos reservados.</span>
                    <span className="uppercase tracking-[0.18em]">FiveM • GTA RP • BR</span>
                </div>
            </div>
        </footer>
    );
}
