# ASAAS Payment Integration Setup Guide

This guide will help you set up the ASAAS payment integration for the Doramio subscription system.

## Overview

The ASAAS integration provides a professional payment system with support for:
- Credit Card payments
- PIX (instant Brazilian payment)
- Bank Slip (Boleto Bancário)
- Automatic subscription activation
- Webhook payment confirmation

## Prerequisites

1. ASAAS account with API access
2. Supabase project with Edge Functions enabled
3. Environment variables configured

## Step 1: ASAAS Account Setup

### 1.1 Create ASAAS Account
1. Go to [ASAAS.com](https://www.asaas.com)
2. Create a new account
3. Complete your business verification
4. Get your API access token

### 1.2 Configure Payment Link
The payment link is already configured: `https://www.asaas.com/c/36n64rku440h4jh2`

## Step 2: Supabase Environment Variables

Add the following environment variables to your Supabase project:

### In Supabase Dashboard:
1. Go to Settings > API
2. Add these environment variables:

```bash
# ASAAS Configuration
ASAAS_ACCESS_TOKEN=your_asaas_access_token_here

# Supabase Configuration (already set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### In your local .env file:
```bash
REACT_APP_ASAAS_ACCESS_TOKEN=your_asaas_access_token_here
```

## Step 3: Database Setup

### 3.1 Run Migrations
Execute the following SQL in your Supabase SQL editor:

```sql
-- Create payment_records table for tracking ASAAS payments
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL,
  subscription_type TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_payment_id ON payment_records(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_created_at ON payment_records(created_at);

-- Enable RLS
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payment records" ON payment_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payment records" ON payment_records
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_payment_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_payment_records_updated_at
  BEFORE UPDATE ON payment_records
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_records_updated_at();
```

### 3.2 Update Subscription Plans
Update your subscription_plans table with ASAAS payment links:

```sql
-- Update existing plans with ASAAS payment links
UPDATE subscription_plans 
SET product_url = 'https://www.asaas.com/c/36n64rku440h4jh2'
WHERE name LIKE '%Basic%' OR name LIKE '%Premium%';
```

## Step 4: Deploy Edge Functions

### 4.1 Deploy ASAAS Webhook Function
1. Navigate to your project directory
2. Deploy the webhook function:

```bash
supabase functions deploy asaas-webhook
```

### 4.2 Configure Webhook URL in ASAAS
1. Go to your ASAAS dashboard
2. Navigate to Settings > Webhooks
3. Add a new webhook with:
   - URL: `https://your-project-ref.supabase.co/functions/v1/asaas-webhook`
   - Events: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`
   - Method: POST

## Step 5: Frontend Configuration

### 5.1 Update Environment Variables
Add to your `.env.local`:

```bash
REACT_APP_ASAAS_ACCESS_TOKEN=your_asaas_access_token_here
```

### 5.2 Test the Integration
1. Start your development server
2. Navigate to `/subscription`
3. Select a paid plan
4. Choose payment method
5. Complete payment through ASAAS
6. Verify subscription activation

## Step 6: Testing

### 6.1 Test Payment Flow
1. Create a test user account
2. Go to subscription page
3. Select Basic or Premium plan
4. Choose payment method
5. Complete payment
6. Verify subscription activation

### 6.2 Test Webhook
1. Make a test payment
2. Check Supabase logs for webhook processing
3. Verify user subscription is updated
4. Check payment_records table

## Step 7: Production Setup

### 7.1 Security Considerations
1. Enable webhook signature verification
2. Use production ASAAS account
3. Set up proper error monitoring
4. Configure backup payment verification

### 7.2 Monitoring
1. Set up alerts for failed payments
2. Monitor webhook delivery
3. Track subscription activation rates
4. Monitor payment success rates

## Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Events
- Check ASAAS webhook configuration
- Verify function deployment
- Check Supabase function logs

#### 2. Subscription Not Activating
- Check webhook processing logs
- Verify user email matching
- Check payment status in ASAAS

#### 3. Payment Link Not Working
- Verify ASAAS account status
- Check payment link configuration
- Test with different payment methods

### Debug Commands

```bash
# Check function logs
supabase functions logs asaas-webhook

# Test webhook locally
supabase functions serve asaas-webhook

# Check database
supabase db diff
```

## API Reference

### ASAAS Service Methods

```typescript
// Create payment
await asaasService.createPayment(paymentData)

// Get payment status
await asaasService.getPaymentStatus(paymentId)

// Create customer
await asaasService.createCustomer(customerData)

// Get payment link
asaasService.getPaymentLink(planType, successUrl)
```

### Webhook Events

- `PAYMENT_RECEIVED`: Payment received but not yet confirmed
- `PAYMENT_CONFIRMED`: Payment confirmed and processed

### Payment Statuses

- `PENDING`: Payment pending
- `RECEIVED`: Payment received
- `CONFIRMED`: Payment confirmed
- `OVERDUE`: Payment overdue
- `REFUNDED`: Payment refunded
- `CANCELLED`: Payment cancelled

## Support

For issues with:
- ASAAS integration: Check ASAAS documentation
- Supabase functions: Check Supabase logs
- Frontend issues: Check browser console
- Database issues: Check Supabase SQL editor

## Security Notes

1. Never expose ASAAS access tokens in client-side code
2. Always verify webhook signatures in production
3. Use environment variables for sensitive data
4. Implement proper error handling
5. Monitor for suspicious payment activity

## Cost Considerations

- ASAAS charges per transaction
- Supabase Edge Functions have usage limits
- Consider implementing payment caching
- Monitor webhook delivery costs

## Performance Optimization

1. Implement payment status caching
2. Use database indexes for queries
3. Optimize webhook processing
4. Implement retry logic for failed payments

## Backup Procedures

1. Manual subscription activation process
2. Payment verification fallback
3. Database backup procedures
4. Webhook retry mechanisms

---

**Note**: This integration is designed for Brazilian market with BRL currency and PIX/Boleto support. For international markets, additional configuration may be required. 