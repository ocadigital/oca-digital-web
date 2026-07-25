## Objetivo

Voltar o site OCA Digital ao **conteúdo, links e seções da versão de 9 de maio** (antes do revamp SaaS/IA), mantendo o **visual dark premium** (tokens, tipografia, gradientes, Header/Footer novos, mockups) que construímos nas últimas semanas.

## Passo 1 — Você reverte no histórico (ação sua)

Abra o histórico e restaure a versão de **9 de maio de 2026**, imediatamente anterior ao revamp completo.

- Clique em "Abrir histórico de versões" acima, ou use o botão de reverter abaixo da mensagem daquela data.
- Nada é perdido: as versões pós-revamp continuam no histórico e podem ser reaplicadas a qualquer momento.
- Me avise quando a reversão estiver feita — o preview vai mostrar o site "antigo" de fundo claro/agência.

## Passo 2 — Eu re-aplico o visual moderno por cima (minha ação)

Assim que você confirmar a reversão, eu faço:

### 2.1 Design system (base visual)
- Copio `src/index.css` e `tailwind.config.ts` da versão atual → tokens dark, paleta neon (roxo/azul/ciano), gradientes, sombras, tipografia premium.
- Garanto que todos os componentes shadcn herdem os novos tokens (sem `text-white`/`bg-black` hardcoded).

### 2.2 Chrome do site
- **Header** novo (glassmorphism + logo branca + CTA gradiente) substitui o header antigo, mas com **os mesmos itens de menu e âncoras** da versão de 9/mai.
- **Footer** novo (estrutura visual atual) com **os mesmos links, colunas e contatos** do footer antigo.
- **WhatsApp flutuante** e formatação BR mantidos (conforme memória do projeto).

### 2.3 Seções da home
Cada seção da home de 9/mai é preservada em conteúdo/ordem, mas re-estilizada com:
- Backgrounds dark + gradientes sutis
- Cards com bordas neon e hover states
- Ícones lucide-react atualizados
- Animações de entrada suaves
- Tipografia da versão atual

Seções específicas do revamp SaaS que **não existiam** em 9/mai (OcaOne, Dashboards Recharts, Automations, Integrations Hub, Metodologia, RealEstate, Diagnóstico interativo) serão **removidas** da home — voltamos à arquitetura anterior.

### 2.4 Outras páginas
- **Blog** (`/blog`, `/blog/:slug`), **404**, **Política de Privacidade**, **Termos de Uso** já estão no tema dark → mantidos como estão.
- Modal de download de e-book, share buttons, TOC do blog, scroll suave em âncoras `/#...`, botões de pricing com texto branco → mantidos (memórias do projeto).

### 2.5 SEO
- Title/description da versão antiga preservados (posicionamento de agência/marketing imobiliário).
- Remove o JSON-LD `SoftwareApplication` do revamp SaaS.

## O que fica fora deste plano
- Migração de e-mails para Lovable Emails e troca do destinatário para `anderson.goncalves81@gmail.com` — tratamos depois, como você já tinha decidido.
- Nenhuma mudança em edge functions, banco de dados ou lógica de formulários.

## Riscos / notas técnicas
- Se algum componente da versão de 9/mai usar classes hardcoded (`bg-white`, `text-gray-*`), eu troco por tokens semânticos ao re-estilizar — sem quebrar layout.
- Assets (imagens/logos) da versão antiga que não existirem mais no repo depois da reversão: eu reaproveito do histórico via `cross_project--read_project_file` ou regero se necessário.
- Se você quiser, no Passo 2 posso fazer um **diff prévio** listando seção por seção antes de aplicar o restyle — é só pedir.

## Próximo passo

Reverter no histórico para 9/mai e me avisar. A partir daí eu executo o Passo 2 em uma única rodada.
