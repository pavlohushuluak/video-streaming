import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  try {
    const webhookData = await req.json();
    // console.log('Received ASAAS webhook:', webhookData);
    if (webhookData.event !== 'PAYMENT_RECEIVED' && webhookData.event !== 'PAYMENT_CONFIRMED') {
      // console.log('Ignoring non-payment event:', webhookData.event);
      return new Response('OK', {
        headers: corsHeaders
      });
    }
    const payment = webhookData.payment;
    if (payment.status !== 'CONFIRMED' && payment.status !== 'RECEIVED') {
      // console.log('Payment not confirmed, status:', payment.status);
      return new Response('OK', {
        headers: corsHeaders
      });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const asaasAccessToken = '$aact_sandbox_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjhiMDc2Mzk0LTE3NzAtNDJjNy1iZWY4LWM1MWNlMTgyM2JkNDo6JGFhY2hfOGY0OTZkZjQtN2Q4Yi00YjZjLTlmNDYtNjNiYmY0OTZhMzIy';
    if (!asaasAccessToken) {
      console.error('ASAAS access token not configured');
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
    const customerResponse = await fetch(`https://www.asaas.com/api/v3/customers/${payment.customer}`, {
      headers: {
        'Authorization': `Bearer ${asaasAccessToken}`
      }
    });
    if (!customerResponse.ok) {
      console.error('Failed to get customer details from ASAAS');
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
    const customerData = await customerResponse.json();
    const customerEmail = customerData.email;
    if (!customerEmail) {
      console.error('No customer email found');
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('email', customerEmail).single();
    if (profileError || !profile) {
      console.error('Profile not found for email:', customerEmail);
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
    let subscriptionType = 'basic';
    if (payment.value >= 14.90 || payment.description.toLowerCase().includes('premium')) {
      subscriptionType = 'premium';
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const { error: updateError } = await supabase.from('profiles').update({
      subscription: subscriptionType,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    }).eq('user_id', profile.user_id);
    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
    const { error: paymentRecordError } = await supabase.from('payment_records').insert({
      user_id: profile.user_id,
      payment_id: payment.id,
      amount: payment.value,
      currency: 'BRL',
      status: payment.status,
      subscription_type: subscriptionType,
      payment_method: payment.billingType,
      created_at: new Date().toISOString()
    });
    if (paymentRecordError) {
      console.error('Error storing payment record:', paymentRecordError);
    }
    // console.log(`✅ Updated subscription for ${customerEmail} to ${subscriptionType}`);
    return new Response('OK', {
      headers: corsHeaders
    });
  } catch (error) {
    // console.error('Error processing ASAAS webhook:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: corsHeaders
    });
  }
});
