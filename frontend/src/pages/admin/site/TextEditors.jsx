import { Panel, TextField, AreaField, ImageField } from "./fields";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function BrandEditor({ data, set }) {
    return (
        <Panel title="Marca" hint="Logo circular (nav, rodapé) e wordmark grande do hero." testId="site-brand">
            <TextField label="Nome" value={data.name} onChange={(v) => set("name", v)} testId="site-brand-name" />
            <ImageField label="Logo (ícone)" value={data.logo_url} onChange={(v) => set("logo_url", v)} testId="site-brand-logo" />
            <ImageField label="Wordmark (Ocean)" value={data.wordmark_url} onChange={(v) => set("wordmark_url", v)} testId="site-brand-wordmark" />
        </Panel>
    );
}

export function HeroEditor({ data, set }) {
    return (
        <Panel title="Hero (topo)" hint="Primeira tela do site." testId="site-hero">
            <ImageField label="Imagem de fundo" value={data.bg_image} onChange={(v) => set("bg_image", v)} testId="site-hero-bg" />
            <TextField label="Chamada pequena" value={data.eyebrow} onChange={(v) => set("eyebrow", v)} testId="site-hero-eyebrow" />
            <AreaField label="Título (uma linha por quebra)" value={data.title} onChange={(v) => set("title", v)} testId="site-hero-title" rows={2} hint="Pressione Enter para quebrar a linha do título." />
            <AreaField label="Subtítulo" value={data.subtitle} onChange={(v) => set("subtitle", v)} testId="site-hero-subtitle" />
            <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Botão principal" value={data.cta_primary} onChange={(v) => set("cta_primary", v)} testId="site-hero-cta1" />
                <TextField label="Botão principal leva para (id da seção)" value={data.cta_primary_target} onChange={(v) => set("cta_primary_target", v)} testId="site-hero-cta1-target" placeholder="catalogo, carros, hl, facs" />
                <TextField label="Link do Discord (texto)" value={data.cta_secondary} onChange={(v) => set("cta_secondary", v)} testId="site-hero-cta2" />
                <TextField label="Nota do rodapé do hero" value={data.note} onChange={(v) => set("note", v)} testId="site-hero-note" />
            </div>
        </Panel>
    );
}

export function MarqueeEditor({ data, set }) {
    return (
        <Panel title="Letreiro" hint='Separe os itens com " · ".' testId="site-marquee">
            <div className="flex items-center gap-3">
                <Switch checked={!!data.enabled} onCheckedChange={(v) => set("enabled", v)} data-testid="site-marquee-enabled" />
                <Label>Mostrar letreiro</Label>
            </div>
            <TextField label="Texto" value={data.text} onChange={(v) => set("text", v)} testId="site-marquee-text" />
        </Panel>
    );
}

export function TextsEditor({ title, data, set, testId, withText = true }) {
    return (
        <Panel title={title} testId={testId}>
            <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Etiqueta" value={data.label} onChange={(v) => set("label", v)} testId={`${testId}-label`} />
                <TextField label="Título" value={data.title} onChange={(v) => set("title", v)} testId={`${testId}-title`} />
            </div>
            {withText && <AreaField label="Texto" value={data.text ?? data.subtitle} onChange={(v) => set(data.subtitle !== undefined ? "subtitle" : "text", v)} testId={`${testId}-text`} />}
        </Panel>
    );
}

export function FooterEditor({ data, set }) {
    return (
        <Panel title="Rodapé" testId="site-footer">
            <TextField label="Frase" value={data.tagline} onChange={(v) => set("tagline", v)} testId="site-footer-tagline" />
            <TextField label="Direitos" value={data.copyright} onChange={(v) => set("copyright", v)} testId="site-footer-copyright" />
        </Panel>
    );
}
