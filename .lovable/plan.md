# Revamp Visual — Dark Premium (referência: print enviado)

## Objetivo
Aplicar um novo visual dark com acentos roxo/violeta elétrico ao site, replicando o mood do print anexado. **Nenhum conteúdo, texto, link, seção, rota, formulário ou funcionalidade será alterado** — apenas estilos (cores, tipografia, cards, bordas, gradientes, sombras, glows).

## Direção visual (extraída do print)
- **Fundo**: preto azulado profundo (`#0A0A12` / `hsl(240 20% 5%)`) com sutis gradientes radiais violeta no topo das seções hero-like.
- **Cards**: superfícies escuras `hsl(240 15% 9%)` com borda `hsl(240 15% 18%)`, cantos arredondados (14–18px), hover com glow violeta suave.
- **Acento primário**: violeta elétrico `hsl(265 90% 66%)` (botões, ícones, destaques, gráficos).
- **Texto**: branco levemente frio para títulos, cinza-lavanda `hsl(240 10% 70%)` para body.
- **Tipografia**: manter a família atual, apenas ajustar pesos/tracking para títulos maiores e mais confiantes (tracking-tight, font-semibold/bold).
- **Detalhes**: gradientes lineares violeta→azul em CTAs primários, ícones dentro de "chips" quadrados com fundo violeta translúcido, números/stats grandes em gradiente.

## Escopo de arquivos (apenas estilo)
1. **`src/index.css`** — reescrever tokens `:root` para o tema dark permanente (background, foreground, card, primary, border, muted, accent, ring, sidebar-*) usando a paleta acima. Adicionar tokens auxiliares: `--gradient-primary`, `--gradient-hero-glow`, `--shadow-glow`, `--shadow-card`.
2. **`tailwind.config.ts`** — se necessário, expor os novos gradientes/sombras como utilitários.
3. **Componentes de seção** (`Hero`, `Services`, `Products`, `About`, `Blog`, `FAQ`, `Contact`, `Testimonials`, `EbookModal`, `NewsletterForm`, `Header`, `Footer`): substituir classes hardcoded (`bg-white`, `text-black`, `bg-gray-*`, `text-gray-*`, `border-gray-*` etc.) por tokens semânticos (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`). Ajustar cards para o novo estilo (borda sutil + glow no hover). **Nenhuma alteração de layout estrutural, ordem, texto ou props funcionais.**
4. **Páginas** (`Index`, `BlogIndex`, `BlogPost`, `NotFound`, `PrivacyPolicy`, `TermsOfService`): mesma varredura de tokens.
5. **Componentes shadcn (`src/components/ui/*`)**: manter — já consomem tokens; o tema virá automaticamente.

## Fora do escopo
- Nenhuma mudança em rotas, textos, imagens de conteúdo, formulários, integrações (Supabase, e-mail), lógica de negócio, admin, blog CMS.
- Nenhum toggle de light/dark: o site passa a ser dark-first permanente (como o print).

## Validação
- Após aplicar: rodar preview e conferir Hero, Services, Products, Stats/Contadores, Contact form e Footer batendo com o mood do print (fundo escuro, acentos violeta, cards com borda sutil).
- Checar que os botões "Contratar agora" continuam com texto branco (regra de memória).
