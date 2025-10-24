import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { paymentId } = await req.json()

    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: 'Payment ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get ASAAS API key from environment
    const asaasApiKey = Deno.env.get('ASAAS_API_KEY')
    if (!asaasApiKey) {
      return new Response(
        JSON.stringify({ error: 'ASAAS API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Make request to ASAAS API
    const asaasResponse = await fetch(`https://sandbox.asaas.com/api/v3/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!asaasResponse.ok) {
      const errorText = await asaasResponse.text()
      return new Response(
        JSON.stringify({ 
          error: `ASAAS API error: ${asaasResponse.status}`, 
          details: errorText 
        }),
        { 
          status: asaasResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const paymentData = await asaasResponse.json()

    return new Response(
      JSON.stringify(paymentData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in get-asaas-payment-status:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 