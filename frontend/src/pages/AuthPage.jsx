import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiError } from "../api";
import { useAuth } from "../context/AuthContext";
import { WaveLogo, WaveMark } from "../components/WaveLogo";

export default function AuthPage({ mode = "login" }) {
    const isLogin = mode === "login";
    const navigate = useNavigate();
    const { user, loading, login, register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    if (!loading && user) return <Navigate to={user.role === "admin" ? "/admin" : "/perfil"} replace />;

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const u = isLogin ? await login(email, password) : await register(name, email, password);
            toast.success(isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
            navigate(u.role === "admin" ? "/admin" : "/perfil");
        } catch (err) {
            setError(apiError(err));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A192F] px-5 py-20">
            <WaveMark className="pointer-events-none absolute -left-20 -top-20 h-96 w-auto text-white/[0.04]" />
            <WaveMark className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-auto text-white/[0.04]" />

            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <Link to="/" data-testid="auth-logo">
                        <WaveLogo />
                    </Link>
                </div>
                <div className="border border-white/10 bg-white p-8 sm:p-10">
                    <div className="mb-8 flex gap-2">
                        <button
                            data-testid="auth-tab-login"
                            onClick={() => navigate("/entrar")}
                            className={`flex-1 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                                isLogin ? "border-[#0A192F] bg-[#0A192F] text-white" : "border-[#0A192F]/20 text-[#0A192F]/60 hover:border-[#0A192F]"
                            }`}
                        >
                            Entrar
                        </button>
                        <button
                            data-testid="auth-tab-register"
                            onClick={() => navigate("/cadastro")}
                            className={`flex-1 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                                !isLogin ? "border-[#0A192F] bg-[#0A192F] text-white" : "border-[#0A192F]/20 text-[#0A192F]/60 hover:border-[#0A192F]"
                            }`}
                        >
                            Criar conta
                        </button>
                    </div>

                    <h1 className="font-display text-3xl font-semibold tracking-wide text-[#0A192F]">
                        {isLogin ? "Bem-vindo de volta" : "Criar sua conta"}
                    </h1>
                    <p className="mt-2 text-sm font-light text-[#0F172A]/60">
                        {isLogin
                            ? "Entre para ver os cursos liberados no seu perfil."
                            : "Cadastre-se e acompanhe seus cursos da Ocean Studio aqui."}
                    </p>

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Seu nome</Label>
                                <Input
                                    id="name"
                                    data-testid="auth-name-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Como podemos te chamar?"
                                    required
                                    minLength={2}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                data-testid="auth-email-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="voce@email.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                data-testid="auth-password-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <p data-testid="auth-error" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            data-testid="auth-submit"
                            disabled={busy}
                            className="w-full rounded-none bg-[#0A192F] py-3 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#0A192F]/90"
                        >
                            {busy ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
                        </Button>
                    </form>
                </div>
                <p className="mt-6 text-center">
                    <Link to="/" className="text-xs uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white">
                        ← Voltar para o site
                    </Link>
                </p>
            </div>
        </div>
    );
}
