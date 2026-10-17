import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { API, apiError } from "../../api";

export default function AdminCourses() {
    const [cursos, setCursos] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [modules, setModules] = useState([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        API.get("/admin/products")
            .then((r) => {
                const cs = r.data.filter((p) => p.type === "curso");
                setCursos(cs);
                if (cs.length > 0) setSelectedId(cs[0].id);
            })
            .catch((e) => toast.error(apiError(e)));
    }, []);

    useEffect(() => {
        const c = cursos.find((x) => x.id === selectedId);
        setModules(c ? JSON.parse(JSON.stringify(c.modules || [])) : []);
    }, [selectedId, cursos]);

    const save = async () => {
        setBusy(true);
        try {
            const c = cursos.find((x) => x.id === selectedId);
            await API.put(`/admin/products/${selectedId}`, {
                name: c.name, description: c.description || "", price: c.price,
                category: c.category, type: c.type, image_url: c.image_url || "",
                featured: !!c.featured, active: !!c.active, modules,
            });
            toast.success("Conteúdo do curso salvo!");
        } catch (e) {
            toast.error(apiError(e));
        } finally {
            setBusy(false);
        }
    };

    const addModule = () =>
        setModules([...modules, { id: `m${Date.now()}`, title: "Novo módulo", lessons: [] }]);

    const removeModule = (mi) => setModules(modules.filter((_, i) => i !== mi));

    const setModuleTitle = (mi, title) =>
        setModules(modules.map((m, i) => (i === mi ? { ...m, title } : m)));

    const addLesson = (mi) =>
        setModules(modules.map((m, i) =>
            i === mi
                ? { ...m, lessons: [...m.lessons, { id: `l${Date.now()}`, title: "Nova aula", content_type: "text", video_url: "", text: "" }] }
                : m
        ));

    const updateLesson = (mi, li, patch) =>
        setModules(modules.map((m, i) =>
            i === mi ? { ...m, lessons: m.lessons.map((l, j) => (j === li ? { ...l, ...patch } : l)) } : m
        ));

    const removeLesson = (mi, li) =>
        setModules(modules.map((m, i) =>
            i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m
        ));

    if (cursos.length === 0) {
        return (
            <p className="rounded-2xl border border-white/10 bg-[#0A1220] p-8 text-sm text-white/55" data-testid="admin-courses-empty">
                Nenhum produto do tipo "Curso" ainda. Crie um produto na aba Produtos e ele aparecerá aqui.
            </p>
        );
    }

    return (
        <div data-testid="admin-courses-panel">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="w-full max-w-sm space-y-1.5">
                    <Label>Curso</Label>
                    <Select data-testid="admin-course-select" value={selectedId} onValueChange={setSelectedId}>
                        <SelectTrigger><SelectValue placeholder="Escolha o curso" /></SelectTrigger>
                        <SelectContent>
                            {cursos.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" data-testid="admin-module-add" onClick={addModule} className="rounded-full border-white/20 bg-transparent text-xs uppercase tracking-[0.14em] text-white hover:bg-white/10">
                        <Plus className="mr-2 h-4 w-4" /> Módulo
                    </Button>
                    <Button data-testid="admin-course-save" onClick={save} disabled={busy} className="rounded-full bg-white text-xs uppercase tracking-[0.14em] text-[#050B18] hover:bg-white/90">
                        <Save className="mr-2 h-4 w-4" /> {busy ? "Salvando..." : "Salvar conteúdo"}
                    </Button>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                {modules.map((mod, mi) => (
                    <div key={mod.id} className="rounded-2xl border border-white/10 bg-[#0A1220] p-6" data-testid={`admin-module-${mi}`}>
                        <div className="flex items-center gap-3">
                            <span className="font-display text-sm font-bold tracking-[0.16em] text-white/40">
                                M{mi + 1}
                            </span>
                            <Input
                                data-testid={`admin-module-title-${mi}`}
                                value={mod.title}
                                onChange={(e) => setModuleTitle(mi, e.target.value)}
                                className="max-w-md border-white/15"
                            />
                            <button data-testid={`admin-module-remove-${mi}`} onClick={() => removeModule(mi)} className="p-2 text-white/40 hover:text-red-500" aria-label="Remover módulo">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4 border-l-2 border-white/10 pl-5">
                            {mod.lessons.map((les, li) => (
                                <div key={les.id} className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4" data-testid={`admin-lesson-${mi}-${li}`}>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            data-testid={`admin-lesson-title-${mi}-${li}`}
                                            value={les.title}
                                            onChange={(e) => updateLesson(mi, li, { title: e.target.value })}
                                            className="border-white/15"
                                            placeholder="Título da aula"
                                        />
                                        <Select data-testid={`admin-lesson-type-${mi}-${li}`} value={les.content_type} onValueChange={(v) => updateLesson(mi, li, { content_type: v })}>
                                            <SelectTrigger className="w-32 shrink-0"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="video">Vídeo</SelectItem>
                                                <SelectItem value="text">Texto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <button data-testid={`admin-lesson-remove-${mi}-${li}`} onClick={() => removeLesson(mi, li)} className="p-2 text-white/40 hover:text-red-500" aria-label="Remover aula">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {les.content_type === "video" ? (
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Link do vídeo (YouTube, Vimeo...)</Label>
                                            <Input
                                                data-testid={`admin-lesson-video-${mi}-${li}`}
                                                value={les.video_url}
                                                onChange={(e) => updateLesson(mi, li, { video_url: e.target.value })}
                                                placeholder="https://youtube.com/watch?v=..."
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Conteúdo da aula</Label>
                                            <Textarea
                                                data-testid={`admin-lesson-text-${mi}-${li}`}
                                                rows={4}
                                                value={les.text}
                                                onChange={(e) => updateLesson(mi, li, { text: e.target.value })}
                                                placeholder="Escreva o conteúdo desta aula..."
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button data-testid={`admin-lesson-add-${mi}`} onClick={() => addLesson(mi)} className="text-xs font-semibold uppercase tracking-[0.14em] text-[#007AFF] hover:underline">
                                + Adicionar aula
                            </button>
                        </div>
                    </div>
                ))}
                {modules.length === 0 && (
                    <p className="rounded-2xl border border-white/10 bg-[#0A1220] p-8 text-sm text-white/55">
                        Este curso ainda não tem módulos. Comece adicionando o primeiro.
                    </p>
                )}
            </div>
        </div>
    );
}
