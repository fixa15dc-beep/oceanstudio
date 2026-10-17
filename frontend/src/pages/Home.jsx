import { useEffect, useState } from "react";
import { API } from "../api";
import { useSite } from "../context/SiteContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import SmoothScroll from "../components/SmoothScroll";
import Hero from "../components/home/Hero";
import CatalogSection from "../components/home/CatalogSection";
import CarsSection from "../components/home/CarsSection";
import HLSection from "../components/home/HLSection";
import FacsSection from "../components/home/FacsSection";

export default function Home() {
    const { site, settings } = useSite();
    const [facs, setFacs] = useState([]);

    useEffect(() => {
        API.get("/facs").then((r) => setFacs(r.data)).catch(() => {});
    }, []);

    if (!site) return <div className="min-h-screen bg-[#06091A]" data-testid="home-loading" />;

    return (
        <SmoothScroll>
            <div className="grain bg-[#06091A] text-white">
                <Navbar />
                <Hero hero={site.hero} discordUrl={settings.discord_url} />
                {site.marquee?.enabled && <Marquee text={site.marquee.text} />}
                <CatalogSection catalog={site.catalog} />
                <CarsSection cars={site.cars} />
                <HLSection hl={site.hl} />
                <FacsSection facs={site.facs} items={facs} />
                <Footer />
            </div>
        </SmoothScroll>
    );
}
