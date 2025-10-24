import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Get the request body
    const { customer, billingType, value, dueDate, externalReference, description, callback } = await req.json()

    if (!customer || !value || !dueDate) {
      return new Response(
        JSON.stringify({ error: 'Customer, value, and dueDate are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get ASAAS API key from environment
    const asaasApiKey = Deno.env.get('ASAAS_API_KEY')
    if (!asaasApiKey) {
      console.error('ASAAS_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'ASAAS API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create payment in ASAAS
    const paymentData = {
      customer,
      billingType: billingType || 'CREDIT_CARD',
      value,
      dueDate,
      externalReference: externalReference || `payment_${Date.now()}`,
      description: description || 'Subscription Payment',
      callback: callback || 'https://bushotizgnzejxaqovjy.supabase.co/functions/v1/asaas-webhook'
    }

    // console.log('Creating payment in ASAAS:', paymentData)

    const response = await fetch('https://www.asaas.com/api/v3/payments', {
      method: 'POST',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      console.error('ASAAS API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('ASAAS error details:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: `ASAAS API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await response.json()
    // console.log('✅ ASAAS Payment Created:', data)

    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-asaas-payment function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 