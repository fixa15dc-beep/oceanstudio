import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { MediaField } from "../../components/Uploader";
import { API, apiError, formatPrice, CATEGORY_LABEL, TYPE_LABEL } from "../../api";

const EMPTY = {
    name: "", description: "", price: 0, category: "carros",
    type: "pack", image_url: "", featured: false, active: true,
    modules: [],
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null); // null | "new" | product
    const [form, setForm] = useState(EMPTY);

    const load = () =>
        API.get("/admin/products")
            .then((r) => setProducts(r.data))
            .catch((e) => toast.error(apiError(e)));

    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(EMPTY); setEditing("new"); };
    const openEdit = (p) => {
        setForm({
            name: p.name, description: p.description || "", price: p.price,
            category: p.category, type: p.type, image_url: p.image_url || "",
            featured: !!p.featured, active: !!p.active, modules: p.modules || [],
        });
        setEditing(p);
    };

    const save = async () => {
        try {
            const body = { ...form, price: Number(form.price) || 0 };
            if (editing === "new") await API.post("/admin/products", body);
            else await API.put(`/admin/products/${editing.id}`, body);
            toast.success("Produto salvo!");
            setEditing(null);
            load();
        } catch (e) {
            toast.error(apiError(e));
        }
    };

    const remove = async (p) => {
        if (!window.confirm(`Remover "${p.name}"? Os acessos ligados a ele também serão removidos.`)) return;
        try {
            await API.delete(`/admin/products/${p.id}`);
            toast.success("Produto removido.");
            load();
        } catch (e) {
            toast.error(apiError(e));
        }
    };

    return (
        <div data-testid="admin-products-panel">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-white">Produtos da vitrine</h2>
                <Button data-testid="admin-product-new" onClick={openNew} className="rounded-full bg-white text-xs uppercase tracking-[0.14em] text-[#06091A] hover:bg-white/90">
                    <Plus className="mr-2 h-4 w-4" /> Novo produto
                </Button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0A1220]">
                <table className="w-full text-sm" data-testid="admin-products-table">
                    <thead>
                        <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-[0.16em] text-white/40">
                            <th className="px-4 py-3 font-semibold">Produto</th>
                            <th className="px-4 py-3 font-semibold">Categoria</th>
                            <th className="px-4 py-3 font-semibold">Tipo</th>
                            <th className="px-4 py-3 font-semibold">Preço</th>
                            <th className="px-4 py-3 font-semibold">Destaque</th>
                            <th className="px-4 py-3 font-semibold">Ativo</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b border-white/5 last:border-0">
                                <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                                <td className="px-4 py-3 text-white/70">{CATEGORY_LABEL[p.category] || p.category}</td>
                                <td className="px-4 py-3 text-white/70">{TYPE_LABEL[p.type] || p.type}</td>
                                <td className="px-4 py-3 text-white/70">{formatPrice(p.price)}</td>
                                <td className="px-4 py-3 text-white/70">{p.featured ? "Sim" : "—"}</td>
                                <td className="px-4 py-3 text-white/70">{p.active ? "Sim" : "Não"}</td>
                                <td className="px-4 py-3 text-right">
                                    <button data-testid={`admin-product-edit-${p.id}`} onClick={() => openEdit(p)} className="p-2 text-white/50 hover:text-[#007AFF]" aria-label="Editar">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button data-testid={`admin-product-delete-${p.id}`} onClick={() => remove(p)} className="p-2 text-white/50 hover:text-red-500" aria-label="Remover">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-white/45">
                                    Nenhum produto ainda. Crie o primeiro.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
                <DialogContent className="max-h-[85vh] overflow-auto rounded-2xl border-white/10 sm:max-w-lg" data-testid="admin-product-dialog">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl text-white">
                            {editing === "new" ? "Novo produto" : "Editar produto"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Nome</Label>
                            <Input data-testid="admin-product-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Descrição</Label>
                            <Textarea data-testid="admin-product-description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Preço (R$)</Label>
                                <Input data-testid="admin-product-price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Categoria</Label>
                                <Select data-testid="admin-product-category" value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hl">HL</SelectItem>
                                        <SelectItem value="carros">Carros</SelectItem>
                                        <SelectItem value="roupas">Roupas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Tipo</Label>
                                <Select data-testid="admin-product-type" value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="curso">Curso</SelectItem>
                                        <SelectItem value="pack">Pack</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Imagem</Label>
                                <MediaField testId="admin-product-image" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
                            </div>
                        </div>
                        <div className="flex gap-10 pt-2">
                            <label className="flex items-center gap-3 text-sm text-white/80">
                                <Switch data-testid="admin-product-featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                                Destaque
                            </label>
                            <label className="flex items-center gap-3 text-sm text-white/80">
                                <Switch data-testid="admin-product-active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                                Ativo na vitrine
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => setEditing(null)}>Cancelar</Button>
                        <Button data-testid="admin-product-save" onClick={save} className="rounded-full bg-white text-xs uppercase tracking-[0.14em] text-[#06091A] hover:bg-white/90">
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
