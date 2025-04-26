
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Set admin role for bernardolessa06
    const { error: adminError } = await supabaseAdmin.auth.admin.updateUserById(
      'c9fbc12d-...',  // Replace with actual UID
      { user_metadata: {}, app_metadata: { role: 'admin' } }
    )

    if (adminError) {
      throw new Error(`Error setting admin role: ${adminError.message}`)
    }

    // Create test patient account
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'paciente.teste@example.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: { full_name: 'Paciente Teste' },
      app_metadata: { role: 'patient' }
    })

    if (createError) {
      throw new Error(`Error creating test patient: ${createError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Initial roles set successfully',
        testPatient: userData.user
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
