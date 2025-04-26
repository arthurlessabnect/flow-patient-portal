
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { patientData, nutritionistId } = await req.json()
    
    if (!patientData || !patientData.email || !patientData.name || !nutritionistId) {
      return new Response(
        JSON.stringify({ error: "Dados insuficientes para criar paciente" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
    
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(2, 10)
    
    // Create Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: patientData.email,
      password: tempPassword,
      email_confirm: true,
      app_metadata: { role: 'patient' },
      user_metadata: { full_name: patientData.name }
    })
    
    if (authError) {
      throw new Error(`Erro ao criar usuário Auth: ${authError.message}`)
    }
    
    // Insert data into patients table
    const { data: patientRecord, error: patientError } = await supabaseAdmin
      .from('patients')
      .insert({
        id: authData.user.id,
        auth_user_id: authData.user.id,
        nutritionist_id: nutritionistId,
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone || null,
        gender: patientData.gender || null,
        birth_date: patientData.birth_date || null,
        height_cm: patientData.height || null,
        initial_weight_kg: patientData.initial_weight || null,
        goal: patientData.goal || null,
        body_fat_percentage: patientData.body_fat_percentage || null,
        basal_metabolic_rate: patientData.bmr || null
      })
      .select()
      .single()
    
    if (patientError) {
      // If patient insert fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error(`Erro ao inserir paciente: ${patientError.message}`)
    }
    
    // Send invitation email
    const redirectTo = `${Deno.env.get('FRONTEND_URL')}/confirm-invitation`
    
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(patientData.email, {
      redirectTo,
    })
    
    if (inviteError) {
      throw new Error(`Erro ao enviar convite: ${inviteError.message}`)
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Paciente criado com sucesso", 
        patient: patientRecord 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message.includes('already been registered') ? 409 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
