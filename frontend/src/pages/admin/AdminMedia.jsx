import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { API, apiError } from "../../api";
import { UploadButton, MediaPreview } from "../../components/Uploader";
import { assetUrl, formatBytes } from "../../lib/media";

export default function AdminMedia() {
    const [files, setFiles] = useState([]);

    const load = () => API.get("/admin/uploads").then((r) => setFiles(r.data)).catch((e) => toast.error(apiError(e)));
    useEffect(() => { load(); }, []);

    const copy = async (f) => {
        await navigator.clipboard.writeText(f.url);
        toast.success("Link copiado. Cole em qualquer campo de foto/vídeo.");
    };

    const remove = async (f) => {
        if (!window.confirm(`Apagar "${f.name}"? Onde ele estiver em uso vai parar de aparecer.`)) return;
        try {
            await API.delete(`/admin/uploads/${f.id}`);
            toast.success("Arquivo apagado.");
            load();
        } catch (e) {
            toast.error(apiError(e));
        }
    };

    return (
        <div className="space-y-8" data-testid="admin-media-panel">
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-white/10 bg-[#0A1220] p-6 sm:p-8">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-white">Arquivos</h2>
                    <p className="mt-1 text-xs text-white/45">Fotos e vídeos (até 2 GB cada). Copie o link e use em qualquer campo do site.</p>
                </div>
                <UploadButton multiple accept="any" testId="media-upload" onDone={() => load()} label="Enviar arquivos" />
            </section>

            <div className="overflow-x-auto rounded-sm border border-white/10 bg-[#0A1220]">
                <table className="w-full text-sm" data-testid="admin-media-table">
                    <thead>
                        <tr className="border-b border-white/10 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                            <th className="px-4 py-3 font-medium">Prévia</th>
                            <th className="px-4 py-3 font-medium">Nome</th>
                            <th className="px-4 py-3 font-medium">Tipo</th>
                            <th className="px-4 py-3 font-medium">Tamanho</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((f) => (
                            <tr key={f.id} className="border-b border-white/5 last:border-0" data-testid={`media-row-${f.id}`}>
                                <td className="px-4 py-3"><MediaPreview url={f.url} className="h-10 w-16" /></td>
                                <td className="px-4 py-3">
                                    <a href={assetUrl(f.url)} target="_blank" rel="noreferrer" className="text-white hover:underline">{f.name}</a>
                                </td>
                                <td className="px-4 py-3 text-white/60">{f.kind === "video" ? "Vídeo" : "Imagem"}</td>
                                <td className="px-4 py-3 text-white/60">{formatBytes(f.size)}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => copy(f)} data-testid={`media-copy-${f.id}`} className="p-2 text-white/50 hover:text-white" aria-label="Copiar link"><Copy className="h-4 w-4" /></button>
                                    <button onClick={() => remove(f)} data-testid={`media-delete-${f.id}`} className="p-2 text-white/50 hover:text-red-400" aria-label="Apagar"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {files.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-white/45">Nenhum arquivo enviado ainda.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
