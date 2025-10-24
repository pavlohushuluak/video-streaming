# Supabase Edge Functions Deployment Guide

## Overview
This guide explains how to deploy the ASAAS payment integration Edge Functions to Supabase.

## Edge Functions

### 1. check-asaas-customer
**Purpose**: Check if a customer exists in ASAAS
**Endpoint**: `POST /functions/v1/check-asaas-customer`
**Body**: `{ "email": "user@example.com" }`

### 2. create-asaas-customer
**Purpose**: Create a new customer in ASAAS
**Endpoint**: `POST /functions/v1/create-asaas-customer`
**Body**: `{ "name": "User Name", "email": "user@example.com", "phone": "+1234567890" }`

### 3. create-asaas-payment
**Purpose**: Create a new payment in ASAAS
**Endpoint**: `POST /functions/v1/create-asaas-payment`
**Body**: `{ "customer": {...}, "billingType": "CREDIT_CARD", "value": 29.90, "dueDate": "2024-01-15", "description": "Premium Plan" }`

### 4. get-asaas-payment-status
**Purpose**: Get payment status from ASAAS
**Endpoint**: `POST /functions/v1/get-asaas-payment-status`
**Body**: `{ "paymentId": "pay_xxx" }`

## Environment Variables

Set these in your Supabase project dashboard under Settings > Edge Functions:

```
ASAAS_API_KEY=$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjEyM2FiZjg3LTg0NDctNDg1Zi05NmE3LWI5ZDYwOTZjMDAyNTo6JGFhY2hfZWFjMzUxYjQtMjE5OS00YWMwLWEzNWItN2NlMGFjYTE3MWJk
```

## Deployment Steps

### Prerequisites
1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref YOUR_PROJECT_ID`

### Deploy Functions

1. **Deploy all functions**:
   ```bash
   supabase functions deploy
   ```

2. **Deploy individual functions**:
   ```bash
   supabase functions deploy check-asaas-customer
   supabase functions deploy create-asaas-customer
   supabase functions deploy create-asaas-payment
   supabase functions deploy get-asaas-payment-status
   ```

### Verify Deployment

1. Check function status:
   ```bash
   supabase functions list
   ```

2. Test functions locally (optional):
   ```bash
   supabase functions serve
   ```

## Testing

### Test check-asaas-customer
```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/check-asaas-customer' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com"}'
```

### Test create-asaas-customer
```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/create-asaas-customer' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"name": "Test User", "email": "test@example.com", "phone": "+1234567890"}'
```

### Test create-asaas-payment
```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/create-asaas-payment' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer": {"name": "Test User", "email": "test@example.com"},
    "billingType": "CREDIT_CARD",
    "value": 29.90,
    "dueDate": "2024-01-15",
    "description": "Premium Plan"
  }'
```

### Test get-asaas-payment-status
```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/get-asaas-payment-status' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"paymentId": "pay_xxx"}'
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the functions are deployed and the environment variables are set correctly.

2. **Authentication Errors**: Verify that your Supabase anon key is correct and the functions are properly deployed.

3. **ASAAS API Errors**: Check that the ASAAS_API_KEY environment variable is set correctly in your Supabase project.

### Debugging

1. Check function logs:
   ```bash
   supabase functions logs check-asaas-customer
   ```

2. Test functions locally with logs:
   ```bash
   supabase functions serve --debug
   ```

## Security Notes

- The ASAAS API key is stored securely in Supabase environment variables
- All functions include CORS headers for cross-origin requests
- Functions validate input data before making API calls
- Error responses don't expose sensitive information

## Next Steps

After deploying the functions:

1. Update your frontend code to use the Edge Functions instead of direct ASAAS API calls
2. Test the complete payment flow
3. Set up webhook endpoints for payment confirmations
4. Monitor function logs for any issues 