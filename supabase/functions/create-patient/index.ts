
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request data
    const { patientData, nutritionistId } = await req.json();
    
    if (!patientData || !patientData.email || !patientData.name || !nutritionistId) {
      return new Response(
        JSON.stringify({ error: "Dados insuficientes para criar paciente" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("Creating patient with data:", JSON.stringify(patientData));
    console.log("Nutritionist ID:", nutritionistId);
    
    // Create Supabase client with service role key
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
    
    // Generate random password for initial user creation
    const tempPassword = Math.random().toString(36).slice(2, 10);
    
    // Create Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: patientData.email,
      password: tempPassword,
      email_confirm: true,
      app_metadata: { role: "patient" },
      user_metadata: { name: patientData.name }
    });
    
    if (authError) {
      console.error("Auth error:", authError);
      throw new Error(`Erro ao criar usuário Auth: ${authError.message}`);
    }
    
    // Map gender values
    const genderMapping = {
      male: "Masculino",
      female: "Feminino"
    };
    
    // Insert data into patients table
    const { data: patientRecord, error: patientError } = await supabaseAdmin
      .from("patients")
      .insert({
        id: authData.user.id,
        auth_user_id: authData.user.id,
        nutritionist_id: nutritionistId,
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone || null,
        gender: patientData.gender ? genderMapping[patientData.gender as keyof typeof genderMapping] : null,
        birth_date: patientData.birth_date || null,
        height_cm: patientData.height || null,
        initial_weight_kg: patientData.initial_weight || null,
        goal: patientData.goal || null,
        body_fat_percentage: patientData.body_fat_percentage || null,
        basal_metabolic_rate: patientData.bmr || null
      })
      .select()
      .single();
    
    if (patientError) {
      console.error("Patient insert error:", patientError);
      throw new Error(`Erro ao inserir paciente: ${patientError.message}`);
    }
    
    // Send invitation email
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(patientData.email);
    
    if (inviteError) {
      console.error("Invite error:", inviteError);
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
    console.error("Error in create-patient function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
