# Revamp OCA Digital → Plataforma SaaS de Automação + IA

Vamos pausar a migração de e-mails e fazer primeiro o redesign completo, reposicionando a OCA de "agência de marketing" para **plataforma SaaS de automação, IA e dashboards executivos** — referências visuais: Stripe, Linear, Vercel, Retool, Notion.

---

## 1. Design System (base de tudo)

Antes de mexer nas seções, reescrever o design system para um visual SaaS dark premium.

**Atualizar `src/index.css` e `tailwind.config.ts`:**
- Dark mode como **padrão** (aplicar `.dark` no `<html>`)
- Paleta: fundo `#0A0A0F` / `#0F0F1A`, superfícies `#13131F`, bordas sutis `#1F1F2E`
- Accent neon: roxo `hsl(265 90% 65%)` + azul `hsl(220 95% 65%)` + ciano `hsl(190 95% 60%)`
- Gradientes utilitários: `--gradient-primary` (roxo→azul), `--gradient-glow` (radial neon), `--gradient-mesh` (mesh sutil de fundo hero)
- Sombras com glow: `--shadow-glow`, `--shadow-card`, `--shadow-elevated`
- Border radius mais moderno (12–16px)
- Tipografia: manter Inter, mas pesos 500–800 para headings, tracking apertado
- Glassmorphism utilitário: `.glass` com `backdrop-blur` + bg semi-transparente
- Animações novas: `fade-in-up`, `glow-pulse`, `float`, `shimmer`, `gradient-shift`

Tudo via tokens semânticos HSL — nada de cor hardcoded em componentes.

---

## 2. Estrutura de páginas e navegação

**Novo menu (Header):** Soluções · OCA ONE · Automação IA · Integrações · Cases · Diagnóstico · Contato
- Navbar fixa com `backdrop-blur` + borda inferior sutil
- CTA primário "Agendar Diagnóstico" com gradiente neon
- Logo OCA mantida

**Rotas:** seguir página única (Index) com âncoras, mantendo `/blog`, `/admin/*`, etc. As novas seções viram componentes em `src/components/`.

---

## 3. Novas seções (substituem as atuais)

Criar/refatorar componentes:

1. **`Hero.tsx`** — headline "IA, automação e dashboards para empresas que querem escalar operação", sub, 2 CTAs (Agendar Diagnóstico / Ver Plataforma), **mockup grande do dashboard OCA ONE** (composição em SVG/HTML com cards flutuantes, mini-gráficos animados, indicadores em tempo real fake), gradient mesh de fundo + glow.

2. **`Problems.tsx`** (novo) — "Sua empresa está perdendo tempo e dinheiro com processos manuais?" — grid de 8 cards (inadimplência, cobranças manuais, planilhas, etc.) + ilustração de fluxo automatizado ao lado.

3. **`OcaOne.tsx`** (novo, substitui Products) — seção premium da plataforma com 3-4 mockups de dashboards (financeiro, clientes, cobranças, automações) em mosaico com glassmorphism.

4. **`Features.tsx`** (novo) — grid 3x4 com 12 features (Dashboard Executivo, CRM Inteligente, Cobrança Automatizada, Integração Asaas/ClickUp, WhatsApp, Contratos, Score de Risco, etc.) — cards com ícone Lucide em gradiente, hover glow.

5. **`Dashboards.tsx`** (novo) — showcase visual com gráficos fake (Recharts) de MRR, churn, LTV, inadimplência + filtros visuais (período, status, receita, risco) — não funcionais, só demonstrativos.

6. **`Automations.tsx`** (novo) — diagrama de fluxo conectando Formulário → WhatsApp → Asaas → ClickUp → CRM → Dashboard, com linhas SVG animadas (stroke-dasharray) e nós com glow.

7. **`Integrations.tsx`** (novo) — grid de logos/cards das integrações (Asaas, ClickUp, Google Sheets, WhatsApp, Pipedrive, OpenAI, N8N, APIs) em estilo "ecossistema" com órbitas.

8. **`Cases.tsx`** (refatorar Testimonials) — cards de métricas grandes (38% menos inadimplência, X horas economizadas, etc.) + 2-3 depoimentos curtos.

9. **`Diagnostic.tsx`** (refatorar Contact/Hero diagnostic) — CTA forte "Descubra o nível de automação da sua empresa", formulário moderno multi-step curto, score visual fake no final, CTA "Agendar demonstração" → Calendly.

10. **`Footer.tsx`** — refinar com branding, social, links rápidos, "tecnologias utilizadas" (linha de logos), botão flutuante WhatsApp, efeito gradiente sutil no topo.

**Remove/oculta:** seção "Sobre" institucional, "Produtos" antigo, FAQ pode ficar mais enxuto e tech.

---

## 4. SEO

Atualizar `<Helmet>` em `Index.tsx` e `index.html`:
- Title: "OCA Digital — Plataforma de Automação, IA e Dashboards para Operação Empresarial"
- Description focada em automação de cobrança, CRM inteligente, integração Asaas, dashboards financeiros
- Keywords: automação empresarial, IA para empresas, dashboards financeiros, CRM inteligente, automação cobrança, integração Asaas, automação WhatsApp, SaaS automação
- JSON-LD `SoftwareApplication`

---

## 5. UX e performance

- Animações com `framer-motion` (já leve) ou puramente CSS — fade-in-up no scroll
- Mobile-first: cada seção testada em 375px
- Lazy load de seções pesadas (Dashboards, Integrations)
- Mockups feitos em **HTML/SVG** (não imagens pesadas) — escalam perfeitos e ficam "vivos"

---

## Detalhes técnicos

- Stack atual mantida: React 18 + Vite + Tailwind + shadcn
- Forçar dark mode: adicionar `className="dark"` no `<html>` via `index.html` ou no root
- Gráficos: usar `recharts` (já provável no shadcn) — instalar se faltar
- Ícones: Lucide (já usado)
- Não mexer em: Blog, rotas Admin, EbookModal (já feito), Supabase schema
- E-mails do Lovable: pausamos esta migração; retomamos depois do revamp visual

---

## Entrega em fases (mesma resposta, mas sequencial)

**Fase 1 — Fundação:** design system + dark mode + Header novo + Hero novo (com mockup dashboard)
**Fase 2 — Plataforma:** Problems + OcaOne + Features + Dashboards
**Fase 3 — Conexões:** Automations + Integrations + Cases
**Fase 4 — Conversão:** Diagnostic + Footer + SEO + polish responsivo

Ao final, o site inteiro terá cara de produto SaaS real — não de agência.

---

**Confirma para eu começar pela Fase 1?** Se quiser ajustar algo (ex: manter alguma seção atual, trocar paleta neon por outro tom, incluir página dedicada `/oca-one` em vez de âncora), me diga antes que eu inicie.
