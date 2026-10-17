import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API, apiError } from "../../api";

export default function AdminSettings() {
    const [discordUrl, setDiscordUrl] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        API.get("/settings")
            .then((r) => setDiscordUrl(r.data.discord_url || ""))
            .catch((e) => toast.error(apiError(e)));
    }, []);

    const save = async () => {
        setBusy(true);
        try {
            await API.put("/admin/settings", { discord_url: discordUrl });
            toast.success("Configurações salvas!");
        } catch (e) {
            toast.error(apiError(e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="max-w-2xl" data-testid="admin-settings-panel">
            <h2 className="font-display text-2xl font-bold text-white">Configurações da vitrine</h2>
            <div className="mt-6 space-y-1.5 rounded-2xl border border-white/10 bg-[#0A1220] p-8">
                <Label>Link do servidor no Discord</Label>
                <Input
                    data-testid="admin-settings-discord"
                    value={discordUrl}
                    onChange={(e) => setDiscordUrl(e.target.value)}
                    placeholder="https://discord.gg/seu-convite"
                />
                <p className="pt-2 text-xs font-light text-white/50">
                    Este é o link usado em todos os botões "Comprar no Discord" do site.
                </p>
                <Button
                    data-testid="admin-settings-save"
                    onClick={save}
                    disabled={busy}
                    className="mt-4 rounded-full bg-white px-8 text-xs uppercase tracking-[0.14em] text-[#050B18] hover:bg-white/90"
                >
                    <Save className="mr-2 h-4 w-4" /> {busy ? "Salvando..." : "Salvar"}
                </Button>
            </div>
        </div>
    );
}
