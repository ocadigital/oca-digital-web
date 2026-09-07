
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const priorityLabels: Record<string, string> = {
  "padronizar-processos": "Padronizar os processos para garantir qualidade e escala",
  "novo-site": "Novo site integrado aos Portais com melhor custo/benefício",
  "pre-qualificacao": "Pré-qualificação de Leads (SDR) c/ Automação e Lead Score",
  "aumentar-leads": "Aumentar o número de Leads interessados",
  "chatbot-whatsapp": "Implementar um chatbot integrado ao WhatsApp",
};

interface EbookNotificationData {
  email: string;
  whatsapp: string;
  priority: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, whatsapp, priority }: EbookNotificationData = await req.json();

    const emailContent = `
      <h2>Novo Download de E-book - OCA Digital</h2>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp}</p>
      <p><strong>Prioridade nos próximos 6 meses:</strong> ${priorityLabels[priority] || priority}</p>
    `;

    console.log('Sending ebook download notification email');
    const emailResponse = await resend.emails.send({
      from: "OCA Digital <noreply@ocadigital.com.br>",
      to: ["anderson.goncalves81@gmail.com"],
      subject: "Novo Download de E-book - OCA Digital",
      html: emailContent,
    });

    if ((emailResponse as any)?.error) {
      console.error('Resend error:', JSON.stringify((emailResponse as any).error));
    } else {
      console.log('Email sent successfully');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error in notify-ebook-download function:', error instanceof Error ? error.message : 'unknown error');
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Erro interno do servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
