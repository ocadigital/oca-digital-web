import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// O index.html não carrega o GTM em /admin nem no navegador marcado como interno.
// Se a pessoa chegou por uma página pública (GTM já carregado) e navegou até o admin,
// marca o navegador e recarrega para a página do admin abrir sem o GTM.
const AdminSemAnalytics = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith('/admin')) return;
    try {
      localStorage.setItem('ocaInterno', '1');
    } catch {
      return;
    }
    if ((window as unknown as { google_tag_manager?: unknown }).google_tag_manager) window.location.reload();
  }, [pathname]);
  return null;
};

export default AdminSemAnalytics;
