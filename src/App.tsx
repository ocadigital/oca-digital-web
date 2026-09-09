
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CasesIndex = lazy(() => import("./pages/CasesIndex"));
const CaseDetail = lazy(() => import("./pages/CaseDetail"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProdutosPage = lazy(() => import("./pages/ProdutosPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Login = lazy(() => import("./pages/admin/Login"));
const PostsList = lazy(() => import("./pages/admin/PostsList"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-xl text-muted-foreground">Carregando...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/cases" element={<CasesIndex />} />
              <Route path="/cases/:slug" element={<CaseDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/produtos" element={<ProdutosPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/termos-de-uso" element={<TermsOfService />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/posts" element={
                <ProtectedRoute>
                  <PostsList />
                </ProtectedRoute>
              } />
              <Route path="/admin/posts/new" element={
                <ProtectedRoute>
                  <PostEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/posts/edit/:id" element={
                <ProtectedRoute>
                  <PostEditor />
                </ProtectedRoute>
              } />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
