import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, KeyRound, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { API, apiError, formatPrice } from "../../api";

export default function AdminAccess() {
    const [grants, setGrants] = useState([]);
    const [students, setStudents] = useState([]);
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState("");
    const [productId, setProductId] = useState("");
    const [busy, setBusy] = useState(false);
    const [created, setCreated] = useState(null); // {email, password}

    const load = () => {
        API.get("/admin/grants").then((r) => setGrants(r.data)).catch((e) => toast.error(apiError(e)));
        API.get("/admin/students").then((r) => setStudents(r.data)).catch(() => {});
        API.get("/admin/products").then((r) => setProducts(r.data)).catch(() => {});
    };

    useEffect(() => { load(); }, []);

    const grant = async () => {
        if (!email.trim() || !productId) {
            toast.error("Informe o e-mail do cliente e escolha o produto.");
            return;
        }
        setBusy(true);
        try {
            const r = await API.post("/admin/grants", { email: email.trim(), product_id: productId });
            const p = products.find((x) => x.id === productId);
            toast.success(`Acesso liberado: ${r.data.product_name || p?.name} → ${r.data.email}`);
            if (r.data.account_created && r.data.generated_password) {
                setCreated({ email: r.data.email, password: r.data.generated_password });
            }
            setEmail("");
            load();
        } catch (e) {
            toast.error(apiError(e));
        } finally {
            setBusy(false);
        }
    };

    const revoke = async (g) => {
        if (!window.confirm(`Remover o acesso de ${g.email} ao produto "${g.product_name}"?`)) return;
        try {
            await API.delete(`/admin/grants/${g.id}`);
            toast.success("Acesso removido.");
            load();
        } catch (e) {
            toast.error(apiError(e));
        }
    };

    return (
        <div className="space-y-12" data-testid="admin-access-panel">
            {/* LIBERAR ACESSO */}
            <section className="rounded-2xl border border-white/10 bg-[#0A1220] p-8">
                <div className="flex items-center gap-3">
                    <KeyRound className="h-5 w-5 text-[#007AFF]" />
                    <h2 className="font-display text-2xl font-bold text-white">Setar acesso de um cliente</h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm font-light text-white/55">
                    Busque pelo e-mail da conta do cliente no site e libere exatamente o
                    curso/pack que ele comprou no Discord. Se o e-mail ainda não tiver
                    conta no site, uma conta é criada automaticamente.
                </p>
                <div className="mt-6 flex flex-wrap items-end gap-4">
                    <div className="w-full max-w-xs space-y-1.5">
                        <Label>E-mail do cliente</Label>
                        <Input data-testid="admin-grant-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" />
                    </div>
                    <div className="w-full max-w-xs space-y-1.5">
                        <Label>Produto comprado</Label>
                        <Select data-testid="admin-grant-product" value={productId} onValueChange={setProductId}>
                            <SelectTrigger><SelectValue placeholder="Escolha o produto" /></SelectTrigger>
                            <SelectContent>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button data-testid="admin-grant-submit" onClick={grant} disabled={busy} className="rounded-full bg-white px-8 text-xs uppercase tracking-[0.14em] text-[#050B18] hover:bg-white/90">
                        {busy ? "Liberando..." : "Liberar acesso"}
                    </Button>
                </div>
            </section>

            {/* ACESSOS ATIVOS */}
            <section>
                <h2 className="font-display text-2xl font-bold text-white">Acessos liberados</h2>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0A1220]">
                    <table className="w-full text-sm" data-testid="admin-grants-table">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-[0.16em] text-white/40">
                                <th className="px-4 py-3 font-semibold">Cliente</th>
                                <th className="px-4 py-3 font-semibold">Produto</th>
                                <th className="px-4 py-3 font-semibold">Liberado em</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {grants.map((g) => (
                                <tr key={g.id} className="border-b border-white/5 last:border-0">
                                    <td className="px-4 py-3 font-medium text-white">{g.email}</td>
                                    <td className="px-4 py-3 text-white/70">{g.product_name}</td>
                                    <td className="px-4 py-3 text-white/55">
                                        {g.granted_at ? new Date(g.granted_at).toLocaleDateString("pt-BR") : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button data-testid={`admin-grant-remove-${g.id}`} onClick={() => revoke(g)} className="p-2 text-white/50 hover:text-red-500" aria-label="Remover acesso">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {grants.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-white/45">
                                        Nenhum acesso liberado ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ALUNOS CADASTRADOS */}
            <section>
                <h2 className="font-display text-2xl font-bold text-white">Alunos cadastrados</h2>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0A1220]">
                    <table className="w-full text-sm" data-testid="admin-students-table">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-[0.16em] text-white/40">
                                <th className="px-4 py-3 font-semibold">Nome</th>
                                <th className="px-4 py-3 font-semibold">E-mail</th>
                                <th className="px-4 py-3 font-semibold">Acessos</th>
                                <th className="px-4 py-3 font-semibold">Cadastro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.id} className="border-b border-white/5 last:border-0">
                                    <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                                    <td className="px-4 py-3 text-white/70">{s.email}</td>
                                    <td className="px-4 py-3 text-white/70">
                                        {s.grants.length > 0
                                            ? s.grants.map((g) => g.product_name).join(", ")
                                            : <span className="text-white/40">Nenhum</span>}
                                    </td>
                                    <td className="px-4 py-3 text-white/55">
                                        {s.created_at ? new Date(s.created_at).toLocaleDateString("pt-BR") : "—"}
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-white/45">
                                        Nenhum aluno cadastrado ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <Dialog open={!!created} onOpenChange={(o) => !o && setCreated(null)}>
                <DialogContent className="rounded-2xl border-white/10 sm:max-w-md" data-testid="admin-created-account-dialog">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl text-white">Conta criada automaticamente</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm font-light text-white/60">
                        O cliente não tinha conta no site, então criamos uma. Passe essas
                        credenciais para ele:
                    </p>
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-5 text-sm">
                        <p><span className="font-semibold">E-mail:</span> {created?.email}</p>
                        <div className="flex items-center justify-between gap-3">
                            <p><span className="font-semibold">Senha temporária:</span> {created?.password}</p>
                            <button
                                data-testid="admin-copy-password"
                                onClick={() => navigator.clipboard?.writeText(created?.password || "")}
                                className="p-2 text-white/50 hover:text-[#007AFF]"
                                aria-label="Copiar senha"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-white/45">
                        Anote antes de fechar — a senha não é exibida novamente.
                    </p>
                </DialogContent>
            </Dialog>
        </div>
    );
}
