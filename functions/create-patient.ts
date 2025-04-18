
// Supabase Edge Function
// Esta função é responsável por:
// 1. Criar um usuário Auth com email/senha
// 2. Definir role como 'patient' nos metadados
// 3. Inserir os dados na tabela patients
// 4. Enviar email de convite

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Obter dados da requisição
    const { patientData, nutritionistId } = await req.json();
    
    // Validar dados
    if (!patientData || !patientData.email || !patientData.name || !nutritionistId) {
      return new Response(
        JSON.stringify({ error: "Dados insuficientes para criar paciente" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Criar cliente Supabase com a chave de serviço
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    // Gerar senha aleatória para criação inicial do usuário (será alterada pelo paciente)
    const tempPassword = Math.random().toString(36).slice(2, 10);
    
    // Criar usuário Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: patientData.email,
      password: tempPassword,
      email_confirm: true,
      app_metadata: { role: "patient" },
      user_metadata: { name: patientData.name }
    });
    
    if (authError) {
      throw new Error(`Erro ao criar usuário Auth: ${authError.message}`);
    }
    
    // Inserir dados na tabela patients
    const { data: patientRecord, error: patientError } = await supabaseAdmin
      .from("patients")
      .insert({
        auth_user_id: authData.user.id,
        nutritionist_id: nutritionistId,
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone || null,
        gender: patientData.gender || null,
        birth_date: patientData.birth_date || null,
        height: patientData.height || null,
        initial_weight: patientData.initial_weight || null,
        goal: patientData.goal || null,
        body_fat_percentage: patientData.body_fat_percentage || null,
        bmr: patientData.bmr || null
      })
      .select()
      .single();
    
    if (patientError) {
      throw new Error(`Erro ao inserir paciente: ${patientError.message}`);
    }
    
    // Enviar email de convite com link para definir senha
    const redirectTo = `${Deno.env.get("FRONTEND_URL")}/confirm-invitation`;
    
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(patientData.email, {
      redirectTo,
    });
    
    if (inviteError) {
      throw new Error(`Erro ao enviar convite: ${inviteError.message}`);
    }
    
    return new Response(
      JSON.stringify({ message: "Paciente criado com sucesso", patient: patientRecord }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
