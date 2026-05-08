## Objetivo

Substituir o envio atual via Resend (que está falhando silenciosamente) pela infraestrutura nativa de e-mails do Lovable, e direcionar todas as notificações internas para `anderson.goncalves81@gmail.com`.

## Escopo

Três formulários enviarão e-mails:
1. **Hero — Diagnóstico Gratuito** (`src/components/Hero.tsx`)
2. **Contato — Envie sua mensagem** (`src/components/contact/ContactForm.tsx`)
3. **EbookModal — Baixar E-book** (`src/components/EbookModal.tsx`)

Cada formulário disparará **dois e-mails**:
- **Notificação interna** → `anderson.goncalves81@gmail.com` (alerta com os dados do lead)
- **Confirmação ao usuário** → e-mail informado no formulário (agradecimento + próximos passos)

No caso do EbookModal, o e-mail ao usuário incluirá um botão de **download do e-book** (link público hospedado no Storage ou URL fixa que você fornecer depois).

## Etapas

### 1. Configurar domínio de envio
- Solicitar setup do domínio de e-mail do Lovable (você precisará adicionar registros NS no provedor do domínio `ocadigital.com.br`, ou usar um subdomínio padrão se preferir)
- Provisionar a infraestrutura de e-mails (filas, tabelas de log, supressão, cron de envio)

### 2. Criar templates React Email com identidade OCA
Templates a criar em `supabase/functions/_shared/transactional-email-templates/`:
- `contact-internal-notification` — alerta interno (todos os 3 formulários reusam, variando por `formType`)
- `contact-user-confirmation` — confirmação para quem enviou Hero/Contact
- `ebook-user-delivery` — entrega do e-book ao usuário com botão de download

Estilo visual seguirá as cores da marca (laranja/primary do site).

### 3. Atualizar os 3 componentes
Cada formulário passará a:
- Salvar no banco (mantém comportamento atual de `leads_websiteoca` / `ebook_downloads`)
- Invocar `send-transactional-email` duas vezes (notificação interna + confirmação ao usuário) com `idempotencyKey` único

### 4. Remover edge function antiga
Deletar `send-contact-email` (Resend) após confirmar que a nova rota funciona.

## Detalhes técnicos

- Destinatário interno fixo no client: `anderson.goncalves81@gmail.com`
- `templateData` carregará: nome, email, telefone, tipo de empresa, serviço, mensagem (conforme o form)
- Logs de envio ficarão em `email_send_log` (consultável)
- Retry automático via fila pgmq em caso de rate-limit/falhas transitórias

## Pontos a confirmar com você

1. **Domínio de envio**: usar `ocadigital.com.br` (precisa adicionar registros NS no seu provedor de DNS) ou aceitar um subdomínio padrão Lovable?
2. **Link do e-book**: você tem URL do PDF? Posso usar um placeholder até você fornecer.
3. **Assunto dos e-mails internos**: sugiro `[OCA Site] Novo lead — {Formulário}`. Pode ser?
