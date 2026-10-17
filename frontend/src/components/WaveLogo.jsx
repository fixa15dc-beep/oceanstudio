import { useSite } from "../context/SiteContext";
import { assetUrl } from "../lib/media";

/** Circular wave mark (real logo image, white on transparent). */
export function WaveIcon({ className = "h-8 w-8" }) {
    const { site } = useSite();
    return <img src={assetUrl(site?.brand?.logo_url || "/img/logo.png")} alt="" aria-hidden="true" className={`${className} select-none object-contain`} draggable="false" />;
}

/** Icon + brand name, used in nav and panels. */
export function WaveLogo({ className = "" }) {
    const { site } = useSite();
    return (
        <span className={`inline-flex items-center gap-3 ${className}`}>
            <WaveIcon className="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-tight text-white">
                {site?.brand?.name || "Ocean Studio"}
            </span>
        </span>
    );
}

/** Large "Ocean" wordmark image for the hero. */
export function OceanWordmark({ className = "h-14 sm:h-20" }) {
    const { site } = useSite();
    return (
        <img
            src={assetUrl(site?.brand?.wordmark_url || "/img/wordmark.png")}
            alt={site?.brand?.name || "Ocean"}
            className={`${className} w-auto select-none object-contain`}
            draggable="false"
        />
    );
}

export default WaveLogo;
