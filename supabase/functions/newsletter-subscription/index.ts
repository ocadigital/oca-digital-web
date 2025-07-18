
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterSubscriptionData {
  email: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source = 'blog' }: NewsletterSubscriptionData = await req.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email inválido" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Saving newsletter subscription:', { email, source });

    // Save to database
    const { data, error: dbError } = await supabase
      .from('newsletter_subscriptions')
      .insert([{
        email: email,
        source: source
      }]);

    if (dbError) {
      // Check if it's a duplicate email error
      if (dbError.code === '23505') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Este email já está cadastrado na nossa newsletter" 
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      console.error('Database error:', dbError);
      throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
    }

    console.log('Newsletter subscription saved successfully');

    // Send notification email to company
    const emailContent = `
      <h2>Nova Inscrição na Newsletter - OCA Digital</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Origem:</strong> ${source}</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
    `;

    console.log('Sending notification email');
    const emailResponse = await resend.emails.send({
      from: "OCA Digital <noreply@ocadigital.com.br>",
      to: ["contato@ocadigital.com.br"],
      subject: "Nova Inscrição na Newsletter - OCA Digital",
      html: emailContent,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Inscrição realizada com sucesso! Você receberá nossos melhores conteúdos." 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in newsletter-subscription function:", error);
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
