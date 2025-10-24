# ASAAS Edge Functions Deployment Guide

## Prerequisites

1. **Supabase CLI installed**
   ```bash
   npm install -g supabase
   ```

2. **Logged into Supabase**
   ```bash
   supabase login
   ```

3. **Linked to your project**
   ```bash
   supabase link --project-ref bushotizgnzejxaqovjy
   ```

## Environment Variables

You need to set the ASAAS API key as an environment variable in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to Settings > API
3. Scroll down to "Environment Variables"
4. Add a new variable:
   - **Name**: `ASAAS_API_KEY`
   - **Value**: Your ASAAS API key (e.g., `$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjEyM2FiZjg3LTg0NDctNDg1Zi05NmE3LWI5ZDYwOTZjMDAyNTo6JGFhY2hfZWFjMzUxYjQtMjE5OS00YWMwLWEzNWItN2NlMGFjYTE3MWJk`)

## Deploy Functions

Deploy all the ASAAS functions:

```bash
# Deploy check-asaas-customer function
supabase functions deploy check-asaas-customer

# Deploy create-asaas-customer function
supabase functions deploy create-asaas-customer

# Deploy create-asaas-payment function
supabase functions deploy create-asaas-payment
```

## Verify Deployment

After deployment, you can test the functions:

```bash
# Test check-asaas-customer
curl -X POST https://bushotizgnzejxaqovjy.supabase.co/functions/v1/check-asaas-customer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email": "test@example.com"}'

# Test create-asaas-customer
curl -X POST https://bushotizgnzejxaqovjy.supabase.co/functions/v1/create-asaas-customer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"name": "Test User", "email": "test@example.com", "cpfCnpj": "00000000000"}'

# Test create-asaas-payment
curl -X POST https://bushotizgnzejxaqovjy.supabase.co/functions/v1/create-asaas-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"customer": "cus_000000000001", "value": 29.90, "dueDate": "2025-01-15"}'
```

## Troubleshooting

### CORS Errors
If you get CORS errors, make sure the functions are properly deployed and the environment variables are set.

### API Key Errors
If you get "ASAAS API key not configured" errors:
1. Check that the `ASAAS_API_KEY` environment variable is set in Supabase
2. Verify the API key is valid
3. Redeploy the functions after setting the environment variable

### Function Not Found
If you get "Function not found" errors:
1. Make sure you're linked to the correct project
2. Deploy the functions again
3. Check the Supabase Dashboard > Edge Functions to see if they're listed

## Function URLs

After deployment, your functions will be available at:
- `https://bushotizgnzejxaqovjy.supabase.co/functions/v1/check-asaas-customer`
- `https://bushotizgnzejxaqovjy.supabase.co/functions/v1/create-asaas-customer`
- `https://bushotizgnzejxaqovjy.supabase.co/functions/v1/create-asaas-payment`

## Testing the Payment Flow

1. Start your development server
2. Go to the subscription page
3. Select a basic or premium plan
4. Fill out the payment form
5. Check the browser console for API responses
6. Check the Supabase Dashboard > Logs for function execution logs 