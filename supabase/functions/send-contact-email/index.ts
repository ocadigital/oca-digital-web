
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  tipo_de_empresa: string;
  servico?: string;
  comment: string;
  form: string;
}

// Nome legível de cada formulário do site, para o negócio mostrar de onde veio
const ORIGENS: Record<string, string> = {
  contact_form: 'Formulário de contato',
  servico_card: 'Card de serviço',
  diagnostico: 'Diagnóstico',
  maturity_test: 'Teste de Maturidade',
  hero_diagnostic: 'Diagnóstico gratuito (home)',
};

// Secrets no Supabase: OCA_ONE_WEBHOOK_URL (ex.: https://mentoria-azure.vercel.app/api/webhook/entrada)
// e OCA_ONE_WEBHOOK_KEY (o mesmo valor de WEBHOOK_KEY na Vercel do OCA One)
async function enviarParaCrm(formData: ContactFormData) {
  const url = Deno.env.get('OCA_ONE_WEBHOOK_URL');
  const chave = Deno.env.get('OCA_ONE_WEBHOOK_KEY');
  if (!url || !chave) {
    console.log('CRM: secrets não configurados, conversão não enviada');
    return;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-key': chave },
      body: JSON.stringify({
        empresa_nome: Deno.env.get('OCA_ONE_EMPRESA') ?? 'OCA Digital',
        pipeline_nome: Deno.env.get('OCA_ONE_PIPELINE') ?? undefined,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        tipo_de_empresa: formData.tipo_de_empresa,
        servico: formData.servico,
        mensagem: formData.comment,
        origem: ORIGENS[formData.form] ?? formData.form,
        utm_source: 'site-oca',
      }),
      signal: AbortSignal.timeout(10000),
    });
    console.log('CRM: status', res.status);
  } catch (e) {
    console.error('CRM: falha ao enviar', e instanceof Error ? e.message : 'erro');
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Avoid logging PII (names, emails, phone numbers)
    console.log('Saving contact lead to database');

    // Save to database
    const { data, error: dbError } = await supabase
      .from('leads_websiteoca')
      .insert([{
        form: formData.form,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        tipo_de_empresa: formData.tipo_de_empresa,
        comment: formData.comment
      }]);

    if (dbError) {
      console.error('Database error:', dbError.code);
      throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
    }

    console.log('Saved to database successfully');

    // Envia a conversão para o CRM (OCA One). Falha aqui não derruba o formulário.
    await enviarParaCrm(formData);

    // Prepare email content
    const isHeroForm = formData.form === 'hero_diagnostic';
    const subject = isHeroForm ? 'Novo Diagnóstico Solicitado - OCA Digital' : 'Nova Mensagem de Contato - OCA Digital';
    
    let emailContent = `
      <h2>${subject}</h2>
      <p><strong>Formulário:</strong> ${isHeroForm ? 'Diagnóstico Gratuito (Hero)' : 'Formulário de Contato'}</p>
      <p><strong>Nome:</strong> ${formData.nome}</p>
      <p><strong>E-mail:</strong> ${formData.email}</p>
      <p><strong>Telefone:</strong> ${formData.telefone}</p>
      <p><strong>Tipo de Empresa:</strong> ${formData.tipo_de_empresa}</p>
    `;

    if (formData.servico) {
      emailContent += `<p><strong>Serviço de Interesse:</strong> ${formData.servico}</p>`;
    }

    emailContent += `<p><strong>Mensagem:</strong><br>${formData.comment}</p>`;

    // Send notification email
    console.log('Sending email notification');
    const emailResponse = await resend.emails.send({
      from: "OCA Digital <noreply@ocadigital.com.br>",
      to: ["anderson@ocadigital.com.br"],
      subject: subject,
      html: emailContent,
    });

    if ((emailResponse as any)?.error) {
      console.error('Resend error:', JSON.stringify((emailResponse as any).error));
    } else {
      console.log('Email sent successfully');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Dados salvos e email enviado com sucesso!" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-contact-email function:', error instanceof Error ? error.message : 'unknown error');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
