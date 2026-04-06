// enable-rls.js — Enable RLS on all user-owned tables
require('dotenv').config({ path: '.env.test' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const statements = [
  // User
  `ALTER TABLE "User" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_row" ON "User"`,
  `CREATE POLICY "users_own_row" ON "User" FOR ALL USING (id = auth.uid()::text)`,

  // Bot
  `ALTER TABLE "Bot" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_bots" ON "Bot"`,
  `CREATE POLICY "users_own_bots" ON "Bot" FOR ALL USING (user_id = auth.uid()::text)`,

  // BotResponse
  `ALTER TABLE "BotResponse" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_botresponses" ON "BotResponse"`,
  `CREATE POLICY "users_own_botresponses" ON "BotResponse" FOR ALL USING (bot_id IN (SELECT id FROM "Bot" WHERE user_id = auth.uid()::text))`,

  // Conversation
  `ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_conversations" ON "Conversation"`,
  `CREATE POLICY "users_own_conversations" ON "Conversation" FOR ALL USING (user_id = auth.uid()::text)`,

  // Message
  `ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_messages" ON "Message"`,
  `CREATE POLICY "users_own_messages" ON "Message" FOR ALL USING (bot_id IN (SELECT id FROM "Bot" WHERE user_id = auth.uid()::text))`,

  // Payment
  `ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_payments" ON "Payment"`,
  `CREATE POLICY "users_own_payments" ON "Payment" FOR ALL USING (user_id = auth.uid()::text)`,

  // AuditLog
  `ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_auditlog" ON "AuditLog"`,
  `CREATE POLICY "users_own_auditlog" ON "AuditLog" FOR ALL USING (user_id = auth.uid()::text)`,

  // WebhookEvent
  `ALTER TABLE "WebhookEvent" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_webhookevents" ON "WebhookEvent"`,
  `CREATE POLICY "users_own_webhookevents" ON "WebhookEvent" FOR ALL USING (bot_id IN (SELECT id FROM "Bot" WHERE user_id = auth.uid()::text))`,

  // ApiKey
  `ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "users_own_apikeys" ON "ApiKey"`,
  `CREATE POLICY "users_own_apikeys" ON "ApiKey" FOR ALL USING (user_id = auth.uid()::text)`,

  // Subscription (plan catalog — public read)
  `ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "subscriptions_public_read" ON "Subscription"`,
  `CREATE POLICY "subscriptions_public_read" ON "Subscription" FOR SELECT USING (true)`,
];

async function main() {
  for (const sql of statements) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('OK:', sql.substring(0, 60));
    } catch (e) {
      console.error('ERR:', sql.substring(0, 60), '->', e.message);
    }
  }
  await prisma.$disconnect();
  console.log('\nDone.');
}

main();
