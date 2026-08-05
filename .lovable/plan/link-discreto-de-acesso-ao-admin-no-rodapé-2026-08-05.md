# Link discreto de acesso ao Admin no rodapé

## Objetivo
Adicionar um acesso discreto à área administrativa do blog no rodapé do site, sem poluir o visual.

## O que será feito
- Incluir o link "Admin" na linha inferior do rodapé, ao lado de "Política de Privacidade" e "Termos de Uso".
- Estilo discreto: mesmo tamanho (`text-sm`), cor `text-muted-foreground` com hover em `text-primary`, seguindo o padrão dos links já existentes.
- O link aponta para `/admin/login`; quem já estiver autenticado segue direto para a listagem de posts.

## Detalhes técnicos
- Arquivo: `src/components/Footer.tsx` — acrescentar uma `<a href="/admin/login">Admin</a>` no bloco de links legais (linhas ~92-99).
- Rotas existentes já cobrem o fluxo: `/admin/login`, `/admin/posts`, `/admin/posts/new`, `/admin/posts/edit/:id` (protegidas por `ProtectedRoute`).
- Nenhuma alteração de autenticação, permissões ou conteúdo do site.
