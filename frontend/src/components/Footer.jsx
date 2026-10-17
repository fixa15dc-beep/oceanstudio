import { Link } from "react-router-dom";
import { WaveIcon, WaveLogo } from "./WaveLogo";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#030710] py-14 text-center">
            <WaveIcon className="mx-auto h-9 w-9" />
            <p className="font-display mt-4 text-lg font-bold text-white">Ocean Studio</p>
            <p className="mt-1 text-sm font-light text-white/50">
                Roupas, carros e HL sob medida para facs no FiveM.
            </p>
            <p className="mt-6 text-xs text-white/35">
                Ocean Studio © Todos direitos reservados
            </p>
        </footer>
    );
}
