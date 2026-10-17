import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, X, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiError } from "../api";
import { uploadFile } from "../lib/upload";
import { assetUrl, isDirectVideo } from "../lib/media";

const ACCEPT = {
    image: "image/jpeg,image/png,image/webp,image/gif,image/avif",
    video: "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",
    any: "image/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",
};

/** Hidden file input + pill button with progress. Calls onDone(file) for each uploaded file. */
export function UploadButton({ onDone, accept = "any", multiple = false, testId = "upload-button", label = "Enviar arquivo" }) {
    const ref = useRef(null);
    const [progress, setProgress] = useState(null);

    const pick = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = "";
        for (const f of files) {
            try {
                setProgress(0);
                const saved = await uploadFile(f, setProgress);
                onDone(saved);
                toast.success(`"${f.name}" enviado.`);
            } catch (err) {
                toast.error(apiError(err));
            }
        }
        setProgress(null);
    };

    return (
        <>
            <input ref={ref} type="file" className="hidden" accept={ACCEPT[accept]} multiple={multiple} onChange={pick} data-testid={`${testId}-input`} />
            <button
                type="button"
                data-testid={testId}
                disabled={progress !== null}
                onClick={() => ref.current?.click()}
                className="relative inline-flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full border border-white/15 px-4 text-xs font-medium text-white transition-colors hover:border-white/40 disabled:cursor-wait"
            >
                {progress !== null && (
                    <span className="absolute inset-y-0 left-0 bg-white/15 transition-[width] duration-200" style={{ width: `${progress}%` }} />
                )}
                <Upload className="relative h-3.5 w-3.5" />
                <span className="relative" data-testid={`${testId}-label`}>
                    {progress === null ? label : `${progress}%`}
                </span>
            </button>
        </>
    );
}

export function MediaPreview({ url, className = "h-16 w-24" }) {
    if (!url) return <div className={`${className} rounded border border-dashed border-white/15`} />;
    if (isDirectVideo(url)) {
        return (
            <div className={`${className} flex items-center justify-center rounded border border-white/10 bg-black/40 text-white/60`}>
                <Film className="h-5 w-5" />
            </div>
        );
    }
    return <img src={assetUrl(url)} alt="" className={`${className} rounded object-cover`} />;
}

/** URL input + upload button + preview, for a single media field. */
export function MediaField({ value, onChange, accept = "image", testId = "media-field", placeholder = "https://... ou envie um arquivo" }) {
    return (
        <div className="flex items-center gap-3">
            <MediaPreview url={value} className="h-12 w-20 shrink-0" />
            <Input data-testid={`${testId}-url`} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            <UploadButton accept={accept} testId={`${testId}-upload`} onDone={(f) => onChange(f.url)} label="Enviar" />
            {value && (
                <button type="button" data-testid={`${testId}-clear`} onClick={() => onChange("")} className="p-2 text-white/40 hover:text-white" aria-label="Limpar">
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

/** List of media URLs with multi-upload, reorder (drag-free: move up) and remove. */
export function MediaListField({ items, onChange, accept = "image", testId = "media-list" }) {
    const [manual, setManual] = useState("");
    const add = (urls) => onChange([...(items || []), ...urls.filter(Boolean)]);
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    const moveUp = (i) => {
        if (i === 0) return;
        const next = [...items];
        [next[i - 1], next[i]] = [next[i], next[i - 1]];
        onChange(next);
    };
    return (
        <div className="space-y-3" data-testid={testId}>
            <div className="flex flex-wrap gap-3">
                {(items || []).map((u, i) => (
                    <div key={`${u}-${i}`} className="group relative" data-testid={`${testId}-item-${i}`}>
                        <MediaPreview url={u} className="h-20 w-28" />
                        <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 px-1 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <button type="button" onClick={() => moveUp(i)} data-testid={`${testId}-up-${i}`} className="px-1 hover:underline">← mover</button>
                            <button type="button" onClick={() => remove(i)} data-testid={`${testId}-remove-${i}`} className="px-1 text-red-300 hover:underline">remover</button>
                        </div>
                        {i === 0 && <span className="absolute left-1 top-1 rounded bg-white px-1.5 text-[10px] font-semibold text-[#06091A]">capa</span>}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3">
                <Input
                    data-testid={`${testId}-manual`}
                    value={manual}
                    onChange={(e) => setManual(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add([manual.trim()]); setManual(""); } }}
                    placeholder="Colar link e Enter, ou enviar arquivos"
                />
                <UploadButton accept={accept} multiple testId={`${testId}-upload`} onDone={(f) => add([f.url])} label="Enviar arquivos" />
            </div>
        </div>
    );
}
