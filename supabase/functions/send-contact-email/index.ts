
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
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

    console.log('Saving to database:', formData);

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
      console.error('Database error:', dbError);
      throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
    }

    console.log('Saved to database successfully');

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
      to: ["contato@ocadigital.com.br"],
      subject: subject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

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
    console.error("Error in send-contact-email function:", error);
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
