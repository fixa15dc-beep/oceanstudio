import { Plus, Trash2 } from "lucide-react";
import { Panel, TextField, AreaField, ImageField } from "./fields";
import { MediaListField } from "../../../components/Uploader";

function RemoveButton({ onClick, testId }) {
    return (
        <button type="button" onClick={onClick} data-testid={testId} className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-red-400">
            <Trash2 className="h-3.5 w-3.5" /> remover
        </button>
    );
}

function AddButton({ onClick, testId, label }) {
    return (
        <button type="button" onClick={onClick} data-testid={testId} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white hover:border-white/40">
            <Plus className="h-3.5 w-3.5" /> {label}
        </button>
    );
}

export function NavEditor({ items, onChange }) {
    const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
    return (
        <Panel title="Menu" hint="Links do topo. O destino é o id da seção: catalogo, carros, hl, facs." testId="site-nav">
            {items.map((it, i) => (
                <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <TextField label="Texto" value={it.label} onChange={(v) => update(i, { label: v })} testId={`site-nav-label-${i}`} />
                    <TextField label="Destino" value={it.target} onChange={(v) => update(i, { target: v })} testId={`site-nav-target-${i}`} />
                    <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} testId={`site-nav-remove-${i}`} />
                </div>
            ))}
            <AddButton onClick={() => onChange([...items, { label: "Novo", target: "catalogo" }])} testId="site-nav-add" label="Adicionar link" />
        </Panel>
    );
}

export function CatalogEditor({ data, set }) {
    const items = data.items || [];
    const update = (i, patch) => set("items", items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
    return (
        <Panel title="Catálogo" hint="Os blocos da seção Catálogo (foto, título, texto e para onde leva ao clicar)." testId="site-catalog">
            <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Etiqueta" value={data.label} onChange={(v) => set("label", v)} testId="site-catalog-label" />
                <TextField label="Título" value={data.title} onChange={(v) => set("title", v)} testId="site-catalog-title" />
            </div>
            <AreaField label="Texto" value={data.subtitle} onChange={(v) => set("subtitle", v)} testId="site-catalog-subtitle" />
            <div className="grid gap-6">
                {items.map((it, i) => (
                    <div key={i} className="grid gap-4 rounded-sm border border-white/10 p-4" data-testid={`site-catalog-item-${i}`}>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Bloco 0{i + 1}</span>
                            <RemoveButton onClick={() => set("items", items.filter((_, idx) => idx !== i))} testId={`site-catalog-remove-${i}`} />
                        </div>
                        <ImageField label="Foto" value={it.image} onChange={(v) => update(i, { image: v })} testId={`site-catalog-image-${i}`} />
                        <div className="grid gap-4 sm:grid-cols-3">
                            <TextField label="Título" value={it.title} onChange={(v) => update(i, { title: v })} testId={`site-catalog-item-title-${i}`} />
                            <TextField label="Texto" value={it.text} onChange={(v) => update(i, { text: v })} testId={`site-catalog-item-text-${i}`} />
                            <TextField label="Leva para" value={it.target} onChange={(v) => update(i, { target: v })} testId={`site-catalog-item-target-${i}`} placeholder="carros, hl, facs" />
                        </div>
                    </div>
                ))}
            </div>
            <AddButton onClick={() => set("items", [...items, { title: "Novo", text: "", image: "", target: "catalogo" }])} testId="site-catalog-add" label="Adicionar bloco" />
        </Panel>
    );
}

export function CarsEditor({ data, set }) {
    return (
        <Panel title="Carros" hint="Projeto em destaque com galeria. A primeira foto é a capa." testId="site-cars">
            <div className="grid gap-5 sm:grid-cols-3">
                <TextField label="Etiqueta" value={data.label} onChange={(v) => set("label", v)} testId="site-cars-label" />
                <TextField label="Título" value={data.title} onChange={(v) => set("title", v)} testId="site-cars-title" />
                <TextField label="Selo (ex.: Preto fosco)" value={data.badge} onChange={(v) => set("badge", v)} testId="site-cars-badge" />
            </div>
            <AreaField label="Texto" value={data.text} onChange={(v) => set("text", v)} testId="site-cars-text" />
            <div className="space-y-1.5">
                <p className="text-sm font-medium">Galeria de fotos</p>
                <MediaListField items={data.images || []} onChange={(v) => set("images", v)} testId="site-cars-images" />
            </div>
        </Panel>
    );
}

export function HLEditor({ data, set }) {
    const videos = data.videos || [];
    const update = (i, patch) => set("videos", videos.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
    return (
        <Panel title="HL (vídeos)" hint="Envie o arquivo do vídeo (até 2 GB) ou cole um link do YouTube." testId="site-hl">
            <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Etiqueta" value={data.label} onChange={(v) => set("label", v)} testId="site-hl-label" />
                <TextField label="Título" value={data.title} onChange={(v) => set("title", v)} testId="site-hl-title" />
            </div>
            <AreaField label="Texto" value={data.text} onChange={(v) => set("text", v)} testId="site-hl-text" />
            <div className="grid gap-6">
                {videos.map((v, i) => (
                    <div key={i} className="grid gap-4 rounded-sm border border-white/10 p-4" data-testid={`site-hl-item-${i}`}>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Vídeo {String(i + 1).padStart(2, "0")}</span>
                            <RemoveButton onClick={() => set("videos", videos.filter((_, idx) => idx !== i))} testId={`site-hl-remove-${i}`} />
                        </div>
                        <TextField label="Título" value={v.title} onChange={(val) => update(i, { title: val })} testId={`site-hl-item-title-${i}`} />
                        <ImageField label="Vídeo (arquivo ou link)" value={v.url} onChange={(val) => update(i, { url: val })} testId={`site-hl-item-url-${i}`} accept="video" />
                        <ImageField label="Capa do vídeo (opcional)" value={v.poster} onChange={(val) => update(i, { poster: val })} testId={`site-hl-item-poster-${i}`} />
                    </div>
                ))}
            </div>
            <AddButton onClick={() => set("videos", [...videos, { title: "", url: "", poster: "" }])} testId="site-hl-add" label="Adicionar vídeo" />
        </Panel>
    );
}
