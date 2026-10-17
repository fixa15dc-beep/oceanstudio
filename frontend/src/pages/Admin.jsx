import { Link } from "react-router-dom";
import { LogOut, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { WaveLogo } from "../components/WaveLogo";
import AdminProducts from "./admin/AdminProducts";
import AdminCourses from "./admin/AdminCourses";
import AdminAccess from "./admin/AdminAccess";
import AdminSettings from "./admin/AdminSettings";

export default function Admin() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <header className="bg-[#0A192F] pb-10 pt-10 text-white">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <WaveLogo />
                            <span className="hidden h-8 w-px bg-white/20 sm:block" />
                            <div>
                                <h1 className="font-display text-2xl font-semibold tracking-wide" data-testid="admin-title">
                                    Painel do Administrador
                                </h1>
                                <p className="text-xs font-light text-white/50">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                data-testid="admin-view-site"
                                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors hover:bg-white/10"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Ver site
                            </Link>
                            <button
                                data-testid="admin-logout"
                                onClick={logout}
                                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors hover:bg-white/10"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                <Tabs defaultValue="produtos">
                    <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-[#0A192F]/10 bg-transparent p-0">
                        {[
                            { v: "produtos", label: "Produtos" },
                            { v: "cursos", label: "Conteúdo dos Cursos" },
                            { v: "acessos", label: "Acessos dos Clientes" },
                            { v: "config", label: "Configurações" },
                        ].map((t) => (
                            <TabsTrigger
                                key={t.v}
                                value={t.v}
                                data-testid={`admin-tab-${t.v}`}
                                className="rounded-none border-b-2 border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0F172A]/50 data-[state=active]:border-[#0A192F] data-[state=active]:bg-transparent data-[state=active]:text-[#0A192F] data-[state=active]:shadow-none"
                            >
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="produtos" className="mt-8">
                        <AdminProducts />
                    </TabsContent>
                    <TabsContent value="cursos" className="mt-8">
                        <AdminCourses />
                    </TabsContent>
                    <TabsContent value="acessos" className="mt-8">
                        <AdminAccess />
                    </TabsContent>
                    <TabsContent value="config" className="mt-8">
                        <AdminSettings />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
