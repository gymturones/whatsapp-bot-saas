# WhatsApp Webhook Debugging Guide

## ✅ Fixes Implemented (2026-04-03)

### 1. API Version Update
- **File**: `src/lib/whatsapp.ts`
- **Change**: Updated API URL from v18.0 to v22.0
- **Before**: `https://graph.instagram.com/v18.0`
- **After**: `https://graph.instagram.com/v22.0`

### 2. Environment Variable Validation
- **File**: `src/lib/whatsapp.ts`
- **Added**: Validation for critical WhatsApp env vars on module load
- **Logs**: Missing vars logged with details

### 3. Fixed Import Error
- **File**: `src/pages/api/messages/send.ts`
- **Error**: Was importing `sendMessage` (doesn't exist)
- **Fixed**: Changed to `sendWhatsAppMessage` (actual export)
- **Impact**: Eliminates build warning

### 4. Enhanced Webhook Logging
- **File**: `src/pages/api/webhooks/whatsapp.ts`
- **GET (Verification)**:
  - Validates WHATSAPP_VERIFY_TOKEN is set
  - Detailed mode/token validation logging
  - Success/failure indicators with emoji

- **POST (Message Processing)**:
  - Logs incoming payload structure
  - Logs message count and status count
  - Logs individual message/status processing
  - Better error handling

## 🧪 Testing the Webhook

### Step 1: Verify Environment Variables
Check that these are set in Vercel (Settings > Environment Variables):
```
WHATSAPP_VERIFY_TOKEN=whatsapp-verify-gymturones-2026
WHATSAPP_ACCESS_TOKEN=EAA... (System User token, not Graph Explorer)
WHATSAPP_PHONE_NUMBER_ID=1100794673107744
WHATSAPP_BUSINESS_ACCOUNT_ID=1291432572925612
```

### Step 2: Test Webhook Verification (GET)
In Meta App Dashboard > WhatsApp > Configuration:
1. Click "Edit"
2. Verify Token field, set to: `whatsapp-verify-gymturones-2026`
3. Callback URL: `https://whatsapp-bot-saas-nine.vercel.app/api/webhooks/whatsapp`
4. Click "Verify and Save"

Expected response in Vercel logs:
```
✅ Webhook verification successful
```

If fails, you'll see:
```
❌ Webhook verification failed
reasonModeInvalid: false | true
reasonTokenInvalid: false | true
```

### Step 3: Test Incoming Messages
Send a message from Meta Business Account test number.

Expected logs:
```
📨 Incoming webhook POST
✅ Webhook payload parsed
📝 Processing incoming message
📊 Processing status update
```

### Step 4: Check Conversation Storage
In Supabase, verify:
- Message saved to `messages` table
- Conversation created/updated in `conversations` table
- Status is correct (incoming/outgoing)

## 🔧 Troubleshooting

### "Verification failed" on webhook setup
1. Check WHATSAPP_VERIFY_TOKEN matches exactly
2. Verify callback URL is correct and public
3. Check Vercel logs for detailed error

### No messages received
1. Verify WHATSAPP_ACCESS_TOKEN is a System User token (not Graph Explorer)
2. Check WHATSAPP_PHONE_NUMBER_ID is correct
3. Verify webhook is subscribed to messages field in Meta dashboard

### 500 Error on POST
Check logs for:
- Database connection issues
- OpenAI API key missing (for AI responses)
- Conversation creation failures

## 📋 Current Status
- ✅ API version updated
- ✅ Environment validation added
- ✅ Imports fixed
- ✅ Logging enhanced
- ⏳ Pending: System User token creation (current token expires in 24h)
- ⏳ Pending: Moving to Production mode in Meta App
