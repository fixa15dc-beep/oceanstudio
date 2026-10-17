import { Component, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SiteProvider } from "@/context/SiteContext";
import Home from "@/pages/Home";
import AuthPage from "@/pages/AuthPage";
import Profile from "@/pages/Profile";
import CoursePlayer from "@/pages/CoursePlayer";
import Admin from "@/pages/Admin";
import WaterCursor from "@/components/WaterCursor";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A192F] px-6 text-center text-white">
                    <h1 className="font-display text-3xl font-semibold">Algo deu errado</h1>
                    <p className="mt-3 text-sm font-light text-white/60">
                        Recarregue a página para continuar.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A192F]"
                    >
                        Recarregar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function Protected({ children, admin = false }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#001524] text-sm text-white/60">
                Carregando...
            </div>
        );
    }
    if (!user) return <Navigate to="/entrar" replace />;
    if (admin && user.role !== "admin") return <Navigate to="/perfil" replace />;
    return children;
}

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <SiteProvider>
                <WaterCursor />
                <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/entrar" element={<AuthPage mode="login" />} />
                        <Route path="/cadastro" element={<AuthPage mode="register" />} />
                        <Route
                            path="/perfil"
                            element={
                                <Protected>
                                    <Profile />
                                </Protected>
                            }
                        />
                        <Route
                            path="/curso/:pid"
                            element={
                                <Protected>
                                    <CoursePlayer />
                                </Protected>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <Protected admin>
                                    <Admin />
                                </Protected>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
                <Toaster position="bottom-center" richColors />
                </SiteProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
