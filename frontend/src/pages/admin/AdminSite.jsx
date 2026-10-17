import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API, apiError } from "../../api";
import { useSite } from "../../context/SiteContext";
import { BrandEditor, HeroEditor, MarqueeEditor, TextsEditor, FooterEditor } from "./site/TextEditors";
import { NavEditor, CatalogEditor, CarsEditor, HLEditor } from "./site/ListEditors";

export default function AdminSite() {
    const { refresh } = useSite();
    const [site, setSite] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        API.get("/site").then((r) => setSite(r.data)).catch((e) => toast.error(apiError(e)));
    }, []);

    const setIn = (section) => (key, value) =>
        setSite((s) => ({ ...s, [section]: { ...s[section], [key]: value } }));

    const save = async () => {
        setBusy(true);
        try {
            const { data } = await API.put("/admin/site", site);
            setSite(data);
            refresh();
            toast.success("Site atualizado!");
        } catch (e) {
            toast.error(apiError(e));
        } finally {
            setBusy(false);
        }
    };

    const reset = async () => {
        if (!window.confirm("Voltar todos os textos e fotos do site para o padrão?")) return;
        try {
            const { data } = await API.post("/admin/site/reset");
            setSite(data);
            refresh();
            toast.success("Site restaurado para o padrão.");
        } catch (e) {
            toast.error(apiError(e));
        }
    };

    if (!site) return <p className="text-sm text-white/50">Carregando...</p>;

    return (
        <div className="space-y-6" data-testid="admin-site-panel">
            <div className="sticky top-0 z-20 -mx-5 flex items-center justify-between gap-4 border-b border-white/10 bg-[#06091A]/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
                <p className="text-sm text-white/60">Tudo o que aparece no site público. Salve para publicar.</p>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={reset} data-testid="site-reset" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:text-white">
                        <RotateCcw className="h-3.5 w-3.5" /> Padrão
                    </button>
                    <Button data-testid="site-save" onClick={save} disabled={busy} className="rounded-full bg-white px-6 text-xs uppercase tracking-[0.14em] text-[#06091A] hover:bg-white/90">
                        <Save className="mr-2 h-4 w-4" /> {busy ? "Salvando..." : "Salvar e publicar"}
                    </Button>
                </div>
            </div>

            <BrandEditor data={site.brand} set={setIn("brand")} />
            <NavEditor items={site.nav} onChange={(v) => setSite((s) => ({ ...s, nav: v }))} />
            <HeroEditor data={site.hero} set={setIn("hero")} />
            <MarqueeEditor data={site.marquee} set={setIn("marquee")} />
            <CatalogEditor data={site.catalog} set={setIn("catalog")} />
            <CarsEditor data={site.cars} set={setIn("cars")} />
            <HLEditor data={site.hl} set={setIn("hl")} />
            <TextsEditor title="Facs (textos da seção)" data={site.facs} set={setIn("facs")} testId="site-facs" />
            <FooterEditor data={site.footer} set={setIn("footer")} />

            <div className="flex justify-end">
                <Button data-testid="site-save-bottom" onClick={save} disabled={busy} className="rounded-full bg-white px-6 text-xs uppercase tracking-[0.14em] text-[#06091A] hover:bg-white/90">
                    <Save className="mr-2 h-4 w-4" /> {busy ? "Salvando..." : "Salvar e publicar"}
                </Button>
            </div>
        </div>
    );
}
