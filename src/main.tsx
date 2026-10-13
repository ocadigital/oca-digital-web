import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Versão clara em teste: ?tema=claro liga, ?tema=escuro desliga; a escolha fica na sessão.
try {
  const tema = new URLSearchParams(window.location.search).get('tema');
  if (tema === 'claro' || tema === 'escuro') sessionStorage.setItem('oca-tema', tema);
  if (sessionStorage.getItem('oca-tema') === 'claro') document.documentElement.classList.add('tema-claro');
} catch {
  /* sessionStorage indisponível */
}

createRoot(document.getElementById("root")!).render(<App />);
