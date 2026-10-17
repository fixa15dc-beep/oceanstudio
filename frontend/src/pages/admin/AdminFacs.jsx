import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API, apiError } from "../../api";

export default function AdminFacs() {
    const [facs, setFacs] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState("");
    const [busy, setBusy] = useState(false);

    const load = () =>
        API.get("/facs").then((r) => setFacs(r.data)).catch((e) => toast.error(apiError(e)));

    useEffect(() => { load(); }, []);

    const create = async () => {
        if (!name.trim()) {
            toast.error("Dê um nome para a fac.");
            return;
        }
        setBusy(true);
        try {
            const imgs = images.split("\n").map((s) => s.trim()).filter(Boolean);
            await API.post("/admin/facs", { name: name.trim(), description: description.trim(), images: imgs });
            toast.success("Fac publicada no site!");
            setName("");
            setDescription("");
            setImages("");
            load();
        } catch (e) {
            toast.error(apiError(e));
        } finally {
            setBusy(false);
        }
    };

    const remove = async (f) => {
        if (!window.confirm(`Remover a fac "${f.name}" do site?`)) return;
        try {
            await API.delete(`/admin/facs/${f.id}`);
            toast.success("Fac removida.");
            load();
        } catch (e) {
            toast.error(apiError(e));
        }
    };

    return (
        <div className="space-y-10" data-testid="admin-facs-panel">
            <section className="rounded-2xl border border-white/10 bg-[#0A1220] p-8">
                <div className="flex items-center gap-3">
                    <Plus className="h-5 w-5 text-[#007AFF]" />
                    <h2 className="font-display text-2xl font-bold text-white">Publicar uma fac</h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm font-light text-white/55">
                    Envie o nome, uma descrição e as fotos do projeto. A fac aparece na
                    hora na seção "Facs" do site.
                </p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label>Nome da fac</Label>
                        <Input data-testid="admin-fac-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Facção Litoral" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Descrição</Label>
                        <Input data-testid="admin-fac-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Uniformes e carros da nova temporada" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <Label>Fotos (um link por linha)</Label>
                        <Textarea
                            data-testid="admin-fac-images"
                            rows={4}
                            value={images}
                            onChange={(e) => setImages(e.target.value)}
                            placeholder={"https://.../foto1.jpg\nhttps://.../foto2.jpg"}
                        />
                        <p className="text-xs font-light text-white/45">
                            A primeira foto da lista é a capa. Dica: suba as fotos no site e cole os links aqui.
                        </p>
                    </div>
                </div>
                <Button
                    data-testid="admin-fac-submit"
                    onClick={create}
                    disabled={busy}
                    className="mt-6 rounded-full bg-white px-8 text-xs uppercase tracking-[0.14em] text-[#050B18] hover:bg-white/90"
                >
                    {busy ? "Publicando..." : "Publicar fac"}
                </Button>
            </section>

            <section>
                <h2 className="font-display text-2xl font-bold text-white">Facs publicadas</h2>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0A1220]">
                    <table className="w-full text-sm" data-testid="admin-facs-table">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-[0.16em] text-white/40">
                                <th className="px-4 py-3 font-semibold">Capa</th>
                                <th className="px-4 py-3 font-semibold">Nome</th>
                                <th className="px-4 py-3 font-semibold">Fotos</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {facs.map((f) => (
                                <tr key={f.id} className="border-b border-white/5 last:border-0">
                                    <td className="px-4 py-3">
                                        {f.images && f.images.length > 0 ? (
                                            <img src={f.images[0]} alt="" className="h-10 w-16 rounded object-cover" />
                                        ) : (
                                            <span className="text-white/40">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-white">{f.name}</span>
                                        {f.description && <p className="text-xs font-light text-white/50">{f.description}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-white/70">{f.images ? f.images.length : 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button data-testid={`admin-fac-delete-${f.id}`} onClick={() => remove(f)} className="p-2 text-white/50 hover:text-red-500" aria-label="Remover fac">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {facs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-white/45">
                                        Nenhuma fac publicada ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
