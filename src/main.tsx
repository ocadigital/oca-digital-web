import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Tema claro é o padrão. ?tema=escuro mostra a versão escura antiga (fica salvo na sessão).
let tema = 'claro';
try {
  const pedido = new URLSearchParams(window.location.search).get('tema');
  if (pedido === 'claro' || pedido === 'escuro') sessionStorage.setItem('oca-tema', pedido);
  tema = sessionStorage.getItem('oca-tema') || 'claro';
} catch {
  /* sessionStorage indisponível */
}
if (tema === 'claro') document.documentElement.classList.add('tema-claro');

createRoot(document.getElementById("root")!).render(<App />);
